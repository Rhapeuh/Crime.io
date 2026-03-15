import type { Socket } from 'socket.io-client';
import View from './View';
import Router from './Router';
import type Game from '../../common/Game';
import type Joueur from '../../common/Joueur';
import Assets from './asset';
import type Bullet from '../../common/Bullet';
import type { Coordonee } from '../../common/types';

export default class JeuView extends View {
	monPseudo: string;
	context: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	vx: number = 0;
	vy: number = 0;
	socket;

	constructor(element: HTMLElement, socket: Socket, pseudo: string) {
		super(element);
		this.monPseudo = pseudo;
		this.socket = socket;
		socket.emit('rejoindreSolo', pseudo);

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleRender = this.handleRender.bind(this);
		this.handleShooting = this.handleShooting.bind(this);

		this.canvas = this.element.querySelector('.gameCanvasSolo')!;
		this.context = this.canvas.getContext('2d')!;

		this.canvas.width = 1920;
		this.canvas.height = 1080;

		this.initEvents();

		Router.setMenuElement(element);
	}

	handleRender(g: Game) {
		this.render(g);
	}

	private initEvents() {
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
		window.addEventListener('mousedown', this.handleShooting);
		window.addEventListener('mouseup', this.handleShooting);
	}

	private handleShooting(e: MouseEvent) {
		if (e.type === 'mouseup') {
			this.socket.emit('shooting', false);
		} else {
			this.socket.emit('shooting', true);
		}
	}

	private handleKeyDown(e: KeyboardEvent) {
		this.selectDirection(e);
		this.handleAbilities(e);
		this.socket.emit('updateInput', { vx: this.vx, vy: this.vy });
	}

	private handleKeyUp(e: KeyboardEvent) {
		this.arretDirection(e);
		this.socket.emit('updateInput', { vx: this.vx, vy: this.vy });
	}

	destroy() {
		super.destroy();

		window.removeEventListener('keydown', this.handleKeyDown);
		window.removeEventListener('keyup', this.handleKeyUp);
		window.removeEventListener('mousedown', this.handleShooting);
		window.removeEventListener('mouseup', this.handleShooting);
	}

	private selectDirection(e: KeyboardEvent) {
		if (e.key === 'd') this.vx = 1;
		if (e.key === 'q') this.vx = -1;
		if (e.key === 'z') this.vy = -1;
		if (e.key === 's') this.vy = 1;
	}

	private arretDirection(e: KeyboardEvent) {
		if (e.key === 'd' || e.key === 'q') this.vx = 0;
		if (e.key === 'z' || e.key === 's') this.vy = 0;
	}

	private handleAbilities(e: KeyboardEvent) {
		if (e.key === ' ') {
			this.socket.emit('playerParry');
		}
	}

	private render(g: Game) {
		this.context.clearRect(0, 0, 1920, 1080);
		if (g.joueurs) this.renderJoueur(g.joueurs);
		if (g.bullets) this.renderBullets(g.bullets);
	}

	private renderJoueur(listJoueurs: Joueur[]) {
		for (const j of listJoueurs) {
			const coord = this.realCordonee(j.coJoueur);
			this.context.drawImage(Assets.persoTemp1, coord.x, coord.y, 50, 50);
		}
	}

	private renderBullets(bullets: Bullet[]) {
		for (const b of bullets) {
			const coord = this.realCordonee({ x: b.x, y: b.y });
			this.context.drawImage(
				Assets.ennemyTemp,
				coord.x,
				coord.y,
				b.width,
				b.height
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
}
