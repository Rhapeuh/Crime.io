import type { Coordonee } from './types.ts';
import Entities from './Entities.ts';

export default class Joueur extends Entities {
	invincibilite: boolean;

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
}
