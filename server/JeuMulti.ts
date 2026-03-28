import type { Socket } from 'socket.io';
import Joueur from '../common/Joueur.ts';
import Jeu from './Jeu.ts';
import { Server as IOServer } from 'socket.io';

export default class JeuMulti extends Jeu {
	private io: IOServer;
	private nameRoom: string;

	constructor(io: IOServer, nameRoom: string) {
		super();
		this.io = io;
		this.nameRoom = nameRoom;

		this.gameLoop = setInterval(() => {
			this.update();
		}, 1000 / 60);
		this.handleBonusSpawning();
	}

	destroy() {
		super.destroy();

		this.io.removeAllListeners('updateInput');
		this.io.removeAllListeners('playerParry');
		this.io.removeAllListeners('shooting');
	}

	ajouterJoueur(socket: Socket, pseudo: string, spriteId: string = 'scarab') {
		this.retirerJoueur(socket.id);

		const newJoueur = new Joueur(
			pseudo,
			{ x: 0, y: 0 },
			1,
			3,
			35,
			35,
			socket.id,
			spriteId
		);
		this.game.addJoueur(newJoueur);
		newJoueur.setCoordonee(this.randomCoordonee());

		socket.emit('renderMulti', this.game);

		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			const joueur = this.game.getJoueur(socket.id);
			if (joueur) {
				this.updateInput(joueur, input.vx, input.vy);
			}
		});

		socket.on(
			'shooting',
			(donnee: { active: boolean; x: number; y: number }) => {
				if (donnee.active) {
					const j = this.game.getJoueur(socket.id);
					if (j) this.addBullet(j, { x: donnee.x, y: donnee.y }, 'bullet');
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
		const j = this.game.getJoueur(socketId);
		if (j) this.game.removeJoueur(j);
	}

	update() {
		super.update();

		this.io.to(this.nameRoom).emit('renderMulti', this.game);
	}

	getNbJoueurs() {
		return this.game.getNbJoueurs();
	}

	protected async joueurMort(j: Joueur) {
		await super.joueurMort(j);
		this.io.in(j.getClientID()).emit('mortDuJoueur', j);
	}
}
