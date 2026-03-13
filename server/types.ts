export interface Joueur {
    pseudo?: string;
    coJoueur: Coordonee
    vx: number;
    vy: number;
    speed: number;

    getPseudo() : string;
    setPseudo(nouveauPseudo: string) : void;

    getX(): number;
    getY(): number;
    setX(posX : number): void;
    setY(posY : number): void;

    getVX(): number;
    getVY(): number;
    setVX(vecteurX : number): void;
    setVY(vecteurY : number): void;

    getSpeed() : number;
    setSpeed(speed: number) : void;
}

export interface Coordonee {
    x: number;
    y: number;

    getX(): number;
    getY(): number;

    setX(posX : number): void;
    setY(posY : number): void;
}
