import Joueur from './Joueur.ts';
import Bullet from './Bullet.ts';
import Ennemy from './Ennemy.ts';

export default class Game {
	joueurs: Array<Joueur>;
	bullets: Array<Bullet>;
	bulletsHit: Array<Bullet>;
	ennemies: Array<Ennemy>;

	constructor() {
		this.joueurs = new Array<Joueur>();
		this.bullets = new Array<Bullet>();
		this.ennemies = new Array<Ennemy>();
		this.bulletsHit = new Array<Bullet>();
	}

	addJoueur(joueur: Joueur) {
		this.joueurs.push(joueur);
	}
	removeJoueur(joueur: Joueur) {
		this.joueurs = this.joueurs.filter(j => j !== joueur);
	}
	getNbJoueurs(): number {
		return this.joueurs.length;
	}

	addBullet(bullet: Bullet) {
		this.bullets.push(bullet);
	}
	removeBullet(bullet: Bullet) {
		this.bullets = this.bullets.filter(b => b !== bullet);
	}
	

	addBulletHit(bullet: Bullet) {
		this.bulletsHit.push(bullet);
	}
	removeBulletHit(bullet: Bullet) {
		this.bulletsHit = this.bulletsHit.filter(b => b !== bullet);
	}
	removeAllHit() {
		this.bulletsHit =  [];
	}

	addEnnemy(ennemy: Ennemy) {
		this.ennemies.push(ennemy);
	}
	removeEnnemy(ennemy: Ennemy) {
		this.ennemies = this.ennemies.filter(e => e !== ennemy);
	}
	getNbEnnemy(): number {
		return this.ennemies.length;
	}

	public clearAll() {
		this.joueurs = [];
		this.ennemies = [];
		this.bullets = [];
		this.bulletsHit = [];
	}
}
