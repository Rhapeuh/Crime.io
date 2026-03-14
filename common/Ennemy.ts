import Joueur from './Joueur.ts';
import { Coordonee } from './types.ts';

export class Ennemy extends Joueur {
	constructor(
		pseudo: string,
		coJoueur: Coordonee,
		vx: number,
		vy: number,
		speed: number,
		vies: number
	) {
		super(pseudo, coJoueur, vx, vy, speed, vies);
	}
}
