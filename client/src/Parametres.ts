export default class Parametres {
	static genererParametres(): string {
		return `
			<div class="parametresContent">
				<div class="difficulteSection">
					<h2>Difficulté</h2>
					<div class="difficulte-grid">
						<button class="btn-difficulte" data-difficulte="0">Facile</button>
						<button class="btn-difficulte" data-difficulte="1">Moyen</button>
						<button class="btn-difficulte" data-difficulte="2">Difficile</button>
						<button class="btn-difficulte" data-difficulte="3">IMPOSSIBLE</button>
					</div>
				</div>
				<div class="separator"></div>
				<div class="personnageSection">
					<h2>Personnage</h2>
					<div class="personnage-grid">
						<button class="btn-personnage" data-personnage="scarab">
							<img src="/images/perso/scarab.png" alt="Scarab" />
							<span>Scarab</span>
						</button>
						<button class="btn-personnage" data-personnage="persoTemp">
							<img src="/images/perso/persoTemp.jpg" alt="persoTemp" />
							<span>persoTemp</span>
						</button>
						<button class="btn-personnage" data-personnage="basicEnnemy">
							<img src="/images/perso/basic_ennemy.png" alt="basicEnnemy" />
							<span>basic_ennemy</span>
						</button>
					</div>
				</div>
			</div>
		`;
	}
}
