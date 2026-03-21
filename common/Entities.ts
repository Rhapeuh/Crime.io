import type { Coordonee } from './types';

export default class Entities {
	co: Coordonee;
	vx: number;
	vy: number;
	speed: number;
	width: number;
	height: number;
	vie?: number;

	constructor(
		co: Coordonee,
		vx: number,
		vy: number,
		speed: number,
		width: number,
		height: number,
		vie?: number,
	) {
		this.co = co;
		this.vx = vx;
		this.vy = vy;
		this.speed = speed;
		this.width = width;
		this.height = height;
		this.vie = vie;
	}

	getVX(): number {
		return this.vx;
	}
	getVY(): number {
		return this.vy;
	}
	setVX(vecteurX: number): void {
		this.vx = vecteurX;
	}
	setVY(vecteurY: number): void {
		this.vy = vecteurY;
	}

	getSpeed(): number {
		return this.speed;
	}
	setSpeed(speed: number): void {
		this.speed = speed;
	}

	getCoordonee(): Coordonee {
		return this.co;
	}
	setCoordonee(co: Coordonee) {
		this.co = co;
	}

	getX(): number {
		return this.co.x;
	}
	setX(x: number) {
		this.co.x = x;
	}

	getY(): number {
		return this.co.y;
	}
	setY(y: number) {
		this.co.y = y;
	}

	getWidth() {
		return this.width;
	}
	getHeight() {
		return this.height;
	}

	public getVies(): number {
		return this.vie!;
	}
	setVies(vies: number) {
		this.vie = vies;
	}

	enleverVie() {
		if (this.vie) this.vie -= 1;
	}

	estEnVie(): boolean {
		if(this.vie) return this.vie > 0
		return false;
	}

	ajouterVies() {
		if(this.vie) this.vie ++ 
	}
}
