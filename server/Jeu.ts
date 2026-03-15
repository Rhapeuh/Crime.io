import Bullet from '../common/Bullet.ts';
import Game from '../common/Game.ts';
import Joueur from '../common/Joueur.ts';
import Ennemy from '../common/Ennemy.ts';
import type Entities from '../common/Entities';
import type { Coordonee } from '../common/types';
import { randomInt } from 'crypto';

export default class Jeu {
	private WORLD_WIDTH = 1920;
	private WORLD_HEIGHT = 1080;
	private PLAYER_SIZE = 50;
	private max_speed: number = 10;
	game: Game = new Game();

	constructor() {
		this.addEnnemy();
	}

	protected update() {
		for (const j of this.game.joueurs.values()) {
			this.updateJoueur(j);
		}
		this.updateBullets();

		// if (this.game.joueurs.length !== 0) {
		// 	for (const e of this.game.ennemies.values()) {
		// 		this.updateEnnemy(e);
		// 	}
		// }
	}

	private updateJoueur(j: Joueur) {
		this.updateSpeed(j);
		j.setX(j.getX() + j.getVX() * j.getSpeed());
		j.setY(j.getY() + j.getVY() * j.getSpeed());
		this.verifCoordonee(j);
	}

	private updateSpeed(j: Joueur) {
		if (this.seDeplace(j) && j.getSpeed() < this.max_speed)
			j.setSpeed(j.getSpeed() + 0.2);
		if (!this.seDeplace(j)) j.setSpeed(1);
	}

	private seDeplace(j: Joueur) {
		return j.getVX() != 0 || j.getVY() != 0;
	}

	private verifCoordonee(j: Entities) {
		if (j.getX() < 0) j.setX(0);
		if (j.getY() < 0) j.setY(0);
		if (j.getX() > this.WORLD_WIDTH - this.PLAYER_SIZE)
			j.setX(this.WORLD_WIDTH - this.PLAYER_SIZE);
		if (j.getY() > this.WORLD_HEIGHT - this.PLAYER_SIZE)
			j.setY(this.WORLD_HEIGHT - this.PLAYER_SIZE);
	}

	protected updateInput(j: Joueur, vx: number, vy: number) {
		j.setVX(vx);
		j.setVY(vy);
	}

	protected addBullet(j: Joueur) {
		const vx = j.getVX();
		const vy = j.getVY();
		let angle = 0;
		if (vx != 0 || vy != 0) {
			angle = Math.atan2(vy, vx);
		}

		const nouvelleBalle = new Bullet(
			{ x: j.getX(), y: j.getY() },
			angle,
			15,
			j
		);
		this.game.addBullet(nouvelleBalle);
	}

	protected updateBullets() {
		this.game.bullets.map(b => {
			b.update();
			if (b.shouldBeDeleted()) this.game.removeBullet(b);
		});
	}

	protected addEnnemy() {
		this.game.addEnnemy(new Ennemy({ x: 200, y: 200 }));
	}

	protected updateEnnemy(e: Ennemy) {
		const j = this.game.joueurs[0];

		if (e.getX() > j.getX()) {
			e.setX(e.getX() + e.speed * -1);
		} else if (e.getX() < j.getX()) {
			e.setX(e.getX() + e.speed * 1);
		}

		if (e.getY() > j.getY()) {
			e.setY(e.getY() + e.speed * -1);
		} else if (e.getY() < j.getY()) {
			e.setY(e.getY() + e.speed * 1);
		}
		this.verifCoordonee(e);
	}

	protected randomCoordonee(): Coordonee {
		return { x: randomInt(this.WORLD_WIDTH), y: randomInt(this.WORLD_HEIGHT) };
	}
}
