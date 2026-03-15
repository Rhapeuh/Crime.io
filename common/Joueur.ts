import type { Coordonee } from './types.ts';
import Entities from './Entities.ts'

export default class Joueur extends Entities{
	invincibilite: boolean;

	constructor(
		pseudo: string,
		coJoueur: Coordonee,
		speed: number,
		vies: number,
		width: number,
		height: number,
	) {
		super(coJoueur, 0, 0, speed, width, height, pseudo, vies)
		this.invincibilite = false;
	}

	getVies(): number {
		return this.vie!;
	}
	setVies(vies: number) {
		this.vie = vies;
	}
	enleverVies(damages: number) {
		this.vie = this.vie! - damages;
	}
	ajouterVies(vies: number) {
		this.vie = this.vie! + vies;
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
