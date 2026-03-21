import Bullet from '../common/Bullet.ts';
import Game from '../common/Game.ts';
import Joueur from '../common/Joueur.ts';
import Ennemy from '../common/Ennemy.ts';
import type Entities from '../common/Entities';
import type { Coordonee } from '../common/types';
import { randomInt } from 'crypto';

export default class Jeu {
	protected WORLD_WIDTH = 1920;
	protected WORLD_HEIGHT = 1080;
	private max_speed: number = 10;
	private friction = 0.9;
	private maxEnemies = 5;
	private maxEnnemiesSpawning = 2;
	private nextSpawnTime = 0;
	private minSpawnDelay = 100;
	private maxSpawnDelay = 300;
	gameLoop: NodeJS.Timeout | null = null;
	game: Game = new Game();

	protected destroy() {
		if (this.gameLoop) {
			clearInterval(this.gameLoop);
		}
		this.game.clearAll();
		this.game.bullets = [];
	}

	protected update() {
		this.handleEnemySpawning();
		this.updateJoueur();
		this.updateBullets();

		if (this.game.joueurs.length !== 0) {
			this.updateEnnemy();
		}
	}

	// gestion globale

	private verifCoordonee(e: Entities) {
		const halfW = e.getWidth() / 2;
		const halfH = e.getHeight() / 2;

		if (e.getX() - halfW < 0) e.setX(halfW);

		if (e.getX() + halfW > this.WORLD_WIDTH) e.setX(this.WORLD_WIDTH - halfW);

		if (e.getY() - halfH < 0) e.setY(halfH);

		if (e.getY() + halfH > this.WORLD_HEIGHT) e.setY(this.WORLD_HEIGHT - halfH);
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

	// Gestion du joueur

	private updateJoueur() {
		for (const j of this.game.joueurs.values()) {
			this.joueurToucher(j);
			this.appliquerPhysique(j);
			j.setX(j.getX() + j.getVX());
			j.setY(j.getY() + j.getVY());
			this.verifCoordonee(j);
		}
	}

	private appliquerPhysique(j: Joueur) {
		let newVX = j.getVX() + j.getInputX();
		let newVY = j.getVY() + j.getInputY();

		newVX *= this.friction;
		newVY *= this.friction;

		const vitesseActuelle = Math.hypot(newVX, newVY);
		if (vitesseActuelle > this.max_speed) {
			const angle = Math.atan2(newVY, newVX);
			newVX = Math.cos(angle) * this.max_speed;
			newVY = Math.sin(angle) * this.max_speed;
		}

		if (Math.abs(newVX) < 0.1) newVX = 0;
		if (Math.abs(newVY) < 0.1) newVY = 0;

		j.setVX(newVX);
		j.setVY(newVY);
	}

	protected updateInput(j: Joueur, inputX: number, inputY: number) {
		j.setInputX(inputX);
		j.setInputY(inputY);
	}

	private joueurToucher(j: Joueur) {
		for (const e of this.game.ennemies) {
			if (this.checkCollision(j, e)) {
				j.enleverVie();
				this.game.removeEnnemy(e);
			}
		}
	}

	// gestion des balle

	protected addBullet(j: Joueur, targetX: number, targetY: number) {
		const dx = targetX - j.getX();
		const dy = targetY - j.getY();
		const angle = Math.atan2(dy, dx);

		const nouvelleBalle = new Bullet(
			{ x: j.getX(), y: j.getY() },
			angle,
			15,
			j
		);
		this.game.addBullet(nouvelleBalle);
	}

	private updateBullets() {
		this.game.removeAllHit();
		this.game.bullets.forEach(b => {
			b.update();

			for (const e of this.game.ennemies.values()) {
				if (this.checkCollision(b, e)) {
					e.enleverVie();
					this.game.addBulletHit(b);
					this.game.removeBullet(b);
					b.getJoueur().addScore(10);
					return;
				}
			}

			if (b.shouldBeDeleted()) this.game.removeBullet(b);
		});
	}

	// gestion des ennemis

	private addEnnemy(e: Ennemy) {
		this.game.addEnnemy(e);
	}

	private updateEnnemy() {
		for (const e of this.game.ennemies) {
			if (!e.estEnVie()) this.game.removeEnnemy(e);
			const j = this.joueurPlusProche(e);
			this.mooveEnnemy(e, j);
		}
	}

	private mooveEnnemy(e: Ennemy, j: Joueur) {
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

	private joueurPlusProche(e: Ennemy): Joueur {
		let j = this.game.joueurs[0];
		if (this.game.getNbJoueurs() === 1) return j;

		let dist = this.calculeDistance(e, j);

		for (const newJ of this.game.joueurs) {
			const newDist = this.calculeDistance(e, newJ);
			if (newDist < dist) {
				j = newJ;
				dist = newDist;
			}
		}

		return j;
	}

	private calculeDistance(e: Ennemy, j: Joueur) {
		const distX = Math.abs(e.getX() - j.getX());
		const distY = Math.abs(e.getY() - j.getY());

		return Math.hypot(distX, distY);
	}
}
