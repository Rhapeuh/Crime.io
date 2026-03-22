import type { Coordonee } from './types';
import Ennemy from './Ennemy.ts';
import Joueur from './Joueur.ts';

export default class ShooterEnnemy extends Ennemy {
    private fireRate: number;
    private prochainTire: number;

	constructor(co: Coordonee) {
		super(co, 3, 1, 50, 20, 'shooterEnnemi');
        this.fireRate = 1000; 
        this.prochainTire = 0;
	}

	public update(j: Joueur, worldWidth: number, worldHeight: number) {
		super.update(j, worldWidth, worldHeight, 300);
	}

    public shoot(now: number): boolean {
        if (now >= this.prochainTire) {
            this.prochainTire = now + this.fireRate;
            return true;
        }
        return false;
    }
}
