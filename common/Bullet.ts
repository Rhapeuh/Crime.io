import type { Coordonee } from '../common/types.ts';
import Entities from './Entities.ts';
import type Joueur from './Joueur';

export default class Bullet extends Entities {
	createdAt: Coordonee;
	active: boolean;
	bulletRange: number;
	joueur: Joueur;

	constructor(
		co: Coordonee,
		angle: number,
		speed: number,
		joueur: Joueur,
		bulletRange: number = 1000
	) {
		super(co, Math.cos(angle) * speed, Math.sin(angle) * speed, speed, 20, 10, 'bullet');
		this.createdAt = co;
		this.active = true;
		this.joueur = joueur;
		this.bulletRange = bulletRange;
	}

	update() {
		this.setCoordonee({ x: this.getX() + this.vx, y: this.getY() + this.vy });
	}

	shouldBeDeleted(): boolean {
		if (
			this.getX() + this.bulletRange < this.createdAt.x ||
			this.getX() - this.bulletRange > this.createdAt.x ||
			this.getY() + this.bulletRange < this.createdAt.y ||
			this.getY() - this.bulletRange > this.createdAt.y
		) {
			return true;
		} else {
			return false;
		}
	}

	getJoueur() {
		return this.joueur;
	}
}
