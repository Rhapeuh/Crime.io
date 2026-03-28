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
		entite: Entities,
		bulletRange: number = 500,
		bulletWidth: number,
		bulletHeight: number,
		sprite: string
	) {
		super(
			co,
			Math.cos(angle) * speed,
			Math.sin(angle) * speed,
			speed,
			bulletWidth,
			bulletHeight,
			sprite
		);
		this.createdAt = co;
		this.active = true;
		this.entitie = entite;
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
