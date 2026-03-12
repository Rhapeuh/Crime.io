import type { Socket } from 'socket.io';
import type { Joueur } from './types';

export default class JeuSolo {
	private j: Joueur = { x: 50, y: 50, vx: 0, vy: 0, speed: 1 };
	private canvasWidth: number = 0;
	private canvasHeight: number = 0;
	private max_speed: number = 10;
	private socket;

	constructor(socket: Socket) {
		this.socket = socket;
		socket.emit('initImage', this.getCoordonee())

		socket.emit('premiereConnexion', "tu t'est bien connecté");

		socket.on('initTailleEcran', (tailleEcran: { width: number, height: number }) => {
			this.setTailleEcran(tailleEcran.width, tailleEcran.height);
		});

		socket.on('updateInput', (input: { vx: number, vy: number }) => {
			this.updateInput(input.vx, input.vy);
		});
			setInterval(() => this.update(), 1000 / 60);
		}

	setTailleEcran(width: number, height: number) {
		this.canvasWidth = width;
		this.canvasHeight = height;
	}

	updateInput(vx: number, vy: number) {
		this.j.vx = vx;
		this.j.vy = vy;
	}

	private update() {
		this.updateSpeed();
		this.j.x += this.j.vx * this.j.speed;
		this.j.y += this.j.vy * this.j.speed;

		if (this.j.x < 0) this.j.x = 0;
		if (this.j.y < 0) this.j.y = 0;
		if (this.j.x + 30 > this.canvasWidth) this.j.x = this.canvasWidth - 30;
		if (this.j.y + 30 > this.canvasHeight) this.j.y = this.canvasHeight - 30;

		this.socket.emit('render', this.getCoordonee());
	}

	private updateSpeed() {
		if (this.seDeplace() && this.j.speed < this.max_speed) this.j.speed += 0.2;
		else if (!this.seDeplace()) this.j.speed = 1
	}

	private seDeplace() {
		return this.j.vx != 0 || this.j.vy != 0;
	}

	getJoueur() {
		return this.j;
	}

	getCoordonee() {
		return { x: this.j.x, y: this.j.y };
	}
}
