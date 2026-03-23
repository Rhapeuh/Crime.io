import type { Coordonee } from '../common/types.ts';
import Entities from './Entities.ts';

export default class Bullet extends Entities {
	createdAt: Coordonee;
	active: boolean;
	bulletRange: number;
	entitie: Entities;

	constructor(
		co: Coordonee,
		angle: number,
		speed: number,
		joueur: Entities,
		bulletRange: number = 1000
	) {
		super(co, Math.cos(angle) * speed, Math.sin(angle) * speed, speed, 10, 5, 'bullet');
		this.createdAt = co;
		this.active = true;
		this.entitie = joueur;
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

	getEntitie() {
		return this.entitie;
	}
}
