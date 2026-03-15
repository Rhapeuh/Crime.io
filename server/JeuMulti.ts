import type { Socket } from 'socket.io';
import Joueur from '../common/Joueur.ts';
import Jeu from './Jeu.ts';
import { Server as IOServer } from 'socket.io';

export default class JeuMulti extends Jeu {
	private listJoueurs: Map<string, Joueur> = new Map();
	private io: IOServer;

	constructor(io: IOServer) {
		super();
		this.io = io;

		setInterval(() => {
			this.update();
		}, 1000 / 60);
	}

	ajouterJoueur(socket: Socket, pseudo: string) {
		const newJoueur = new Joueur(pseudo, { x: 50, y: 50 }, 1, 3, 50, 50);
		this.listJoueurs.set(socket.id, newJoueur);
		this.game.addJoueur(newJoueur);

		socket.emit('renderMulti', this.game);

		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			const joueur = this.listJoueurs.get(socket.id);
			if (joueur) {
				this.updateInput(joueur, input.vx, input.vy);
			}
		});

		socket.on('shooting', (shooting: boolean) => {
			if (shooting) {
				const joueur = this.listJoueurs.get(socket.id);
				if (joueur) this.addBullet(joueur);
			}
		});

		socket.on('disconnect', () => {
			this.retirerJoueur(socket.id);
		});

		socket.on('quitterMulti', () => {
			this.retirerJoueur(socket.id);
		});
	}

	retirerJoueur(socketId: string) {
		this.game.removeJoueur(this.listJoueurs.get(socketId)!);
		this.listJoueurs.delete(socketId);
	}

	update() {
		super.update();

		this.io.emit('renderMulti', this.game);
	}
}
