import View from './View';
import Router from './Router';
import { Socket } from 'socket.io-client';
import type { Coordonee } from '../../common/types.ts';

export default class JeuSoloView extends View {
	private context: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;
	private vx: number = 0;
	private vy: number = 0;
	private image: HTMLImageElement;
	private socket;

	constructor(element: HTMLElement, socket: Socket, pseudo: string) {
		super(element);
		this.socket = socket;
		socket.emit('createSoloView', pseudo);

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleRender = this.handleRender.bind(this);
		this.handleInitImage = this.handleInitImage.bind(this);

		this.canvas = this.element.querySelector('canvas')!;
		this.context = this.canvas.getContext('2d')!;
		this.image = new Image();

		this.canvas.width = 1920;
		this.canvas.height = 1080;

		this.socket.on('initImage', this.handleInitImage);
		this.socket.on('render', this.handleRender);

		this.resampleCanvas();
		this.initEvents();

		Router.setMenuElement(element);
	}

	private handleInitImage(c: Coordonee) {
		this.afficherImage(this.realCordonee(c));
	}

	private handleRender(c: Coordonee) {
		this.render(this.realCordonee(c));
	}

	private initEvents() {
		window.addEventListener('keydown', this.handleKeyDown);
		window.addEventListener('keyup', this.handleKeyUp);
	}

	private handleKeyDown(e: KeyboardEvent) {
		this.selectDirection(e);
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

		this.socket.off('initImage', this.handleInitImage);
		this.socket.off('render', this.handleRender);
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
