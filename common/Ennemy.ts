import Entities from './Entities.ts';
import type Joueur from './Joueur';
import type { Coordonee } from './types.ts';
import { verifCoordonee } from './utils.ts';

export const DifficulteEnnemi = {
	FACILE: 0,
	MOYEN: 1,
	DIFFICILE: 2,
} as const;

export type DifficulteEnnemi =
	(typeof DifficulteEnnemi)[keyof typeof DifficulteEnnemi];

const STATS_ENNEMIS = {
	[DifficulteEnnemi.FACILE]: { speed: 2, hp: 1, score: 10, taille: 15 },
	[DifficulteEnnemi.MOYEN]: { speed: 4, hp: 2, score: 25, taille: 20 },
	[DifficulteEnnemi.DIFFICILE]: { speed: 7, hp: 3, score: 50, taille: 25 },
};

export default class Ennemy extends Entities {
	private scoreValue: number;

	constructor(
		co: Coordonee,
		difficulte: DifficulteEnnemi = DifficulteEnnemi.FACILE,
		spriteId: string = 'ennemiTemp'
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
	}

	public getScoreValue(): number {
		return this.scoreValue;
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
