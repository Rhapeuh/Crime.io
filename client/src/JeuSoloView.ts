import View from './View';
import Router from './Router';
import { Socket } from 'socket.io-client';
import type { Coordonee } from '../../common/types.ts';
import Assets from './asset';
import type Game from '../../common/Game.ts';
import type Joueur from '../../common/Joueur';

export default class JeuSoloView extends View {
	private context: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;
	private vx: number = 0;
	private vy: number = 0;
	private socket;

	constructor(element: HTMLElement, socket: Socket, pseudo: string) {
		super(element);
		this.socket = socket;
		socket.emit('rejoindreSolo', pseudo);

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleRender = this.handleRender.bind(this);

		this.canvas = this.element.querySelector('.gameCanvasSolo')!;
		this.context = this.canvas.getContext('2d')!;

		this.canvas.width = 1920;
		this.canvas.height = 1080;

		this.socket.on('renderSolo', this.handleRender);

		this.initEvents();

		Router.setMenuElement(element);
	}

	private handleRender(g: Game) {
		this.render(g);
	}

	private initEvents() {
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
		window.addEventListener('mousedown', this.handleShooting);
		window.addEventListener('mouseup', this.handleShooting);
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

		this.socket.off('render', this.handleRender);
	}

	render(g: Game) {
		this.context.clearRect(0, 0, 1920, 1080);
		if (g.joueurs) this.renderJoueur(g.joueurs);
	}

	renderJoueur(listJoueurs: Joueur[]) {
		for (const j of listJoueurs) {
			const coord = this.realCordonee(j.coJoueur);
			this.context.drawImage(Assets.persoTemp1, coord.x, coord.y, 50, 50);
		}
	}

	private handleAbilities(e: KeyboardEvent) {
		if (e.key === ' ') {
			this.socket.emit('playerParry');
		}
	}

	private handleShooting(e: MouseEvent) {
		if (e.type === 'mouseup') {
			this.socket.emit('shooting', false);
		} else {
			this.socket.emit('shooting', true);
		}
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

	private realCordonee(c: Coordonee): Coordonee {
		const ratioX = c.x / 1920;
		const ratioY = c.y / 1080;

		const realX = ratioX * this.canvas.width;
		const realY = ratioY * this.canvas.height;

		return { x: realX, y: realY };
	}
}
