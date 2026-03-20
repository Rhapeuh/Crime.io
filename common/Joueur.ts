import type { Coordonee } from './types.ts';
import Entities from './Entities.ts';

export default class Joueur extends Entities {
	invincibilite: boolean;
	inputX: number = 0;
	inputY: number = 0;
	score: number = 0;

	constructor(
		pseudo: string,
		co: Coordonee,
		speed: number,
		vies: number,
		width: number,
		height: number
	) {
		super(co, 0, 0, speed, width, height, pseudo, vies);
		this.invincibilite = false;
	}

	public mettreInvincible() {
		this.invincibilite = true;
	}
	public enleverInvincible() {
		this.invincibilite = false;
	}
	public isInvincible(): boolean {
		return this.invincibilite;
	}

	public getInputX(): number {
		return this.inputX;
	}

	public setInputX(input: number) {
		this.inputX = input;
	}

	public getInputY(): number {
		return this.inputY;
	}

	public setInputY(input: number) {
		this.inputY = input;
	}

	public addScore(points: number) {
		this.score = this.score + points;
	}
}
