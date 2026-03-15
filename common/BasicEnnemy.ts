import Ennemy from './Ennemy.ts';
import type { Coordonee } from './types';

export class BasicEnnemy extends Ennemy {
	constructor(coJoueur: Coordonee) {
		super(coJoueur);
	}
}
