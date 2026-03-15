import type { Coordonee } from './types';

export default class Entities {
	pseudo?: string;
	co: Coordonee;
	vx: number;
	vy: number;
	speed: number;
	vie?: number;

	constructor(
		co: Coordonee,
		vx: number,
		vy: number,
		speed: number,
		pseudo?: string,
		vie?: number
	) {
		this.pseudo = pseudo;
		this.co = co;
		this.vx = vx;
		this.vy = vy;
		this.speed = speed;
		this.vie = vie;
	}

	getPseudo(): string {
		return this.pseudo!;
	}

	setPseudo(nouveauPseudo: string): void {
		this.pseudo = nouveauPseudo;
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
}
