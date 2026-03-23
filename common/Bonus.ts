import { bonusEnum, Coordonee } from './types.ts';

export default class Bonus {
	bonus: bonusEnum;
	coordonee: Coordonee;

	constructor(bonus: bonusEnum, coordonee: Coordonee) {
		this.bonus = bonus;
		this.coordonee = coordonee;
	}

	getCoordonee(): Coordonee {
		return this.coordonee;
	}

	getBonus(): bonusEnum {
		return this.bonus;
	}
}
