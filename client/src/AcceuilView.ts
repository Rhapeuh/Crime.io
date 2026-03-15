import Router from './Router';
import View from './View';
import Score from './Score';

export default class AcceuilView extends View {
	private menuGauche: HTMLElement;
	private dernierElement: HTMLElement | null = null;
	private fondElement: HTMLElement;

	constructor(element: HTMLElement) {
		super(element);
		this.menuGauche = this.element.querySelector('.colonne.gauche')!;
		this.fondElement = this.element.querySelector('.fond')!;
		this.setMenuInterne();
		Router.setMenuElement(this.element);
	}

	setMenuInterne() {
		const menuLinks = this.element.querySelectorAll('.colonne.gauche > div');

		menuLinks.forEach(element => {
			element.addEventListener('click', event => {
				event.preventDefault();
				event.stopPropagation();

				this.dernierElement?.classList.remove('btn-cliquer');
				if (this.dernierElement === element) {
					this.fermerTiroir();
				} else {
					this.dernierElement = element as HTMLElement;
					this.ouvrirTiroir();
				}
				this.injecterHTML();
			});
		});

		document.addEventListener('click', event => {
			const target = event.target as HTMLElement;

			if (
				this.menuGauche.classList.contains('ouvert') &&
				!this.menuGauche.contains(target)
			) {
				this.fermerTiroir();
			}
			this.injecterHTML()
		});
	}

	ouvrirTiroir() {
		this.menuGauche.classList.add('ouvert');
		this.dernierElement?.classList.add('btn-cliquer');
		this.fondElement.innerHTML = Score.genererTableauScores();
	}

	fermerTiroir() {
		this.menuGauche.classList.remove('ouvert');
		this.dernierElement?.classList.remove('btn-cliquer');
		this.dernierElement = null;
	}

	private injecterHTML() {
		this.fondElement.innerHTML = "";

		if (this.dernierElement?.className.includes('Scores')) {
            this.fondElement.innerHTML = Score.genererTableauScores();
		}
	}
}
