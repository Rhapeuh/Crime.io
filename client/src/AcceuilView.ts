import Router from './Router';
import View from './View';
import type { scores } from '../../common/types';
import Score from './Score';
import type { Socket } from 'socket.io-client';

export default class AcceuilView extends View {
	private menuGauche: HTMLElement;
	private dernierElement: HTMLElement | null = null;
	private fondElement: HTMLElement;
	private socket: Socket

	constructor(element: HTMLElement, socket: Socket) {
		super(element);
		this.socket = socket
		this.menuGauche = this.element.querySelector('.colonne.gauche')!;
		this.fondElement = this.element.querySelector('.fond')!;
		this.setMenuInterne();
		Router.setMenuElement(this.element);
	}

	private setMenuInterne() {
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
				setTimeout(() => {this.injecterHTML()}, 200);
				
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
		});
	}

	private ouvrirTiroir() {
		this.menuGauche.classList.add('ouvert');
		this.dernierElement?.classList.add('btn-cliquer');
		this.injecterHTML();
	}

	private fermerTiroir() {
		this.menuGauche.classList.remove('ouvert');
		this.dernierElement?.classList.remove('btn-cliquer');
		this.dernierElement = null;
	}

	private async injecterHTML() {
		this.fondElement.innerHTML = '';
		if (this.dernierElement?.className.includes('Scores')) {
        this.fondElement.innerHTML = '<p>Chargement des scores...</p>';

        try {
            const listScore = await this.recupererScores();
            this.fondElement.innerHTML = Score.genererTableauScores(listScore);
        } catch (error) {
            this.fondElement.innerHTML = '<p>Erreur lors du chargement des scores.</p>';
        }
    }
	}

	private recupererScores(): Promise<scores[]> {
    return new Promise((resolve) => {
        this.socket.emit('demandeScore');
        this.socket.once('envoiScore', (data: scores[]) => {
            resolve(data);
        });
    });
}
}
