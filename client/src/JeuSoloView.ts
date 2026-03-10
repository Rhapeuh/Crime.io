import View from './View';
import Router from './Router';
import { Socket } from 'socket.io-client';
import type { Coordonee } from '../../server/types';

export default class JeuSoloView extends View {
	private context: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;
	private vx: number = 0;
	private vy: number = 0;
	private image: HTMLImageElement;
	private socket;

	constructor(element: HTMLElement, socket: Socket) {
		super(element);
		this.socket = socket;

		this.canvas = this.element.querySelector('canvas')!;
		this.context = this.canvas.getContext('2d')!;
		this.image = new Image();

		socket.on('initImage', (c: Coordonee) => {
			this.afficherImage(c);
		});

		this.resampleCanvas();
		this.initEvents();

		socket.on('render', this.render);

		Router.setMenuElement(element);
	}

	private initEvents() {
		window.addEventListener('keydown', e => {
			this.selectDirection(e);
			this.socket.emit('updateInput', { vx: this.vx, vy: this.vy });
		});
		window.addEventListener('keyup', e => {
			this.arretDirection(e);
			this.socket.emit('updateInput', { vx: this.vx, vy: this.vy });
		});
	}

	private afficherImage(c: Coordonee) {
		this.image.src = '/images/persoTemp.jpg';
		this.image.onload = () => {
			requestAnimationFrame(() => {
				this.render(c);
			});
		};
	}

	render = (c: Coordonee) => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.drawImage(this.image, c.x, c.y);
	};

	private resampleCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.socket.emit('initTailleEcran', {
			width: this.canvas.width,
			height: this.canvas.height,
		});
	}

	private selectDirection(e: KeyboardEvent) {
		if (e.key === 'd') this.vx = 1;
		if (e.key === 'q') this.vx = -1;
		if (e.key === 'z') this.vy = -1;
		if (e.key === 's') this.vy = 1;
	}

	private arretDirection(e: KeyboardEvent) {
		if (['d', 'q'].includes(e.key)) this.vx = 0;
		if (['z', 's'].includes(e.key)) this.vy = 0;
	}
}
