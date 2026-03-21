import Entities from './Entities.ts';
import type Joueur from './Joueur';
import type { Coordonee } from './types.ts';
import { verifCoordonee } from './utils.ts';

export default class Ennemy extends Entities {
	constructor(co: Coordonee) {
		super(co, 0, 0, 3, 50, 50, undefined, 1);
	}

	public update(j: Joueur, worldWidth: number, worldHeight: number) {
			if (this.getX() > j.getX()) {
				this.setX(this.getX() + this.speed * -1);
			} else if (this.getX() < j.getX()) {
				this.setX(this.getX() + this.speed * 1);
			}
	
			if (this.getY() > j.getY()) {
				this.setY(this.getY() + this.speed * -1);
			} else if (this.getY() < j.getY()) {
				this.setY(this.getY() + this.speed * 1);
			}
			verifCoordonee(this, worldWidth, worldHeight);
		}
}
