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

		this.gameLoop = setInterval(() => {
			this.update();
		}, 1000 / 60);
	}

	destroy() {
		super.destroy();

		this.io.removeAllListeners('updateInput');
		this.io.removeAllListeners('playerParry');
		this.io.removeAllListeners('shooting');
	}

	ajouterJoueur(socket: Socket, pseudo: string) {
		const newJoueur = new Joueur(
			pseudo,
			this.randomCoordonee(),
			1,
			3,
			50,
			50,
			socket.id
		);
		this.listJoueurs.set(socket.id, newJoueur);
		this.game.addJoueur(newJoueur);

		socket.emit('renderMulti', this.game);

		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			const joueur = this.listJoueurs.get(socket.id);
			if (joueur) {
				this.updateInput(joueur, input.vx, input.vy);
			}
		});

		socket.on(
			'shooting',
			(donnee: { active: boolean; x: number; y: number }) => {
				if (donnee.active) {
					const j = this.listJoueurs.get(socket.id);
					if (j) this.addBullet(j, { x: donnee.x, y: donnee.y });
				}
			}
		);

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

	getNbJoueurs() {
		return this.game.getNbJoueurs();
	}

	protected async joueurMort(j: Joueur) {
		await super.joueurMort(j);
		this.io.in(j.getClientID()).emit('mortDuJoueur', j);
	}
}
