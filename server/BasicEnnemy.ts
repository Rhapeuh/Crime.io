import { Ennemy } from './Ennemy';
import type { Coordonee } from './types';

export class BasicEnnemy extends Ennemy {
	constructor(
		pseudo: string | null,
		coJoueur: Coordonee,
		vx: number,
		vy: number,
		speed: number
	) {
		super(pseudo, coJoueur, vx, vy, speed, 100);    // base hp a 100 je pense
	}
}
