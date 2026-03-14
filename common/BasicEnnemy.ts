import { Ennemy } from "./Ennemy.ts";
import type { Coordonee } from "./types";

export class BasicEnnemy extends Ennemy{
    constructor(
            pseudo: string,
            coJoueur: Coordonee,
            vx: number,
            vy: number,
            speed: number,
            vies: number
        ) {
            super(pseudo, coJoueur, vx, vy, speed, vies);
        }
}