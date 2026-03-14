import Joueur from './Joueur.ts';
// import Ennemy from './Ennemy.ts';

export default class Game {
	joueurs: Array<Joueur>;
	// ennemies: Array<Ennemy>;

	constructor() {
		this.joueurs = new Array<Joueur>();
		// this.ennemies = new Array<Ennemy>();
	}

	addJoueur(joueur: Joueur) {
		this.joueurs.push(joueur);
	}

	removeJoueur(joueur: Joueur) {
		this.joueurs = this.joueurs.filter(j => {
			j !== joueur;
		});
	}

	// addEnnemy(ennemy: Ennemy) {
	// 	this.ennemies.push(ennemy);
	// }
	// removeEnnemy(ennemy: Ennemy) {
	// 	this.ennemies = this.ennemies.filter(e => e !== ennemy);
	// }
}
