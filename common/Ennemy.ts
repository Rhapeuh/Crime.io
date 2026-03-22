import Entities from './Entities.ts';
import type Joueur from './Joueur';
import type { Coordonee } from './types.ts';
import { verifCoordonee } from './utils.ts';

export default class Ennemy extends Entities {
	private scoreValue: number;

	constructor(
		co: Coordonee,
		speed: number,
		hp: number,
		taille: number,
		score: number,
		spriteId: string
	) {
		super(co, 0, 0, speed, taille, taille, spriteId, hp);
		this.scoreValue = score;
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
		if (this.getX() > j.getX() + distMin) {
			this.setX(this.getX() + this.speed * -1);
		} else if (this.getX() < j.getX() - distMin) {
			this.setX(this.getX() + this.speed * 1);
		}

		if (this.getY() > j.getY() + distMin) {
			this.setY(this.getY() + this.speed * -1);
		} else if (this.getY() < j.getY() - distMin) {
			this.setY(this.getY() + this.speed * 1);
		}
		verifCoordonee(this, worldWidth, worldHeight);
	}
}
