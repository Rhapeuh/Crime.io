import http from 'http';
import { env } from 'process';
import { Server as IOServer } from 'socket.io';

const httpServer = http.createServer((_req, res) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	res.end(env.HOME);
});

httpServer.listen(9876, () => {
	console.log(`Server running at http://localhost:9876/`); // <-- pour verif que le serveur tourne bien
});

const io = new IOServer(httpServer, { cors: { origin: true } });

io.on('connection', socket => {
	console.log(`Nouvelle connexion du client ${socket.id}`);

	socket.emit('premiereConnexion', "tu t'est bien connecté");

	socket.on('disconnect', () => {
		console.log(`Deconnexion du client ${socket.id}`);
	});
});
