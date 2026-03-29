import Router from './Router';
import View from './View';
import type { scores } from '../../common/types';
import Score from './Score';
import type { Socket } from 'socket.io-client';
import { genererCredits } from './Credits';
import Parametres from './Parametres';
import { currentDifficulte, setCurrentDifficulte, currentCharacter, setCurrentCharacter } from './main';

export default class AccueilView extends View {
	private menuGauche: HTMLElement;
	private dernierElement: HTMLElement | null = null;
	private fondElement: HTMLElement;
	private socket: Socket;

	constructor(element: HTMLElement, socket: Socket) {
		super(element);
		this.socket = socket;
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
					const fond = document.querySelector('.fond') as HTMLElement;
					if (this.dernierElement !== document.querySelector('.credits'))
						fond.style.overflow = 'hidden';
					else fond.style.overflow = 'scroll';
					this.ouvrirTiroir();
				}
				setTimeout(() => {
					// pour l'animation de fermeture le avant de delete l'element
					this.injecterHTML();
				}, 200);
			});
		});

		document.addEventListener('click', event => {
			const target = event.target as HTMLElement;
			if (
				this.menuGauche.classList.contains('ouvert') &&
				!this.menuGauche.contains(target) &&
				!this.fondElement.contains(target)
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
				this.fondElement.innerHTML =
					'<p>Erreur lors du chargement des scores.</p>';
			}
		} else if (
			this.dernierElement?.className.toLowerCase().includes('credit')
		) {
			this.fondElement.innerHTML = await genererCredits();
		} else if (
			this.dernierElement?.className.toLowerCase().includes('paramètres')
		) {
			this.fondElement.innerHTML = Parametres.genererParametres();
			// Handle difficulty buttons
			this.fondElement.querySelectorAll('.btn-difficulte').forEach(btn => {
				const btnDiff = parseInt(btn.getAttribute('data-difficulte') || '1');
				if (btnDiff === currentDifficulte) {
					btn.classList.add('selected');
				} else {
					btn.classList.remove('selected');
				}
				btn.addEventListener('click', e => {
					const target = e.target as HTMLElement;
					setCurrentDifficulte(
						parseInt(target.getAttribute('data-difficulte') || '1')
					);
					this.fondElement
						.querySelectorAll('.btn-difficulte')
						.forEach(b => b.classList.remove('selected'));
					target.classList.add('selected');
				});
			});
			// Handle character buttons
			this.fondElement.querySelectorAll('.btn-personnage').forEach(btn => {
				const btnChar = btn.getAttribute('data-personnage') || 'Fleinz';
				if (btnChar === currentCharacter) {
					btn.classList.add('selected');
				} else {
					btn.classList.remove('selected');
				}
				btn.addEventListener('click', e => {
					const target = e.target as HTMLElement;
					const personnage = target.closest('.btn-personnage')?.getAttribute('data-personnage') || 'scarab';
					setCurrentCharacter(personnage);
					this.fondElement
						.querySelectorAll('.btn-personnage')
						.forEach(b => b.classList.remove('selected'));
					target.closest('.btn-personnage')?.classList.add('selected');
				});
			});
		}
	}

	private recupererScores(): Promise<scores[]> {
		return new Promise(resolve => {
			this.socket.emit('demandeScore');
			this.socket.once('envoiScore', (data: scores[]) => {
				resolve(data);
			});
		});
	}
}
