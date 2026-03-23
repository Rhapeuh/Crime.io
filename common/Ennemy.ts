import Entities from './Entities.ts';
import type Joueur from './Joueur';
import type { Coordonee } from './types.ts';
import { verifCoordonee } from './utils.ts';

export const DifficulteEnnemi = {
    FACILE: 'FACILE',
    MOYEN: 'MOYEN',
    DIFFICILE: 'DIFFICILE'
}

const STATS_ENNEMIS = {
	[DifficulteEnnemi.FACILE]: { speed: 2, hp: 1, score: 10, taille: 15 },
	[DifficulteEnnemi.MOYEN]: { speed: 3, hp: 2, score: 25, taille: 20 },
	[DifficulteEnnemi.DIFFICILE]: { speed: 5, hp: 3, score: 50, taille: 25 },
};

export default class Ennemy extends Entities {
	private scoreValue: number;

	constructor(
		co: Coordonee,
		difficulte = DifficulteEnnemi.FACILE,
		spriteId: string = 'ennemiTemp',
	) {
		const stats = STATS_ENNEMIS[difficulte];
		super(co, 0, 0, stats.speed, stats.taille, stats.taille, spriteId, stats.hp);
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
			const vx = (dx / distance) * this.speed;
			const vy = (dy / distance) * this.speed;

			this.setX(this.getX() + vx);
			this.setY(this.getY() + vy);
		}
		verifCoordonee(this, worldWidth, worldHeight);
	}
}
