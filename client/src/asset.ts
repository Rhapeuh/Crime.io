export default class Assets {
    static persoTemp1 = new Image();
    static persoTemp2 = new Image();
    static ennemyTemp = new Image();

    static async loadAll() {
        const imagesToLoad = [
            { img: this.persoTemp1, src: '/images/persoTemp1.jpg' },
            { img: this.persoTemp2, src: '/images/persoTemp2.jpg' },
            { img: this.ennemyTemp, src: '/images/ennemyTemp.jpg' }
        ];

        const promises = imagesToLoad.map(item => {
            return new Promise<void>((resolve, reject) => {
                item.img.onload = () => resolve(); // Succès
                item.img.onerror = () => reject(new Error(`Échec du chargement : ${item.src}`)); // Erreur
                item.img.src = item.src;           // Lance le chargement
            });
        });

        // Attend que toutes les images soient chargées
        await Promise.all(promises); 
    }
}