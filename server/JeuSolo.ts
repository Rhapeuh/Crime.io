import type { Socket } from 'socket.io';
import Joueur from '../common/Joueur.ts';
import Jeu from './Jeu.ts';

export default class JeuSolo extends Jeu {
	private j: Joueur;
	private socket: Socket;
	private gameLoop: NodeJS.Timeout;

	constructor(pseudo: string, socket: Socket) {
		super();
		this.j = new Joueur(pseudo, { x: 50, y: 50 }, 0, 0, 1);
		this.socket = socket;
		socket.emit('initImage', this.getCoordonee());

		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			this.updateInput(this.j, input.vx, input.vy);
		});

		this.gameLoop = setInterval(() => {
			this.update();
		}, 1000 / 60);
	}

	destroy() {
		clearInterval(this.gameLoop);

		this.socket.removeAllListeners('updateInput');
		this.socket.removeAllListeners('initTailleEcran');
	}

	update() {
		super.update(this.getJoueur());

		this.socket.emit('render', this.getCoordonee());
	}

	getJoueur() {
		return this.j;
	}

	getCoordonee() {
		return { x: this.j.getX(), y: this.j.getY() };
	}
}
