import type { Socket } from 'socket.io';
import Joueur from '../common/Joueur.ts';
import Jeu from './Jeu.ts';
import Game from '../common/Game.ts';

export default class JeuSolo extends Jeu {
	private j: Joueur
	private socket: Socket;
	private gameLoop: NodeJS.Timeout;

	constructor(pseudo: string, socket: Socket) {
		super();
		this.j = new Joueur(pseudo, { x: 50, y: 50 }, 0, 0, 1, 3)
		this.game.addJoueur(this.j);
		this.socket = socket;

		this.socket.emit('renderSolo', this.game)
		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			this.updateInput(this.j, input.vx, input.vy);
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

		socket.on('quitterMulti', () => {
			this.game = new Game();
		});
	}

	destroy() {
		clearInterval(this.gameLoop);

		this.socket.removeAllListeners('updateInput');
	}

	update() {
		super.update(this.getJoueur());

		this.socket.emit('renderSolo', this.game);
	}

	getJoueur() {
		return this.j;
	}
}
