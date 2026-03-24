export default class Parametres {
	static genererMenu(): string {
		return `
			<div class="difficulteContent">
				<h2>Paramètres - Difficulté</h2>
				<div class="difficulte-grid">
					<button class="btn-difficulte" data-difficulte="0">Facile</button>
					<button class="btn-difficulte" data-difficulte="1">Moyen</button>
					<button class="btn-difficulte" data-difficulte="2">Difficile</button>
				</div>
			</div>
		`;
	}
}
