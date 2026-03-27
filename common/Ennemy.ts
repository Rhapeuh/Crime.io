import Entities from './Entities.ts';
import type Joueur from './Joueur';
import type { Coordonee } from './types.ts';
import { verifCoordonee } from './utils.ts';

export const DifficulteEnnemi = {
	FACILE: 0,
	MOYEN: 1,
	DIFFICILE: 2,
	IMPOSSIBLE: 3,
} as const;

export type DifficulteEnnemi =
	(typeof DifficulteEnnemi)[keyof typeof DifficulteEnnemi];

const STATS_ENNEMIS = {
	[DifficulteEnnemi.FACILE]: { speed: 2, hp: 1, score: 10, taille: 25 },
	[DifficulteEnnemi.MOYEN]: { speed: 4, hp: 2, score: 25, taille: 30 },
	[DifficulteEnnemi.DIFFICILE]: { speed: 7, hp: 3, score: 50, taille: 35 },
	[DifficulteEnnemi.IMPOSSIBLE]: { speed: 10, hp: 5, score: 100, taille: 40 },
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
		super(
			co,
			0,
			0,
			stats.speed,
			stats.taille,
			stats.taille,
			spriteId,
			stats.hp
		);
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
