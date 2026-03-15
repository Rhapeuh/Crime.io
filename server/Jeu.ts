import Bullet from '../common/Bullet.ts';
import Game from '../common/Game.ts';
import Joueur from '../common/Joueur.ts';
import Ennemy from '../common/Ennemy.ts';
import { BasicEnnemy } from '../common/BasicEnnemy.ts';
import type Entities from '../common/Entities';
import type { Coordonee } from '../common/types';
import { randomInt } from 'crypto';

export default class Jeu {
	private WORLD_WIDTH = 1920;
	private WORLD_HEIGHT = 1080;
	private max_speed: number = 10;
	private maxEnemies = 10;
	private maxEnnemiesSpawning = 4;
	private nextSpawnTime = 0;
	private minSpawnDelay = 100;
	private maxSpawnDelay = 3000;
	gameLoop: NodeJS.Timeout | null = null;
	game: Game = new Game();

	public destroy() {
		if (this.gameLoop) {
			clearInterval(this.gameLoop);
		}
		this.game.clearAll();
		this.game.bullets = [];
	}

	protected update() {
		this.handleEnemySpawning();
		for (const j of this.game.joueurs.values()) {
			this.updateJoueur(j);
		}
		this.updateBullets();

		if (this.game.joueurs.length !== 0) {
			for (const e of this.game.ennemies.values()) {
				this.updateEnnemy(e);
			}
		}
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

	private verifCoordonee(e: Entities) {
		const halfW = e.getWidth() / 2;
		const halfH = e.getHeight() / 2;

		if (e.getX() - halfW < 0) e.setX(halfW);

		if (e.getX() + halfW > this.WORLD_WIDTH) e.setX(this.WORLD_WIDTH - halfW);

		if (e.getY() - halfH < 0) e.setY(halfH);

		if (e.getY() + halfH > this.WORLD_HEIGHT) e.setY(this.WORLD_HEIGHT - halfH);
	}

	protected updateInput(j: Joueur, vx: number, vy: number) {
		j.setVX(vx);
		j.setVY(vy);
	}

	genererBot() {
		this.game.addEnnemy(
			new BasicEnnemy({
				x: randomInt(this.WORLD_WIDTH),
				y: randomInt(this.WORLD_HEIGHT),
			})
		);
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
		this.game.bullets.forEach(b => {
			b.update();

			for (const e of this.game.ennemies.values()) {
				if (this.checkCollision(b, e)) {
					e.encaisserDegat();
					this.game.removeBullet(b);

					return;
				}
			}

			if (b.shouldBeDeleted()) this.game.removeBullet(b);
		});
	}

	protected addEnnemy(e: Ennemy) {
		this.game.addEnnemy(e);
	}

	protected updateEnnemy(e: Ennemy) {
		const j = this.game.joueurs[0];

		if (!e.estEnVie()) this.game.removeEnnemy(e);

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

	private checkCollision(entityA: Entities, entityB: Entities): boolean {
		const halfWA = entityA.getWidth() / 2;
		const halfHA = entityA.getHeight() / 2;
		const halfWB = entityB.getWidth() / 2;
		const halfHB = entityB.getHeight() / 2;

		const leftA = entityA.getX() - halfWA;
		const rightA = entityA.getX() + halfWA;
		const topA = entityA.getY() - halfHA;
		const bottomA = entityA.getY() + halfHA;

		const leftB = entityB.getX() - halfWB;
		const rightB = entityB.getX() + halfWB;
		const topB = entityB.getY() - halfHB;
		const bottomB = entityB.getY() + halfHB;

		return leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB;
	}

	private handleEnemySpawning() {
		const now = Date.now();

		if (
			this.game.getNbEnnemy() < this.maxEnemies &&
			now >= this.nextSpawnTime
		) {
			let nbASpawn = randomInt(this.maxEnnemiesSpawning);
			if (nbASpawn > this.maxEnemies - this.game.getNbEnnemy())
				nbASpawn = this.maxEnemies - this.game.getNbEnnemy();

			for (let i = 0; i < nbASpawn; i++)
				this.addEnnemy(new Ennemy(this.randomCoordonee()));

			const randomDelay =
				Math.random() * (this.maxSpawnDelay - this.minSpawnDelay) +
				this.minSpawnDelay;
			this.nextSpawnTime = now + randomDelay;
		}
	}
}
