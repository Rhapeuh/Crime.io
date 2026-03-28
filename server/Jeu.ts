import Bullet from '../common/Bullet.ts';
import Game from '../common/Game.ts';
import Joueur from '../common/Joueur.ts';
import type { Coordonee } from '../common/types.ts';
import { writeFile, readFile } from 'fs/promises';
import {
	calculerAngle,
	checkCollision,
	trouverJoueurPlusProche,
} from '../common/utils.ts';
import Ennemy, { DifficulteEnnemi } from '../common/Ennemy.ts';
import ShooterEnnemy from '../common/ShooterEnnemy.ts';
import type Entities from '../common/Entities';
import Bonus from '../common/Bonus.ts';

export default class Jeu {
	maxEnemies = 10;
	private maxEnnemiesSpawning = 1;
	private nextSpawnTime = 0;
	private minSpawnDelay = 100;
	private maxSpawnDelay = 400;
	pourcentSpawn = { moyen: 1, difficile: 1, impossible: 1 };
	private bonusIntervalFunction: NodeJS.Timeout | null = null;
	gameLoop: NodeJS.Timeout | null = null;
	game: Game = new Game();
	multiplicateurDifficulte: number = 1;
	private updateDelay: number = 3000;
	private nextTimeUpdateDiff: number = 0;

	constructor() {
		this.nextTimeUpdateDiff = Date.now() + this.updateDelay;
	}

	protected destroy() {
		if (this.gameLoop) {
			clearInterval(this.gameLoop);
			this.gameLoop = null;
		}

		if (this.bonusIntervalFunction) {
			clearInterval(this.bonusIntervalFunction);
			this.bonusIntervalFunction = null;
		}

		this.game.clearAll();
	}

	protected update() {
		this.updateDifficultee();
		this.handleEnemySpawning();
		this.updateJoueur();
		this.updateBonus();
		this.game.removeAllHit();
		this.updateJoueurBullets();
		this.updateEnnemyBullets();

		if (this.game.joueurs.length !== 0) {
			this.updateEnnemy();
		}
	}

	// gestion globale

	protected randomCoordonee(): Coordonee {
		return {
			x: this.getRandomInt(0, this.game.WORLD_WIDTH),
			y: this.getRandomInt(0, this.game.WORLD_HEIGHT),
		};
	}

	private updateDifficultee() {
		const now = Date.now();
		if (now >= this.nextTimeUpdateDiff) {
			this.updateDelay += 1000;
			if (this.maxEnemies < 100) this.maxEnemies += 2;
			if (this.pourcentSpawn.moyen >= 0.05) this.pourcentSpawn.moyen -= 0.05;
			else if (this.pourcentSpawn.difficile <= 0.1)
				this.pourcentSpawn.difficile -= 0.05;
			else if (this.pourcentSpawn.impossible <= 0.9)
				this.pourcentSpawn.impossible -= 0.001;
			this.multiplicateurDifficulte += 0.1;
			this.nextTimeUpdateDiff = now + this.updateDelay;
		}
	}

	// Gestion du joueur

	private updateJoueur() {
		for (const j of this.game.joueurs.values()) {
			if (!j.estEnVie()) {
				if (this.game.getNbJoueurs() === 1 && this.gameLoop)
					clearInterval(this.gameLoop);
				this.joueurMort(j);
				this.game.removeJoueur(j);
				continue;
			}
			this.joueurToucher(j);
			j.update(this.game.WORLD_WIDTH, this.game.WORLD_HEIGHT);
		}
	}

	protected updateInput(j: Joueur, inputX: number, inputY: number) {
		j.setInputX(inputX);
		j.setInputY(inputY);
	}

	private joueurToucher(j: Joueur) {
		for (const e of this.game.ennemies) {
			if (checkCollision(j, e)) {
				j.enleverVie();
				this.game.removeEnnemy(e);
			}
		}
	}

	protected async joueurMort(j: Joueur) {
		console.log(`le joueur mort est ${j.getPseudo()}`);
		j.recalculScore(this.multiplicateurDifficulte);
		const data = {
			pseudo: j.getPseudo(),
			score: j.getScore(),
			date: new Date().toLocaleDateString(),
		};
		await this.sauvegardeScoreAsync(data);
	}

	// gestion des balle

	protected addBullet(e: Entities, coFinal: Coordonee, sprite: string) {
		const angle = calculerAngle(e.getCoordonee(), coFinal);

		const nouvelleBalle = new Bullet(
			{ x: e.getX(), y: e.getY() },
			angle,
			15,
			e,
			undefined,
			e.getBulletWidth(),
			e.getBulletHeight(),
			sprite
		);
		if (e instanceof Joueur) this.game.addBulletJoueur(nouvelleBalle);
		else if (e instanceof ShooterEnnemy)
			this.game.addEnnemyBullet(nouvelleBalle);
	}

	private updateJoueurBullets() {
		this.game.bulletsJoueur.forEach(b => {
			if (this.updateBullet(b, this.game.ennemies))
				this.game.removeBulletJoueur(b);
			if (b.shouldBeDeleted()) this.game.removeBulletJoueur(b);
		});
	}

	private updateEnnemyBullets() {
		this.game.bulletsEnnemy.forEach(b => {
			if (this.updateBullet(b, this.game.joueurs))
				this.game.removeBulletEnnemy(b);
			if (b.shouldBeDeleted()) this.game.removeBulletEnnemy(b);
		});
	}

	private updateBullet(b: Bullet, entities: Array<Entities>): boolean {
		b.update();
		for (const e of entities.values()) {
			if (checkCollision(b, e)) {
				e.enleverVie();
				this.game.addBulletHit(b);
				b.setSpriteId('persoTemp');
				const j = b.getEntitie();
				if (j instanceof Joueur && e instanceof Ennemy && !e.estEnVie())
					j.addScore(e.getScoreValue());
				return true;
			}
		}
		return false;
	}

	// gestion des ennemis

	private addEnnemy(e: Ennemy) {
		this.game.addEnnemy(e);
	}

	private updateEnnemy() {
		const now = Date.now();
		for (const e of this.game.ennemies) {
			if (!e.estEnVie()) {
				this.game.removeEnnemy(e);
				continue;
			}
			const result = trouverJoueurPlusProche(e, this.game.joueurs);
			if (result) {
				const j = result.joueur;
				const dist = result.distance;
				e.update(j, this.game.WORLD_WIDTH, this.game.WORLD_HEIGHT);
				if (e instanceof ShooterEnnemy && dist <= 250) {
					if (e.shoot(now)) {
						this.addBullet(e, j.getCoordonee(), 'bonusTemp');
					}
				}
			}
		}
	}

	private handleEnemySpawning() {
		const now = Date.now();

		if (
			this.game.getNbEnnemy() < this.maxEnemies &&
			now >= this.nextSpawnTime
		) {
			let nbASpawn = this.getRandomInt(1, this.maxEnnemiesSpawning);
			if (nbASpawn > this.maxEnemies - this.game.getNbEnnemy())
				nbASpawn = this.maxEnemies - this.game.getNbEnnemy();

			for (let i = 0; i < nbASpawn; i++) {
				const randDifficulté = Math.random();
				const randEnnemy = Math.random();
				let difficulte = DifficulteEnnemi.FACILE;

				if (randDifficulté > this.pourcentSpawn.impossible) {
					difficulte = DifficulteEnnemi.IMPOSSIBLE;
				} else if (randDifficulté > this.pourcentSpawn.difficile) {
					difficulte = DifficulteEnnemi.DIFFICILE;
				} else if (randDifficulté > this.pourcentSpawn.moyen) {
					difficulte = DifficulteEnnemi.MOYEN;
				}

				if (randEnnemy < 0.5)
					this.addEnnemy(new Ennemy(this.randomCoordonee(), difficulte));
				else
					this.addEnnemy(new ShooterEnnemy(this.randomCoordonee(), difficulte));
			}

			const randomDelay =
				Math.random() * (this.maxSpawnDelay - this.minSpawnDelay) +
				this.minSpawnDelay;
			this.nextSpawnTime = now + randomDelay;
		}
	}

	// Gestion des bonus

	protected handleBonusSpawning() {
		this.bonusIntervalFunction = setInterval(() => {
			// 5 bonus par joueur
			if (this.game.bonus.length < this.game.joueurs.length * 5) {
				const bonus = Bonus.getRandomBonusEffect(this.randomCoordonee());
				const { x, y } = bonus.getCoordonee();
				console.log(`Bonus ${bonus.getEffect()} spawn en X:${x}, Y:${y}`);
				this.game.addBonus(bonus);
			}
		}, 1000);
	}

	protected updateBonus() {
		for (const b of this.game.bonus) {
			const joueur = b.update(this.game.joueurs);
			if (joueur) {
				this.game.removeBonus(b);
			}
		}
	}

	// gestion de la sauvegarde des donnée

	private async sauvegardeScoreAsync(newData: {
		pseudo: string;
		score: number;
		date: string;
	}) {
		let data: {
			topScore: Array<{ pseudo: string; score: number; date: string }>;
		} = {
			topScore: [],
		};
		const cheminAbsolu = 'data/score.json';
		try {
			const contenu = await readFile(cheminAbsolu, 'utf8');
			if (contenu.trim() !== '') {
				data = JSON.parse(contenu);
			}
		} catch (err) {
			console.log(
				"Le fichier n'existe pas encore ou est illisible, on va le créer."
			);
		}

		if (!data.topScore) {
			data.topScore = [];
		}

		data.topScore.push(newData);
		data.topScore.sort((a, b) => b.score - a.score);
		data.topScore = data.topScore.slice(0, 10);
		await writeFile(cheminAbsolu, JSON.stringify(data), 'utf8');
	}

	private getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}