import type { Coordonee } from '../common/types.ts';
import type Joueur from './Joueur';

export default class Bullet {
	x: number;
	y: number;
	createdAtX: number;
	createdAtY: number;
	speed: number;
	width: number;
	height: number;
	active: boolean;
	angle: number;
	vx: number;
	vy: number;
	bulletRange: number;
	joueur: Joueur;

	constructor(
		coordonee: Coordonee,
		angle: number,
		speed: number,
		joueur: Joueur,
		bulletRange: number = 1000
	) {
		this.x = coordonee.x;
		this.y = coordonee.y;
		this.createdAtX = coordonee.x;
		this.createdAtY = coordonee.y;
		this.speed = speed;
		this.angle = angle;
		this.width = 20;
		this.height = 10;
		this.active = true;
		this.vx = Math.cos(angle) * speed;
		this.vy = Math.sin(angle) * speed;
		this.joueur = joueur;
		this.bulletRange = bulletRange;
	}

	getCoordonee(): Coordonee {
		return { x: this.x, y: this.y };
	}

	update() {
		this.x = this.x + this.vx;
		this.y = this.y + this.vy;
	}

	setCoordonee(coordonee: Coordonee) {
		this.x = coordonee.x;
		this.y = coordonee.y;
	}

	shouldBeDeleted(): boolean {
		if (
			this.x + this.bulletRange < this.createdAtX ||
			this.x - this.bulletRange > this.createdAtX ||
			this.y + this.bulletRange < this.createdAtY ||
			this.y - this.bulletRange > this.createdAtY
		) {
			return true;
		} else {
			return false;
		}
	}
}
