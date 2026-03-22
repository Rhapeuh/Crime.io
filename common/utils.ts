import type Ennemy from './Ennemy.ts';
import Entities from './Entities.ts';
import type Joueur from './Joueur.ts';

export function verifCoordonee(
	e: Entities,
	worldWidth: number,
	worldHeight: number
) {
	const halfW = e.getWidth() / 2;
	const halfH = e.getHeight() / 2;

	if (e.getX() - halfW < 0) e.setX(halfW);

	if (e.getX() + halfW > worldWidth) e.setX(worldWidth - halfW);

	if (e.getY() - halfH < 0) e.setY(halfH);

	if (e.getY() + halfH > worldHeight) e.setY(worldHeight - halfH);
}


export function trouverJoueurPlusProche(entite: Ennemy, listeJoueurs: Joueur[]): { joueur: Joueur, distance: number } | null {
    if (listeJoueurs.length === 0) return null; // Sécurité au cas où il n'y a pas de joueurs
    
    let joueurProche = listeJoueurs[0];
    let distMin = calculeDistance(entite, joueurProche);

    for (let i = 1; i < listeJoueurs.length; i++) {
        const newDist = calculeDistance(entite, listeJoueurs[i]);
        if (newDist < distMin) {
            joueurProche = listeJoueurs[i];
            distMin = newDist;
        }
    }
    return { joueur: joueurProche, distance: distMin };
}

export function calculeDistance(obj1: { getX(): number, getY(): number }, obj2: { getX(): number, getY(): number }) {
    const distX = Math.abs(obj1.getX() - obj2.getX());
    const distY = Math.abs(obj1.getY() - obj2.getY());
    return Math.hypot(distX, distY);
}

export function calculerAngle(depart: { x: number, y: number }, cible: { x: number, y: number }): number {
    const dx = cible.x - depart.x;
    const dy = cible.y - depart.y;
    return Math.atan2(dy, dx);
}

export function checkCollision(entityA: Entities, entityB: Entities): boolean {
        const halfWA = entityA.getWidth() / 2;
        const halfHA = entityA.getHeight() / 2;
        const halfWB = entityB.getWidth() / 2;
        const halfHB = entityB.getHeight() / 2;

        const leftA = entityA.getX() - halfWA;
        const rightA = entityA.getX() + halfWA;
        const topA = entityA.getY() - halfHA;
        const bottomA = entityA.getY() + halfHA;

        const leftB = entityB.getX() - halfWB;
        const rightB = entityB.getX() + halfWB;
        const topB = entityB.getY() - halfHB;
        const bottomB = entityB.getY() + halfHB;

        return leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB;
    }