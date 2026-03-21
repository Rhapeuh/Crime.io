import Ennemy from './Ennemy.ts';
import type { Coordonee } from './types';

export const DifficulteEnnemi = {
    FACILE: 'FACILE',
    MOYEN: 'MOYEN',
    DIFFICILE: 'DIFFICILE'
}

const STATS_ENNEMIS = {
	[DifficulteEnnemi.FACILE]: { speed: 2, hp: 1, score: 10, taille: 40 },
	[DifficulteEnnemi.MOYEN]: { speed: 3, hp: 2, score: 25, taille: 50 },
	[DifficulteEnnemi.DIFFICILE]: { speed: 5, hp: 3, score: 50, taille: 60 },
};

export default class BasicEnnemy extends Ennemy {
	constructor(
		co: Coordonee,
		difficulte = DifficulteEnnemi.FACILE
	) {
		const stats = STATS_ENNEMIS[difficulte];
		super(co, stats.speed, stats.hp, stats.taille, stats.score);
	}
}
