import { randomInt } from 'node:crypto';
import type { Socket } from 'socket.io';
import Joueur from '../common/Joueur.ts';
import Jeu from './Jeu.ts';
import { BasicEnnemy } from '../common/BasicEnnemy.ts';

export default class JeuSolo extends Jeu {
	// private j: Joueur = { x: 50, y: 50, vx: 0, vy: 0, speed: 1 };

	private j = new Joueur(this.genereNom(), { x: 50, y: 50 }, 0, 0, 1, 3); // tempNom
	private e = new BasicEnnemy('ennemy', { x: 200, y: 200 }, 0, 0, 1); // tempNom
	
	private socket;
	private gameLoop: NodeJS.Timeout;

	constructor(socket: Socket) {0
		super();
		this.socket = socket;
		socket.emit('initImage', this.getCoordonee());

		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			this.updateInput(input.vx, input.vy);
		});

		socket.on('playerParry', () => {
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
        clearInterval(this.gameLoop);

        this.socket.removeAllListeners('updateInput');
        this.socket.removeAllListeners('playerParry');
        this.socket.removeAllListeners('initTailleEcran');
    }

	updateInput(vx: number, vy: number) {
		this.j.setVX(vx);
		this.j.setVY(vy);
	}

	update() {
		super.update(this.getJoueur());

		this.socket.emit('render', this.getCoordonee());

		super.updateEnnemy(this.getEnnemy(), this.getJoueur())
		this.socket.emit('initEnnemy', {x: this.e.getX(), y: this.e.getY()});
	}

	getJoueur() {
		return this.j;
	}

	getEnnemy() {
		return this.e;
	}

	getCoordonee() {
		return { x: this.j.getX(), y: this.j.getY() };
	}

	genereNom(): string {
		// pas testé
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

		const tailleStr = randomInt(999999);
		const num = randomInt(6);

		let temp = '';
		for (let i = 0; i < tailleStr; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			temp += characters.charAt(randomIndex);
		}

		return temp.concat(num.toString());
	}
}
