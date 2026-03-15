import http from 'http';
import { env } from 'process';
import { Server as IOServer } from 'socket.io';
import JeuSolo from './JeuSolo.ts';
import type { Socket } from 'socket.io';
import { randomInt } from 'crypto';
import JeuMulti from './JeuMulti.ts';
import TopScores from './data/score.json' with { type: 'json' };

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
let partieMulti: JeuMulti | null = null;

io.on('connection', socket => {
	socket.emit('premiereConnexion', genereNom());
	socket.on('rejoindreSolo', (pseudo: string) => {
		startNewGame(pseudo, socket);
	});

	socket.on('rejoindreMulti', (pseudo: string) => {
		if (partieMulti === null) {
			partieMulti = new JeuMulti(io);
		}

		partieMulti.ajouterJoueur(socket, pseudo);

		socket.on('quitterMulti', verifJeuMulti);
	});

	socket.on('disconnect', () => {
		if (partiesSoloEnCours.has(socket.id)) {
			partiesSoloEnCours.get(socket.id)?.destroy();
			partiesSoloEnCours.delete(socket.id);
		}
		verifJeuMulti();
	});
	socket.on('quitterSolo', () => {
		if (partiesSoloEnCours.has(socket.id)) {
			partiesSoloEnCours.get(socket.id)?.destroy();
			partiesSoloEnCours.delete(socket.id);
		}
	});

	socket.on('demandeScore', () => {
		socket.emit('envoiScore', TopScores.topScore);
	});
});

function startNewGame(pseudo: string, socket: Socket) {
	if (partiesSoloEnCours.has(socket.id)) {
		partiesSoloEnCours.get(socket.id)?.destroy();
	}

	const nouveauJeu = new JeuSolo(pseudo, socket);
	partiesSoloEnCours.set(socket.id, nouveauJeu);
}

function genereNom(): string {
	return `Joueur${randomInt(10000)}`;
}

function verifJeuMulti() {
	if (partieMulti && partieMulti.getNbJoueurs() === 0) {
		partieMulti.destroy();
		partieMulti = null;
	}
}