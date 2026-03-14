import http from 'http';
import { env } from 'process';
import { Server as IOServer } from 'socket.io';
import JeuSolo from './JeuSolo.ts';
import type { Socket } from 'socket.io';
import { randomInt } from 'crypto';
import JeuMulti from './JeuMulti.ts';

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
const partieMulti = new JeuMulti(io);

io.on('connection', socket => {
    socket.emit('premiereConnexion', genereNom());
	socket.on('rejoindreSolo', (pseudo: string) => {
		startNewGame(pseudo, socket);
	});

	socket.on('rejoindreMulti', (pseudo: string) => {
		partieMulti.ajouterJoueur(socket, pseudo);
	});

	socket.on('disconnect', () => {
        if (partiesSoloEnCours.has(socket.id)) {
					partiesSoloEnCours.get(socket.id)?.destroy();
					partiesSoloEnCours.delete(socket.id);
				}
    });
});


function startNewGame(pseudo: string, socket : Socket){
	if (partiesSoloEnCours.has(socket.id)) {
		partiesSoloEnCours.get(socket.id)?.destroy();
	}
    
    const nouveauJeu = new JeuSolo(pseudo, socket);
    partiesSoloEnCours.set(socket.id, nouveauJeu);
}

function genereNom(): string {
        return `Joueur${randomInt(10000)}`; 
}