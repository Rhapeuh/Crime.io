import Entities from './Entities.ts';
import type Joueur from './Joueur';
import type { Coordonee } from './types.ts';
import { verifCoordonee } from './utils.ts';

const sprite_config = {
	ennemiMelee: { width: 32, height: 32 },
	ennemyTir: { width: 6, height: 22 },
};

export const DifficulteEnnemi = {
    FACILE: 'FACILE',
    MOYEN: 'MOYEN',
    DIFFICILE: 'DIFFICILE',
	IMPOSSIBLE: 'IMPOSSIBLE'
}

export type DifficulteEnnemi =
	(typeof DifficulteEnnemi)[keyof typeof DifficulteEnnemi];

const STATS_ENNEMIS = {
	[DifficulteEnnemi.FACILE]: { speed: 2, hp: 1, score: 10, taille: 65 },
	[DifficulteEnnemi.MOYEN]: { speed: 4, hp: 2, score: 25, taille: 70 },
	[DifficulteEnnemi.DIFFICILE]: { speed: 7, hp: 3, score: 50, taille: 75 },
	[DifficulteEnnemi.IMPOSSIBLE]: { speed: 15, hp: 5, score: 100, taille: 90 },
};

export default class Ennemy extends Entities {
	private scoreValue: number;
	public viesBase: number;

	constructor(
		co: Coordonee,
		difficulte: DifficulteEnnemi = DifficulteEnnemi.MOYEN,
		spriteId: string = 'ennemiMelee'
	) {
		const stats = STATS_ENNEMIS[difficulte];
		const config = sprite_config[spriteId as keyof typeof sprite_config];
		const width = stats.taille * (config.width / config.height);

		super(co, 0, 0, stats.speed, width, stats.taille, spriteId, stats.hp);
		this.scoreValue = stats.score;
		this.viesBase = stats.hp;
	}

	public getScoreValue(): number {
		return this.scoreValue;
	}

	public getViesBase(): number {
		return this.viesBase;
	}

	public update(
		j: Joueur,
		worldWidth: number,
		worldHeight: number,
		distMin: number = 0
	) {
		const dx = j.getX() - this.getX();
		const dy = j.getY() - this.getY();

		const distance = Math.hypot(dx, dy);

		if (distance > distMin) {
			this.vx = (dx / distance) * this.speed;
			this.vy = (dy / distance) * this.speed;

			this.setX(this.getX() + this.vx);
			this.setY(this.getY() + this.vy);
		}
		verifCoordonee(this, worldWidth, worldHeight);
	}
}
