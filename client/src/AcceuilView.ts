import Router from './Router';
import View from './View';

export default class AcceuilView extends View {
	private menuGauche: HTMLElement;
	private dernierElement: HTMLElement | null = null;

	constructor(element: HTMLElement) {
		super(element);
		this.menuGauche = this.element.querySelector('.colonne.gauche')!;
		this.setMenuInterne();
		Router.setMenuElement(this.element);
	}

	setMenuInterne() {
		// On cible spécifiquement les boutons du menu
		const menuLinks = this.element.querySelectorAll('.colonne.gauche > div');

		menuLinks.forEach(element => {
			element.addEventListener('click', event => {
				event.preventDefault();

				if (this.dernierElement === element) {
					// Si on clique sur le même : on ferme
					this.fermerTiroir();
					this.dernierElement = null;
				} else {
					// Si on clique sur un autre : on ouvre (ou on reste ouvert)
					this.ouvrirTiroir();
					this.dernierElement = element as HTMLElement;
				}
			});
		});
	}

	ouvrirTiroir() {
		this.menuGauche.classList.add('ouvert');
	}

	fermerTiroir() {
		this.menuGauche.classList.remove('ouvert');
	}
}
