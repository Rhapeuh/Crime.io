import Entities from './Entities.ts';
import type Joueur from './Joueur.ts';
import type { Coordonee } from './types.ts';
import { checkCollision } from './utils.ts';

type BonusEffect =
	| 'VIES_ADD'
	| 'VIES_REMOVE'
	| 'SPEED_ADD'
	| 'SPEED_REMOVE'
	| 'BULLET_WIDTH_ADD'
	| 'BULLET_WIDTH_REMOVE'
	| 'GLISSADE';

const bonusEffects = [
	{ effect: 'VIES_ADD' as BonusEffect, value: 1, spriteId: 'bonusTemp' },
	{ effect: 'VIES_REMOVE' as BonusEffect, value: 1, spriteId: 'bonusTemp' },
	{ effect: 'SPEED_ADD' as BonusEffect, value: 20, spriteId: 'bonusTemp' },
	{ effect: 'SPEED_REMOVE' as BonusEffect, value: 7, spriteId: 'bonusTemp' },
	{
		effect: 'BULLET_WIDTH_ADD' as BonusEffect,
		value: 5,
		spriteId: 'bonusTemp',
	},
	{
		effect: 'BULLET_WIDTH_REMOVE' as BonusEffect,
		value: 5,
		spriteId: 'bonusTemp',
	},
	{
		effect: 'GLISSADE' as BonusEffect,
		value: 1,
		spriteId: 'bonusTemp',
	},
];

export default class Bonus extends Entities {
	private effect: BonusEffect;
	private value: number;

	constructor(
		effect: BonusEffect,
		value: number,
		coordonee: Coordonee,
		spriteId: string = 'bonusTemp'
	) {
		super(coordonee, 0, 0, 0, 25, 25, spriteId, 1);
		this.effect = effect;
		this.value = value;
	}

	update(joueurs: Joueur[]) {
		for (const j of joueurs) {
			if (checkCollision(j, this)) {
				switch (this.effect) {
					case 'VIES_ADD':
						j.ajouterVies(this.value);
						break;
					case 'VIES_REMOVE':
						j.setVies(j.getVies() - this.value);
						break;
					case 'BULLET_WIDTH_ADD':
						j.setBulletWidth(j.getBulletWidth() + this.value);
						j.setBulletHeight(j.getBulletHeight() + this.value);
						setTimeout(() => {
							j.setBulletWidth(10);
							j.setBulletHeight(5);
						}, 15000);
						break;
					case 'BULLET_WIDTH_REMOVE':
						j.setBulletWidth(this.value);
						j.setBulletHeight(this.value);
						setTimeout(() => {
							j.setBulletWidth(10);
							j.setBulletHeight(5);
						}, 15000);
						break;
					case 'SPEED_ADD':
						j.setMaxSpeed(j.getMaxSpeed() + this.value);
						setTimeout(() => j.setMaxSpeed(10), 15000);
						break;
					case 'SPEED_REMOVE':
						j.setMaxSpeed(j.getMaxSpeed() - this.value);
						setTimeout(() => j.setMaxSpeed(10), 15000);
						break;
					case 'GLISSADE':
						j.setFriction(this.value);
						setTimeout(() => j.setFriction(0.9), 15000);
						break;
				}
				return j;
			}
		}
		return null;
	}

	public getEffect(): string {
		return this.effect;
	}

	public getValue(): number {
		return this.value;
	}

	static getRandomBonusEffect(coordonee: Coordonee): Bonus {
		const randomIndex = Math.floor(Math.random() * bonusEffects.length);
		const { effect, value, spriteId } = bonusEffects[randomIndex];
		return new Bonus(effect, value, coordonee, spriteId);
	}
}
