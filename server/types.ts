import { randomInt } from "node:crypto";

export class Joueur {
	pseudo?: string;      
	coJoueur: Coordonee;
	vx: number;
	vy: number;
	speed: number;

	constructor(
		pseudo: string | null,      // j'ai mis le null pour mettre l'autogeneration de pseudo dispo avec un speudo null
		coJoueur: Coordonee,
		vx: number,
		vy: number,
		speed: number
	) {
        if (pseudo == null){
           pseudo = this.genereNom(); 
        }
		this.pseudo = pseudo;
		this.coJoueur = coJoueur;
		this.vx = vx;
		this.vy = vy;
		this.speed = speed;
	}

	getPseudo(): string{      // TODO verifier le cas ou il est undefined
        return this.pseudo!;
    }
	setPseudo(nouveauPseudo: string): void{
        this.pseudo = nouveauPseudo;
    }

	getX(): number{
        return this.coJoueur.getX();
    }
	getY(): number{
        return this.coJoueur.getY();
    }
	setX(posX: number): void{
        this.coJoueur.setX(posX);
    }
	setY(posY: number): void{
        this.coJoueur.setY(posY);
    }

	getVX(): number{
        return this.vx;
    }
	getVY(): number{
        return this.vy;
    }
	setVX(vecteurX: number): void{
        this.vx = vecteurX;
    }
	setVY(vecteurY: number): void{
        this.vx = vecteurY;
    }

	getSpeed(): number{
        return this.speed;
    }
	setSpeed(speed: number): void{
        this.speed = speed;
    }

    genereNom(): string{        // pas testé
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

        const tailleStr = randomInt(999999); 
        const num = randomInt(6);

        let temp = "";
        for (let i=0; i<tailleStr; i++){
            const randomIndex = Math.floor(Math.random() * characters.length);
            temp += characters.charAt(randomIndex);
        }

        return temp.concat(num.toString());
    }
}

export class Coordonee {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	getX(): number {
		return this.x;
	}
	getY(): number {
		return this.y;
	}

	setX(posX: number): void {
		this.x = posX;
	}
	setY(posY: number): void {
		this.y = posY;
	}
}
