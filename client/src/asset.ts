export default class Assets {
    private static images: Map<string, HTMLImageElement> = new Map();

    static async loadAll() {
        const imagesToLoad = [
            { id: 'persoTemp', src: '/images/persoTemp.jpg' },
            { id: 'bullet', src: '/images/bullet.jpg' },
            { id: 'ennemiTemp', src: '/images/ennemyTemp.jpg' }
        ];

        const promises = imagesToLoad.map(item => {
            return new Promise<void>((resolve, reject) => {
                const img = new Image()
                img.onload = () => {
                    this.images.set(item.id, img);
                    resolve(); // Succès
                }
                img.onerror = () => reject(new Error(`Échec du chargement : ${item.src}`)); // Erreur
                img.src = item.src;           // Lance le chargement
            });
        });

        // Attend que toutes les images soient chargées
        await Promise.all(promises); 
    }

    static getImage(spriteId: string): HTMLImageElement | undefined {
        return this.images.get(spriteId);
    }
}