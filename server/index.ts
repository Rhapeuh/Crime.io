import http from 'http';
import { env } from 'process';
import { Server as IOServer } from 'socket.io';
import Jeu from './Jeu.ts';
import type { Socket } from 'socket.io';

const httpServer = http.createServer((_req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end(env.HOME);
});

httpServer.listen(9876, () => {
	console.log(`Server running at http://localhost:9876/`); // <-- pour verif que le serveur tourne bien
});
let jeu: Jeu;
const io = new IOServer(httpServer, { cors: { origin: true } });

io.on('connection', socket => {
	jeu = new Jeu(socket as Socket)
	socket.emit('initImage', jeu.getCoordonee())
	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.emit('premiereConnexion', "tu t'est bien connecté");

	socket.on('initTailleEcran', (tailleEcran: { width: number, height: number }) => {
        jeu.setTailleEcran(tailleEcran.width, tailleEcran.height);
    });

	socket.on('updateInput', (input: { vx: number, vy: number }) => {
        jeu.updateInput(input.vx, input.vy);
    });

	socket.on('disconnect', () => {
		console.log(`Deconnexion du client ${socket.id}`);
	});
});
