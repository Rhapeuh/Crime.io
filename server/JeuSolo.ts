import type { Socket } from 'socket.io';
import Joueur from '../common/Joueur.ts';
import Jeu from './Jeu.ts';

export default class JeuSolo extends Jeu {
	private j: Joueur;
	private socket: Socket;

	constructor(pseudo: string, socket: Socket) {
		super();
		this.j = new Joueur(pseudo, { x: 0, y: 0 }, 0, 3, 35, 35, socket.id);
		this.game.addJoueur(this.j);
		this.j.setCoordonee(this.randomCoordonee());
		this.socket = socket;

		this.socket.emit('renderSolo', this.game);
		socket.on('updateInput', (input: { vx: number; vy: number }) => {
			this.updateInput(this.j, input.vx, input.vy);
		});

		socket.on(
			'shooting',
			(donnee: { active: boolean; x: number; y: number }) => {
				if (donnee.active) {
					this.addBullet(this.j, { x: donnee.x, y: donnee.y });
				}
			}
		);

		this.gameLoop = setInterval(() => {
			this.update();
		}, 1000 / 60);
		this.handleBonusSpawning();
	}

	destroy() {
		super.destroy();

		this.socket.removeAllListeners('updateInput');
		this.socket.removeAllListeners('shooting');
	}

	update() {
		super.update();

		this.socket.emit('renderSolo', this.game);
	}

	protected async joueurMort(j: Joueur) {
		await super.joueurMort(j);
			this.socket.emit('mortDuJoueur', j);
		}

	setDifficulte(difficulte: number) {
		if (difficulte === 1) {
			this.pourcentSpawn.moyen = 0.25;
			this.maxEnemies = 15;
			this.multiplicateurDifficulte = 1.25
		} else if (difficulte === 2) {
			this.pourcentSpawn.difficile = 0.5;
			this.pourcentSpawn.moyen = 0.25;
			this.maxEnemies = 20;
			this.multiplicateurDifficulte = 1.5
		} else if (difficulte === 3) {
			this.pourcentSpawn.impossible = 0;
			this.maxEnemies = 10000;
			this.multiplicateurDifficulte = 2;
		}
	}
}
