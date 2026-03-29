export default class Assets {
	private static images: Map<string, HTMLImageElement> = new Map();

	static async loadAll() {
		const imagesToLoad = [
			{ id: 'scarab', src: '/images/perso/scarab.png' },
			{ id: 'ballePerso', src: '/images/ballePerso.png' },
			{ id: 'balleEnnemy', src: '/images/balleEnnemy.png' },
			{ id: 'persoTemp', src: '/images/perso/persoTemp.jpg' },
			{ id: 'ennemiMelee', src: '/images/perso/basic_ennemy.png' },
			{ id: 'shooterEnnemi', src: '/images/perso/shooterEnnemy.jpg' },
			{ id: 'bonusTemp', src: '/images/bonusTemp.jpg' },
			{ id: 'basicEnnemy', src: '/images/perso/basic_ennemy.png' },
			{ id: 'glissade', src: '/images/glissade.png' },
			{ id: 'moinsHP', src: '/images/moinsHP.png' },
			{ id: 'plusHP', src: '/images/plusHP.png' },
			{ id: 'moinsWidth', src: '/images/moinsWidth.png' },
			{ id: 'plusWidth', src: '/images/plusWidth.png' },
		];

		const promises = imagesToLoad.map(item => {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				img.onload = () => {
					this.images.set(item.id, img);
					resolve(); // Succès
				};
				img.onerror = () =>
					reject(new Error(`Échec du chargement : ${item.src}`)); // Erreur
				img.src = item.src; // Lance le chargement
			});
		});

		// Attend que toutes les images soient chargées
		await Promise.all(promises);
	}

	static getImage(spriteId: string): HTMLImageElement | undefined {
		return this.images.get(spriteId);
	}
}
