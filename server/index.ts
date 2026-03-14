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

const partiesEnCours = new Map<string, JeuSolo>();

const io = new IOServer(httpServer, { cors: { origin: true } });

io.on('connection', socket => {
	socket.on('createSoloView', () => {startNewGame(socket)})

	socket.on('disconnect', () => {
        if (partiesEnCours.has(socket.id)) {
            partiesEnCours.get(socket.id)?.destroy();
            partiesEnCours.delete(socket.id);
        }
    });
});


function startNewGame(socket : Socket){
	if (partiesEnCours.has(socket.id)) {
        partiesEnCours.get(socket.id)?.destroy();
    }
    
    const nouveauJeu = new JeuSolo(socket);
    partiesEnCours.set(socket.id, nouveauJeu);
}