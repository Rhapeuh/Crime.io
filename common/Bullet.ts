import type { Coordonee } from '../common/types.ts';
import Entities from './Entities.ts';
import type Joueur from './Joueur';

export default class Bullet extends Entities {
	createdAt: Coordonee;
	width: number;
	height: number;
	active: boolean;
	angle: number;
	bulletRange: number;
	joueur: Joueur;

	constructor(
		co: Coordonee,
		angle: number,
		speed: number,
		joueur: Joueur,
		bulletRange: number = 1000
	) {
		super(co, Math.cos(angle) * speed, Math.sin(angle) * speed, speed);
		this.createdAt = co;
		this.angle = angle;
		this.width = 20;
		this.height = 10;
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
}
