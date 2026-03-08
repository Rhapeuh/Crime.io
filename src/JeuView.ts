import View from './View';
import Router from './Router';

export default class JeuView extends View {
	ctx;
	canva;

	constructor(element: HTMLElement) {
		super(element);

		this.canva = this.element.querySelector('canvas')!;

		this.canva.width = window.innerWidth;
		this.canva.height = window.innerHeight;
		this.ctx = this.canva.getContext('2d')!;

		this.renderConstructionMode();
		Router.setMenuElement(element);
	}

	renderConstructionMode() {
		const { width, height } = this.canva;
		const ctx = this.ctx;

		// --- 2. Barrières de sécurité "vignettées" ---
		// On dessine de grandes bandes jaune/noir sur un calque séparé,
		// puis on applique un masque pour qu'elles n'apparaissent qu'en bordure.

		// Créer un dégradé radial pour le masque (vignettage inversé)
		const maskGradient = ctx.createRadialGradient(
			width / 2,
			height / 2,
			width * 0.3, // Zone centrale claire
			width / 2,
			height / 2,
			width * 0.8 // Fondu vers l'extérieur
		);
		maskGradient.addColorStop(0, 'rgba(0,0,0,0)'); // Transparent au centre
		maskGradient.addColorStop(1, 'rgba(0,0,0,0.4)'); // Sombre sur les bords

		// Appliquer le masque de vignettage sur tout l'écran
		ctx.fillStyle = maskGradient;
		ctx.fillRect(0, 0, width, height);

		// Maintenant dessiner les bandes
		ctx.save(); // Sauvegarder l'état (avant le filtre de flou)

		// Un léger flou pour les intégrer à l'arrière-plan
		ctx.filter = 'blur(4px)';

		const stripeWidth = 60; // Largeur d'une paire de bandes
		const stripeColor1 = 'rgba(241, 196, 15, 0.5)';

		for (let x = -height; x < width + height; x += stripeWidth) {
			ctx.fillStyle = stripeColor1;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x + stripeWidth / 2, 0);
			ctx.lineTo(x + stripeWidth / 2 + height, height);
			ctx.lineTo(x + height, height);
			ctx.closePath();
			ctx.fill();
		}
		ctx.restore(); // Restaurer l'état (enlever le flou)

		// --- 3. Titre Principal ---
		ctx.save();

		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		ctx.fillStyle = 'white';
		// Utilisation d'une police système pour le style, ou remplace par ta police de jeu
		ctx.font = 'bold 80px "Arial Black", Gadget, sans-serif';
		ctx.fillText('EN CONSTRUCTION', width / 2, height / 2 - 20);

		// Ajout d'un léger contour pour "détacher" le texte
		ctx.shadowBlur = 0; // Enlever la lueur pour le contour
		ctx.strokeStyle = '#2c3e50';
		ctx.lineWidth = 2;
		ctx.strokeText('EN CONSTRUCTION', width / 2, height / 2 - 20);

		ctx.restore();
	}
}
