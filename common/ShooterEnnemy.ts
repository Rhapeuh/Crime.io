import type { Coordonee } from './types';
import Ennemy, { DifficulteEnnemi } from './Ennemy.ts';
import Joueur from './Joueur.ts';

const STATS_ENNEMIS = {
	[DifficulteEnnemi.FACILE]: { fireRate: 1500 },
	[DifficulteEnnemi.MOYEN]: { fireRate: 600 },
	[DifficulteEnnemi.DIFFICILE]: { fireRate: 200 },
};

export default class ShooterEnnemy extends Ennemy {
	private fireRate: number;
	private prochainTire: number;

	constructor(
		co: Coordonee,
		difficulte: DifficulteEnnemi = DifficulteEnnemi.FACILE
	) {
		super(co, difficulte, 'shooterEnnemi');
		const stats = STATS_ENNEMIS[difficulte];
		this.fireRate = stats.fireRate;
		this.prochainTire = 0;
	}

	public update(j: Joueur, worldWidth: number, worldHeight: number) {
		super.update(j, worldWidth, worldHeight, 250);
	}

	public shoot(now: number): boolean {
		if (now >= this.prochainTire) {
			this.prochainTire = now + this.fireRate;
			return true;
		}
		return false;
	}
}
