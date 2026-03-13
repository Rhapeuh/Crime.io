import type { Socket } from 'socket.io';
import Joueur from './Joueur.ts';
import Jeu from './Jeu.ts';
import { BasicEnnemy } from './BasicEnnemy.ts';

export default class JeuSolo extends Jeu {
	// private j: Joueur = { x: 50, y: 50, vx: 0, vy: 0, speed: 1 };

	private j = new Joueur(null, { x: 50, y: 50 }, 0, 0, 1, 3); // tempNom
	private e = new BasicEnnemy(null, { x: 200, y: 200 }, 0, 0, 1); // tempNom
	
	private socket;

	constructor(socket: Socket) {0
		super();
		this.socket = socket;
		socket.emit('initImage', this.getCoordonee());

		socket.emit('premiereConnexion', "tu t'est bien connecté");

		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			this.updateInput(input.vx, input.vy);
		});

		socket.on('playerParry', () => {
			this.j.mettreInvincible();
			setTimeout(() => {
				this.j.enleverInvincible();
			}, 500);
		});
		setInterval(() => this.update(), 1000 / 60);
	}

	updateInput(vx: number, vy: number) {
		this.j.setVX(vx);
		this.j.setVY(vy);
	}

	update() {
		super.update(this.getJoueur());

		this.socket.emit('render', this.getCoordonee());
		this.socket.emit('initEnnemy', {x: this.e.getX(), y: this.e.getY()});
	}

	getJoueur() {
		return this.j;
	}

	getCoordonee() {
		return { x: this.j.getX(), y: this.j.getY() };
	}
}
