import http from 'http';
import { env } from 'process';
import { Server as IOServer } from 'socket.io';
import JeuSolo from './JeuSolo.ts';
import type { Socket } from 'socket.io';

const httpServer = http.createServer((_req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end(env.HOME);
});

httpServer.listen(9876, () => {
	console.log(`Server running at http://localhost:9876/`); // <-- pour verif que le serveur tourne bien
});
let jeu: JeuSolo;
const io = new IOServer(httpServer, { cors: { origin: true } });

io.on('connection', socket => {
	startNewGame(socket);
	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.on('disconnect', () => {
		console.log(`Deconnexion du client ${socket.id}`);
	});

	socket.on('reset', startNewGame);

});


function startNewGame(socket : Socket){
	jeu = new JeuSolo(socket as Socket);
}