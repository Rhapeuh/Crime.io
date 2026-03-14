import { randomInt } from 'node:crypto';
import type { Socket } from 'socket.io';
import Joueur from '../common/Joueur.ts';
import Jeu from './Jeu.ts';

export default class JeuSolo extends Jeu {

	private j = new Joueur(this.genereNom(), { x: 50, y: 50 }, 0, 0, 1);
	
	private socket;
	private gameLoop: NodeJS.Timeout;

	constructor(socket: Socket) {0
		super();
		this.socket = socket;
		socket.emit('initImage', this.getCoordonee());

		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			this.updateInput(input.vx, input.vy);
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

	genereNom(): string {
        return `Joueur ${randomInt(10000)}`; 
    }
}
