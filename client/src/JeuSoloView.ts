import View from './View';
import Router from './Router';
import { Socket } from 'socket.io-client';
import type { Coordonee } from '../../server/types.ts';

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

		this.canvas.width = 1920;
		this.canvas.height = 1080;

		socket.on('initImage', (c: Coordonee) => {
			this.afficherImage(this.realCordonee(c));
		});

		this.resampleCanvas();
		this.initEvents();

		socket.on('render', (c: Coordonee) => {
			this.render(this.realCordonee(c));
		});

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

	render(c: Coordonee) {
		this.context.clearRect(0, 0, 1920, 1080);

		this.context.drawImage(this.image, c.x, c.y, 50, 50);
	}
	private resampleCanvas() {
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
		if (e.key === 'd' || e.key === 'q') this.vx = 0;
		if (e.key === 'z' || e.key === 's') this.vy = 0;
	}

	private realCordonee(c: Coordonee): Coordonee {
		const ratioX = c.x / 1920;
		const ratioY = c.y / 1080;

		const realX = ratioX * this.canvas.width;
		const realY = ratioY * this.canvas.height;

		return { x: realX, y: realY };
	}
}
