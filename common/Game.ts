import Joueur from './Joueur.ts';
import Bullet from './Bullet.ts';
import Ennemy from './Ennemy.ts';

export default class Game {
	joueurs: Array<Joueur>;
	bulletsJoueur: Array<Bullet>;
	bulletsHit: Array<Bullet>;
	bulletsEnnemy: Array<Bullet>;
	ennemies: Array<Ennemy>;

	constructor() {
		this.joueurs = new Array<Joueur>();
		this.ennemies = new Array<Ennemy>();
		this.bulletsJoueur = new Array<Bullet>();
		this.bulletsHit = new Array<Bullet>();
		this.bulletsEnnemy = new Array<Bullet>();
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

	addBulletJoueur(bullet: Bullet) {
		this.bulletsJoueur.push(bullet);
	}
	removeBulletJoueur(bullet: Bullet) {
		this.bulletsJoueur = this.bulletsJoueur.filter(b => b !== bullet);
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

	addEnnemyBullet(bullet: Bullet) {
		this.bulletsEnnemy.push(bullet);
	}
	removeBulletEnnemy(bullet: Bullet) {
		this.bulletsEnnemy = this.bulletsEnnemy.filter(b => b !== bullet);
	}

	public clearAll() {
		this.joueurs = [];
		this.ennemies = [];
		this.bulletsJoueur = [];
		this.bulletsHit = [];
		this.bulletsEnnemy = [];
	}
}
