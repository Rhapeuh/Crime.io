import type { Socket } from 'socket.io-client';
import View from './View.ts';
import Router from './Router.ts';
import type Game from '../../common/Game.ts';
import type Joueur from '../../common/Joueur.ts';
import Assets from './asset.ts';
import type Bullet from '../../common/Bullet.ts';
import type { Coordonee } from '../../common/types.ts';
import type Ennemy from '../../common/Ennemy.ts';
import type Entities from '../../common/Entities.ts';
import type Bonus from '../../common/Bonus.ts';
import Chrono from './Chrono.ts';

export default class JeuView extends View {
	context: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	hudElement: HTMLDivElement;
	vx: number = 0;
	vy: number = 0;
	socket;
	coordoneeMouseToGo: Coordonee | null = null;
	chrono: Chrono = new Chrono();
	camera: Coordonee = { x: 0, y: 0 };
	worldWidth: number = 5000;
	worldHeight: number = 5000;
	private keys: { [key: string]: boolean } = {
		ArrowUp: false,
		KeyW: false,
		ArrowDown: false,
		KeyS: false,
		ArrowLeft: false,
		KeyA: false,
		ArrowRight: false,
		KeyD: false,
	};

	constructor(element: HTMLElement, socket: Socket) {
		super(element);
		this.chrono.start();
		this.socket = socket;

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleRender = this.handleRender.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleShooting = this.handleShooting.bind(this);
		this.mortJoueur = this.mortJoueur.bind(this);
		this.handleResize = this.handleResize.bind(this);

		this.canvas = this.element.querySelector('canvas')!;
		this.context = this.canvas.getContext('2d')!;

		this.handleResize();

		this.hudElement = this.element.querySelector('.hud')!;

		this.initEvents();
	}

	handleRender(g: Game) {
		this.render(g);
		this.checkMouseMovement(g.joueurs);
	}

	private initEvents() {
		window.addEventListener('resize', this.handleResize);
		window.addEventListener('contextmenu', e => e.preventDefault());
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
		this.socket.on('mortDuJoueur', this.mortJoueur);

		this.rejouerListener();
		this.retourListener();
	}

	private rejouerListener() {
		const rejouerButton = document.querySelectorAll('.rejouerButton');
		rejouerButton?.forEach(temp =>
			temp.addEventListener('click', event => {
				event.preventDefault;
				document
					.querySelectorAll('.joueurMort')
					?.forEach(elt => elt.classList.remove('active'));
				if (document.querySelector('.jeuSolo')?.contains(temp)) {
					Router.navigate('/jeuSolo');
				} else {
					Router.navigate('/jeuMulti');
				}
				document
					.querySelectorAll('.blur')!
					.forEach(temp => temp.setAttribute('class', 'blur'));
				document
					.querySelectorAll('.rejouerButton')!
					.forEach(temp => temp.setAttribute('class', 'rejouerButton'));
				document
					.querySelectorAll('.retour')!
					.forEach(temp => temp.setAttribute('class', 'retour'));
			})
		);
	}

	private retourListener() {
		const retourButton = document.querySelectorAll('.retour');
		retourButton?.forEach(temp =>
			temp.addEventListener('click', event => {
				event.preventDefault;

				Router.navigate('/');

				document
					.querySelectorAll('.blur')!
					.forEach(temp => temp.setAttribute('class', 'blur'));
				document
					.querySelectorAll('.rejouerButton')!
					.forEach(temp => temp.setAttribute('class', 'rejouerButton'));
				document
					.querySelectorAll('.retour')!
					.forEach(temp => temp.setAttribute('class', 'retour'));
			})
		);
	}

	private mortJoueur(j: Joueur) {
		this.chrono.stop();
		this.setStat(j);
		document
			.querySelectorAll('.joueurMort')
			?.forEach(elt => elt.classList.add('active'));
		document
			.querySelectorAll('.blur')!
			.forEach(temp => temp.classList.add('rejouer', 'blur'));
		document
			.querySelectorAll('.rejouerButton')!
			.forEach(temp => temp.classList.add('rejouerButton', 'displayButton'));
		document
			.querySelectorAll('.retour')!
			.forEach(temp => temp.classList.add('retour', 'displayRetour'));
	}

	private setStat(j: Joueur) {
		document
			.querySelectorAll('.timeFinal')
			.forEach(
				elt => (elt.innerHTML = `Temps en vie : ${this.chrono.getTimeFormat()}`)
			);
		document
			.querySelectorAll('.nbTuer')
			.forEach(
				elt => (elt.innerHTML = `Nombre d'ennemis tuer : ${j.nbEnnemiTuer}`)
			);
		document
			.querySelectorAll('.scoreFinal')
			.forEach(elt => (elt.innerHTML = `Score final : ${j.score}`));
	}

	private handleResize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	private handleMouseDown(e: MouseEvent) {
		this.handleShooting(e);
		this.handleDirectionMouse(e);
	}

	private handleMouseMove(e: MouseEvent) {
		if ((e.buttons & 2) !== 0) {
			this.handleDirectionMouse(e);
		}
	}

	private handleDirectionMouse(e: MouseEvent) {
		// 2 = clique droit / '&' détermine si le bit 2 est allumé
		if (e.button === 2 || (e.buttons & 2) !== 0) {
			this.coordoneeMouseToGo = this.realClickCoordonee(e);
		}
	}

	private handleShooting(e: MouseEvent) {
		const { x, y } = this.realClickCoordonee(e);
		// 0 = clique gauche
		if (e.button === 0) {
			this.socket.emit('shooting', {
				active: e.type === 'mousedown',
				x: x,
				y: y,
			});
		}
	}

	private checkMouseMovement(listJoueurs: Joueur[]) {
		if (!this.coordoneeMouseToGo) return;

		const me = listJoueurs.find(j => j.clientID === this.socket.id);
		if (!me) return;

		const dx = this.coordoneeMouseToGo.x - me.co.x;
		const dy = this.coordoneeMouseToGo.y - me.co.y;
		const distance = Math.hypot(dx, dy);

		if (distance < (me.speed || 5)) {
			this.coordoneeMouseToGo = null;
			this.vx = 0;
			this.vy = 0;
			this.socket.emit('updateInput', { vx: this.vx, vy: this.vy });
		} else {
			const newVx = dx / distance;
			const newVy = dy / distance;

			if (
				Math.abs(this.vx - newVx) > 0.05 ||
				Math.abs(this.vy - newVy) > 0.05
			) {
				this.vx = newVx;
				this.vy = newVy;
				this.socket.emit('updateInput', { vx: this.vx, vy: this.vy });
			}
		}
	}

	private handleKeyDown(e: KeyboardEvent) {
		if (this.coordoneeMouseToGo) {
			this.vx = 0;
			this.vy = 0;
			this.coordoneeMouseToGo = null;
		}
		if (this.keys[e.code]) return;

		if (this.keys[e.code] !== undefined) {
			this.keys[e.code] = true;
			this.updateDirection();
		}
	}

	private handleKeyUp(e: KeyboardEvent) {
		if (this.keys[e.code] !== undefined) {
			this.keys[e.code] = false;
			this.updateDirection();
		}
	}

	private updateDirection() {
		let vx = 0;
		let vy = 0;

		if (this.keys['ArrowUp'] || this.keys['KeyW']) vy -= 1;
		if (this.keys['ArrowDown'] || this.keys['KeyS']) vy += 1;
		if (this.keys['ArrowLeft'] || this.keys['KeyA']) vx -= 1;
		if (this.keys['ArrowRight'] || this.keys['KeyD']) vx += 1;

		if (this.vx !== vx || this.vy !== vy) {
			this.vx = vx;
			this.vy = vy;

			this.socket.emit('updateInput', {
				vx: this.vx,
				vy: this.vy,
			});
		}
	}

	destroy() {
		super.destroy();

		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		window.removeEventListener('resize', this.handleResize);
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
	}

	private render(g: Game) {
		const me = g.joueurs.find(j => j.clientID === this.socket.id);
		if (me) {
			this.camera.x = me.co.x - this.canvas.width / 2;
			this.camera.y = me.co.y - this.canvas.height / 2;
		}

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.renderWorldBorders();

		if (g.bulletsJoueur) this.renderBulletsJoueur(g.bulletsJoueur);
		if (g.bulletsEnnemy) this.renderBulletsEnnemy(g.bulletsEnnemy);
		if (g.joueurs) this.renderJoueur(g.joueurs);
		if (g.ennemies) this.renderEnnemies(g.ennemies);
		if (g.bulletsHit) this.renderBulletsHit(g.bulletsHit);
		if (g.bonus) this.renderBonus(g.bonus);

		this.renderHud(g.joueurs);
	}

	private renderBonus(bonus: Bonus[]) {
		for (const b of bonus) {
			this.dessinerEntite(b);
		}
	}

	private renderHud(listJoueurs: Joueur[]) {
		const currentClient = listJoueurs.find(j => j.clientID === this.socket.id);
		if (currentClient) {
			this.hudElement.querySelector('.info-pseudo')!.innerHTML =
				currentClient.pseudo!;
			this.hudElement.querySelector('.vies')!.innerHTML = '❤️'.repeat(
				currentClient.vie!
			);
			this.hudElement.querySelector('.info-score')!.innerHTML =
				'' + currentClient.score;
			this.hudElement.querySelector('.timer')!.innerHTML =
				this.chrono.getTimeFormat();
		}
	}

	private renderJoueur(listJoueurs: Joueur[]) {
		for (const j of listJoueurs) {
			this.dessinerEntite(j);
		}
	}

	private renderBulletsJoueur(listBullets: Bullet[]) {
		for (const b of listBullets) {
			this.dessinerEntite(b);
		}
	}
	private renderBulletsEnnemy(listBullets: Bullet[]) {
		for (const b of listBullets) {
			this.dessinerEntite(b);
		}
	}

	private renderBulletsHit(listBulletsHit: Bullet[]) {
		for (const bh of listBulletsHit) {
			this.dessinerEntite(bh);
		}
	}

	private renderEnnemies(listEnnemies: Ennemy[]) {
		for (const e of listEnnemies) {
			this.dessinerEntite(e);
		}
	}

	private dessinerEntite(e: Entities) {
		const screenX = e.co.x - this.camera.x;
		const screenY = e.co.y - this.camera.y;

		const img = Assets.getImage(e.spriteId);
		if (img)
			this.context.drawImage(
				img,
				screenX - e.width / 2,
				screenY - e.height / 2,
				e.width,
				e.height
			);
	}

	private realClickCoordonee(e: MouseEvent): Coordonee {
		return {
			x: e.clientX + this.camera.x,
			y: e.clientY + this.camera.y,
		};
	}

	private renderWorldBorders() {
		const startX = 0 - this.camera.x;
		const startY = 0 - this.camera.y;

		this.context.save();

		this.context.strokeStyle = 'red';
		this.context.lineWidth = 10;

		const demiEpaisseur = this.context.lineWidth / 2;

		this.context.strokeRect(
			startX - demiEpaisseur,
			startY - demiEpaisseur,
			this.worldWidth + this.context.lineWidth,
			this.worldHeight + this.context.lineWidth
		);

		this.context.restore();
	}
}
