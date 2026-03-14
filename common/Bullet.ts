import { Coordonee } from '../common/types.ts';

class Bullet {
	x: number;
	y: number;
	speed: number;
	width: number;
	height: number;
	active: boolean;
	angle: number;
	vx: number;
	vy: number;

	constructor(coordonee: Coordonee, angle: number, speed: number) {
		this.x = coordonee.x;
		this.y = coordonee.y;
		this.speed = speed;
		this.angle = angle;
		this.width = 5;
		this.height = 10;
		this.active = true;
		this.vx = Math.cos(angle) * speed;
		this.vy = Math.sin(angle) * speed;
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
}
