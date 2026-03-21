import Bullet from '../common/Bullet.ts';
import Game from '../common/Game.ts';
import Joueur from '../common/Joueur.ts';
import type { Coordonee } from '../common/types.ts';
import { randomInt } from 'crypto';
import { writeFile, readFile } from 'fs/promises';
import {
	calculerAngle,
	checkCollision,
	trouverJoueurPlusProche,
} from '../common/utils.ts';
import BasicEnnemy, { DifficulteEnnemi } from '../common/BasicEnnemy.ts';
import type Ennemy from '../common/Ennemy';

export default class Jeu {
	protected WORLD_WIDTH = 1920;
	protected WORLD_HEIGHT = 1080;
	private maxEnemies = 5;
	private maxEnnemiesSpawning = 2;
	private nextSpawnTime = 0;
	private minSpawnDelay = 100;
	private maxSpawnDelay = 300;
	private pourcentSpawn = { moyen: 0.5, difficile: 0.85 };
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

	protected randomCoordonee(): Coordonee {
		return { x: randomInt(this.WORLD_WIDTH), y: randomInt(this.WORLD_HEIGHT) };
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
			j.update(this.WORLD_WIDTH, this.WORLD_HEIGHT);
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
		const data = {
			pseudo: j.getPseudo(),
			score: j.getScore(),
			date: new Date().toLocaleDateString(),
		};
		await this.sauvegardeScoreAsync(data);
	}

	// gestion des balle

	protected addBullet(j: Joueur, targetX: number, targetY: number) {
		const angle = calculerAngle(j.getCoordonee(), { x: targetX, y: targetY });

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
				if (checkCollision(b, e)) {
					e.enleverVie();
					this.game.addBulletHit(b);
					this.game.removeBullet(b);
					if(!e.estEnVie()) b.getJoueur().addScore(e.getScoreValue());
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
			if (!e.estEnVie()) {
				this.game.removeEnnemy(e);
				continue;
			}
			const j = trouverJoueurPlusProche(e, this.game.joueurs);
			if (j) e.update(j, this.WORLD_WIDTH, this.WORLD_HEIGHT);
		}
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

			for (let i = 0; i < nbASpawn; i++) {
				const rand = Math.random();
				let difficulte = DifficulteEnnemi.FACILE;

				if (rand > this.pourcentSpawn.difficile) {
					difficulte = DifficulteEnnemi.DIFFICILE;
				} else if (rand > this.pourcentSpawn.moyen) {
					difficulte = DifficulteEnnemi.MOYEN;
				}

				this.addEnnemy(new BasicEnnemy(this.randomCoordonee(), difficulte));
			}

			const randomDelay =
				Math.random() * (this.maxSpawnDelay - this.minSpawnDelay) +
				this.minSpawnDelay;
			this.nextSpawnTime = now + randomDelay;
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
}
