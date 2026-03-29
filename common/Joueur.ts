import type { Coordonee } from './types.ts';
import Entities from './Entities.ts';
import { verifCoordonee } from './utils.ts';

const sprite_config = {
	scarab: { width: 32, height: 32 },
	persoTemp: { width: 32, height: 32 },
	chat: { width: 16, height: 32 },
};

export default class Joueur extends Entities {
	pseudo: string;
	private invincibilite: boolean;
	private inputX: number = 0;
	private inputY: number = 0;
	score: number = 0;
	clientID: string;
	private friction: number = 0.9;
	private max_speed: number = 10;
	nbEnnemiTuer: number = 0;
	private startTime: number;

	constructor(
		pseudo: string,
		co: Coordonee,
		speed: number,
		vies: number,
		height: number,
		clientID: string,
		spriteId: string = 'scarab'
	) {
		const config = sprite_config[spriteId as keyof typeof sprite_config];
		const width = height * (config.width / config.height);
		super(co, 0, 0, speed, width, height, spriteId, vies);
		this.pseudo = pseudo;
		this.clientID = clientID;
		this.invincibilite = false;
		this.startTime = Date.now();
	}

	getPseudo(): string {
		return this.pseudo!;
	}

	setPseudo(nouveauPseudo: string): void {
		this.pseudo = nouveauPseudo;
	}

	public mettreInvincible() {
		this.invincibilite = true;
	}
	public enleverInvincible() {
		this.invincibilite = false;
	}
	public isInvincible(): boolean {
		return this.invincibilite;
	}

	public getInputX(): number {
		return this.inputX;
	}

	public setInputX(input: number) {
		this.inputX = input;
	}

	public getInputY(): number {
		return this.inputY;
	}

	public setInputY(input: number) {
		this.inputY = input;
	}

	public addScore(points: number) {
		this.score = this.score + points;
		this.nbEnnemiTuer++;
	}

	public getScore(): number {
		return this.score;
	}

	public getClientID() {
		return this.clientID;
	}

	public getMaxSpeed(): number {
		return this.max_speed;
	}
	public setMaxSpeed(maxSpeed: number) {
		this.max_speed = maxSpeed;
	}

	public setFriction(friction: number) {
		this.friction = friction;
	}

	public update(worldWidth: number, worldHeight: number) {
		this.appliquerPhysique();
		this.setX(this.getX() + this.getVX());
		this.setY(this.getY() + this.getVY());
		verifCoordonee(this, worldWidth, worldHeight);
	}

	private appliquerPhysique() {
		let newVX = this.getVX() + this.getInputX();
		let newVY = this.getVY() + this.getInputY();

		newVX *= this.friction;
		newVY *= this.friction;

		const vitesseActuelle = Math.hypot(newVX, newVY);
		if (vitesseActuelle > this.max_speed) {
			const angle = Math.atan2(newVY, newVX);
			newVX = Math.cos(angle) * this.max_speed;
			newVY = Math.sin(angle) * this.max_speed;
		}

		if (Math.abs(newVX) < 0.1) newVX = 0;
		if (Math.abs(newVY) < 0.1) newVY = 0;

		this.setVX(newVX);
		this.setVY(newVY);
	}

	public recalculScore(multiplicateur: number) {
		const tempsEnVie = Date.now() - this.startTime;
		const multiplicateurTemps = tempsEnVie / 60000;
		this.addScore(
			Math.trunc(this.getScore() * multiplicateurTemps * multiplicateur)
		);
	}
}
