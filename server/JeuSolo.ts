import type { Socket } from 'socket.io';
import Joueur from '../common/Joueur.ts';
import Jeu from './Jeu.ts';

export default class JeuSolo extends Jeu {
	private j: Joueur;
	private socket: Socket;

	constructor(pseudo: string, socket: Socket) {
		super();
		this.j = new Joueur(pseudo, this.randomCoordonee(), 1, 3, 50, 50);
		this.game.addJoueur(this.j);
		this.socket = socket;

		this.socket.emit('renderSolo', this.game);
		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			this.updateInput(this.j, input.vx, input.vy);
		});

		socket.on('shooting', (shooting: boolean) => {
			if (shooting) {
				this.addBullet(this.j);
			}
		});

		socket.on('playerParry', () => {
			// CoolDown à prévoir
			this.j.mettreInvincible();
			setTimeout(() => {
				this.j.enleverInvincible();
			}, 500);
		});

		this.gameLoop = setInterval(() => {
			this.update();
		}, 1000 / 60);
	}

	destroy() {
		super.destroy();

		this.socket.removeAllListeners('updateInput');
		this.socket.removeAllListeners('playerParry');
		this.socket.removeAllListeners('shooting');
	}

	update() {
		super.update();

		this.socket.emit('renderSolo', this.game);
	}
}
