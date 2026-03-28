import http from 'http';
import { env } from 'process';
import { Server as IOServer } from 'socket.io';
import JeuSolo from './JeuSolo.ts';
import type { Socket } from 'socket.io';
import { randomInt } from 'crypto';
import JeuMulti from './JeuMulti.ts';
import { readFile } from 'fs/promises';

const max_player = 20;

const httpServer = http.createServer((_req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end(env.HOME);
});

httpServer.listen(9876, () => {
	console.log(`Server running at http://localhost:9876/`); // <-- pour verif que le serveur tourne bien
});

const io = new IOServer(httpServer, { cors: { origin: true } });

const partiesSoloEnCours = new Map<string, JeuSolo>();
const partieMultiEnCours = new Map<string, JeuMulti>();

io.on('connection', socket => {
	socket.emit('premiereConnexion', genereNom());

	socket.on('rejoindreSolo', (pseudo: string, difficulte: number, spriteId: string) => {
		startNewGame(pseudo, socket, difficulte, spriteId);
	});

	socket.on('getAllRoom', () => {
		const test = envoyerListeRooms();
		socket.emit('allRoom', test);
	});

	socket.on('rejoindreMulti', (pseudo: string, nameRoom: string, spriteId: string) => {
		if (!nameRoom || nameRoom === '') nameRoom = `${pseudo}'s room`;

		const partieExistante = partieMultiEnCours.get(nameRoom);

		if (partieExistante && partieExistante.getNbJoueurs() >= max_player) {
			socket.emit('plusDePlace');
			return;
		}

		socket.join(nameRoom);

		if (!partieMultiEnCours.has(nameRoom)) {
			partieMultiEnCours.set(nameRoom, new JeuMulti(io, nameRoom));
		}

		const partieActuel = partieMultiEnCours.get(nameRoom);
		partieActuel?.ajouterJoueur(socket, pseudo, spriteId);
		console.log(`room ${nameRoom} rejointe`);

		socket.on('quitterMulti', () => verifJeuMulti(nameRoom));
		socket.on('disconnect', () => {
			verifJeuMulti(nameRoom);
		});
	});

	socket.on('disconnect', () => {
		if (partiesSoloEnCours.has(socket.id)) {
			partiesSoloEnCours.get(socket.id)?.destroy();
			partiesSoloEnCours.delete(socket.id);
		}
	});
	socket.on('quitterSolo', () => {
		if (partiesSoloEnCours.has(socket.id)) {
			partiesSoloEnCours.get(socket.id)?.destroy();
			partiesSoloEnCours.delete(socket.id);
		}
	});

	socket.on('demandeScore', async () => {
		try {
			const contenu = await readFile('data/score.json', 'utf8');
			socket.emit('envoiScore', JSON.parse(contenu).topScore);
		} catch (err) {
			console.log("Le fichier n'existe pas encore ou est illisible.");
		}
	});
});

function startNewGame(pseudo: string, socket: Socket, difficulte: number, spriteId: string) {
	if (partiesSoloEnCours.has(socket.id)) {
		partiesSoloEnCours.get(socket.id)?.destroy();
	}

	const nouveauJeu = new JeuSolo(pseudo, socket, spriteId);
	nouveauJeu.setDifficulte(difficulte);
	partiesSoloEnCours.set(socket.id, nouveauJeu);
}

function genereNom(): string {
	return `Joueur${randomInt(10000)}`;
}

function verifJeuMulti(nameRoom: string) {
	const partie = partieMultiEnCours.get(nameRoom);
	if (partie && partie.getNbJoueurs() === 0) {
		partie.destroy();
		partieMultiEnCours.delete(nameRoom);
	}
}

function envoyerListeRooms() {
	return Array.from(partieMultiEnCours.entries()).map(([nom, partie]) => {
		return {
			nom: nom,
			joueursActuels: partie.getNbJoueurs(),
			joueursMax: max_player,
		};
	});
}