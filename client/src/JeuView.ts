import type { Socket } from 'socket.io-client';
import View from './View';
import Router from './Router';
import type Game from '../../common/Game';
import type Joueur from '../../common/Joueur';
import Assets from './asset';
import type Bullet from '../../common/Bullet';
import type { Coordonee } from '../../common/types';
import type Ennemy from '../../common/Ennemy';

export default class JeuView extends View {
	monPseudo: string;
	context: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	hudElement: HTMLDivElement;
	vx: number = 0;
	vy: number = 0;
	socket;
	coordoneeMouseToGo: Coordonee | null = null;

	constructor(
		element: HTMLElement,
		socket: Socket,
		pseudo: string,
		canvas: HTMLCanvasElement
	) {
		super(element);
		this.monPseudo = pseudo;
		this.socket = socket;

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleRender = this.handleRender.bind(this);
		this.handleMouseDown = this.handleMouseDown.bind(this);
		this.handleMouseUp = this.handleMouseUp.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleShooting = this.handleShooting.bind(this);

		this.canvas = canvas;
		this.context = this.canvas.getContext('2d')!;

		this.canvas.width = 1920;
		this.canvas.height = 1080;

		this.hudElement = this.element.querySelector('.hud')!;

		this.initEvents();

		Router.setMenuElement(element);
	}

	handleRender(g: Game) {
		this.render(g);
		this.checkMouseMovement(g.joueurs);
	}

	private initEvents() {
		window.addEventListener('contextmenu', e => e.preventDefault());
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
		this.canvas.addEventListener('mousedown', this.handleMouseDown);
		this.canvas.addEventListener('mouseup', this.handleMouseUp);
		this.canvas.addEventListener('mousemove', this.handleMouseMove);
	}

	private handleMouseUp(e: MouseEvent) {
		this.handleShooting(e);
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
				pourcentX: x / this.canvas.width,
				pourcentY: y / this.canvas.height,
			});
		}
	}

	private checkMouseMovement(listJoueurs: Joueur[]) {
		if (!this.coordoneeMouseToGo) return;

		const me = listJoueurs.find(j => j.pseudo === this.monPseudo);
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
		this.selectDirection(e);
		this.handleAbilities(e);
		this.socket.emit('updateInput', {
			vx: this.vx,
			vy: this.vy,
		});
	}

	private handleKeyUp(e: KeyboardEvent) {
		this.arretDirection(e);
		this.coordoneeMouseToGo = null;
		this.socket.emit('updateInput', {
			vx: this.vx,
			vy: this.vy,
		});
	}

	destroy() {
		super.destroy();

		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		this.canvas.removeEventListener('mousedown', this.handleMouseDown);
		this.canvas.removeEventListener('mouseup', this.handleMouseUp);
		this.canvas.removeEventListener('mousemove', this.handleMouseMove);
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	private selectDirection(e: KeyboardEvent) {
		if (e.key === 'd' || e.key === 'ArrowRight') this.vx = 1;
		if (e.key === 'q' || e.key === 'ArrowLeft') this.vx = -1;
		if (e.key === 'z' || e.key === 'ArrowUp') this.vy = -1;
		if (e.key === 's' || e.key === 'ArrowDown') this.vy = 1;
	}

	private arretDirection(e: KeyboardEvent) {
		if (
			e.key === 'd' ||
			e.key === 'q' ||
			e.key === 'ArrowRight' ||
			e.key === 'ArrowLeft'
		)
			this.vx = 0;
		if (
			e.key === 'z' ||
			e.key === 's' ||
			e.key === 'ArrowUp' ||
			e.key === 'ArrowDown'
		)
			this.vy = 0;
	}

	private handleAbilities(e: KeyboardEvent) {
		if (e.key === ' ') {
			this.socket.emit('playerParry');
		}
	}

	private render(g: Game) {
		this.context.clearRect(0, 0, 1920, 1080);
		if (g.bullets) this.renderBullets(g.bullets);
		if (g.joueurs) this.renderJoueur(g.joueurs);
		if (g.ennemies) this.renderEnnemies(g.ennemies);
		this.renderHud(g.joueurs);
	}

	private renderHud(listJoueurs: Joueur[]) {
		const currentClient = listJoueurs.find(j => j.pseudo === this.monPseudo);
		if (currentClient) {
			this.hudElement.querySelector('.info-pseudo')!.innerHTML =
				currentClient.pseudo!;
			this.hudElement.querySelector('.vies')!.innerHTML = '❤️'.repeat(
				currentClient.vie!
			);
			this.hudElement.querySelector('.info-score')!.innerHTML = 'score';
		}
	}

	private renderJoueur(listJoueurs: Joueur[]) {
		for (const j of listJoueurs) {
			const currentClient = j.pseudo === this.monPseudo;
			const coord = this.realCordonee(j.co);
			currentClient
				? this.context.drawImage(
						Assets.persoTemp1,
						coord.x - j.width / 2,
						coord.y - j.height / 2,
						j.width,
						j.height
					)
				: this.context.drawImage(
						Assets.persoTemp2,
						coord.x - j.width / 2,
						coord.y - j.height / 2,
						j.width,
						j.height
					);
		}
	}

	private renderBullets(listBullets: Bullet[]) {
		for (const b of listBullets) {
			const coord = this.realCordonee(b.co);
			this.context.drawImage(
				Assets.ennemyTemp,
				coord.x - b.width / 2,
				coord.y - b.height / 2,
				b.width,
				b.height
			);
		}
	}

	private renderEnnemies(listEnnemies: Ennemy[]) {
		for (const e of listEnnemies) {
			const coord = this.realCordonee(e.co);
			this.context.drawImage(
				Assets.ennemyTemp,
				coord.x - e.width / 2,
				coord.y - e.height / 2,
				e.width,
				e.height
			);
		}
	}

	private realCordonee(c: Coordonee): Coordonee {
		const ratioX = c.x / 1920;
		const ratioY = c.y / 1080;

		const realX = ratioX * this.canvas.width;
		const realY = ratioY * this.canvas.height;

		return { x: realX, y: realY };
	}

	private realClickCoordonee(e: MouseEvent): Coordonee {
		const rect = this.canvas.getBoundingClientRect();

		// Calculer le ratio auquel le canva a été redimenssioné
		const scale = Math.min(
			rect.width / this.canvas.width,
			rect.height / this.canvas.height
		);

		// Dimensions rééles du client grâce au ratio
		const visualWidth = this.canvas.width * scale;
		const visualHeight = this.canvas.height * scale;

		// Canva centré dcp on fait l'offset du vide sur le côté puis /2 pour le centre
		const offsetX = (rect.width - visualWidth) / 2;
		const offsetY = (rect.height - visualHeight) / 2;

		// Coordonnées exactes de la souris projetées sur le canvas interne (1920x1080)
		const canvasX = (e.clientX - rect.left - offsetX) / scale;
		const canvasY = (e.clientY - rect.top - offsetY) / scale;
		return { x: canvasX, y: canvasY };
	}
}
