import type { Coordonee } from './types.ts';

export default class Joueur {
	pseudo?: string;
	coJoueur: Coordonee;
	vx: number;
	vy: number;
	speed: number;

	constructor(
		pseudo: string,
		coJoueur: Coordonee,
		vx: number,
		vy: number,
		speed: number
	) {
		this.pseudo = pseudo;
		this.coJoueur = coJoueur;
		this.vx = vx;
		this.vy = vy;
		this.speed = speed;
	}

	getPseudo(): string {
		return this.pseudo!;
	}

	setPseudo(nouveauPseudo: string): void {
		this.pseudo = nouveauPseudo;
	}

	getX(): number {
		return this.coJoueur.x;
	}
	getY(): number {
		return this.coJoueur.y;
	}
	setX(posX: number): void {
		this.coJoueur.x = posX;
	}
	setY(posY: number): void {
		this.coJoueur.y = posY;
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
}
