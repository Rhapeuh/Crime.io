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
	private maxEnemies = 1;
	private maxEnnemiesSpawning = 1;
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
		const leftA = entityA.getX();
		const rightA = entityA.getX() + entityA.getWidth();
		const topA = entityA.getY();
		const bottomA = entityA.getY() + entityA.getHeight();

		const leftB = entityB.getX();
		const rightB = entityB.getX() + entityB.getWidth();
		const topB = entityB.getY();
		const bottomB = entityB.getY() + entityB.getHeight();

		return leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB;
	}

	// Gestion du joueur

	private updateJoueur() {
		for (const j of this.game.joueurs.values()) {
			// if(!j.estEnVie) this.joueurMort(j);
			this.joueurToucher(j);
			this.updateSpeed(j);
			j.setX(j.getX() + j.getVX() * j.getSpeed());
			j.setY(j.getY() + j.getVY() * j.getSpeed());
			this.verifCoordonee(j);
		}
	}

	private updateSpeed(j: Joueur) {
		if (this.seDeplace(j) && j.getSpeed() < this.max_speed)
			j.setSpeed(j.getSpeed() + 0.2);
		if (!this.seDeplace(j)) j.setSpeed(1);
	}

	private seDeplace(j: Joueur) {
		return j.getVX() != 0 || j.getVY() != 0;
	}

	protected updateInput(j: Joueur, vx: number, vy: number) {
		j.setVX(vx);
		j.setVY(vy);
	}

	private joueurToucher(j: Joueur){
		for(const e of this.game.ennemies){
			if(this.checkCollision(j, e)){
				j.enleverVie();
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
		const j = this.game.joueurs[0];

		for (const e of this.game.ennemies) {
			if (!e.estEnVie()) this.game.removeEnnemy(e);
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
			let nbASpawn = 1; //randomInt(this.maxEnnemiesSpawning);
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
