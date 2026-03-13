import type { Socket } from 'socket.io';
import Joueur from './Joueur.ts';
import Jeu from './Jeu.ts';


export default class JeuSolo extends Jeu {
	// private j: Joueur = { x: 50, y: 50, vx: 0, vy: 0, speed: 1 };

	private j = new Joueur (null, {x: 50, y: 50} , 0, 0, 1 );		// tempNom
	private socket;

	constructor(socket: Socket) {
		super();
		this.socket = socket;
		socket.emit('initImage', this.getCoordonee());

		socket.emit('premiereConnexion', "tu t'est bien connecté");

		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			this.updateInput(input.vx, input.vy);
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
	}

	getJoueur() {
		return this.j;
	}

	getCoordonee() {
		return { x: this.j.getX(), y: this.j.getY() };
	}
}
