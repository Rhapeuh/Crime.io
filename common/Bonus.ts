import type { Coordonee } from './types.ts';

export default class Bonus {
	coordonee: Coordonee;

	constructor(coordonee: Coordonee) {
		this.coordonee = coordonee;
	}

	getCoordonee(): Coordonee {
		return this.coordonee;
	}
}
