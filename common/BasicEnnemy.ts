import { Ennemy } from '../common/Ennemy.ts';
import type { Coordonee } from '../common/types.ts';

export class BasicEnnemy extends Ennemy {
	constructor(
		pseudo: string,
		coJoueur: Coordonee,
		vx: number,
		vy: number,
		speed: number
	) {
		super(pseudo, coJoueur, vx, vy, speed, 100); // base hp a 100 je pense
	}
}
