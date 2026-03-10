import View from './View';
import Router from './Router';
import perso from '/images/persoTemp.jpg'

export default class JeuView extends View {
	private context: CanvasRenderingContext2D;
	private canvas: HTMLCanvasElement;
	private x: number = 50;
	private y: number = 50;
	private vx: number = 0;
	private vy: number = 0;
	private speed: number = 2;
	private image: HTMLImageElement;

	constructor(element: HTMLElement) {
		super(element);

		this.canvas = this.element.querySelector('canvas')!;
		this.context = this.canvas.getContext('2d')!;
		this.image = new Image();

		this.resampleCanvas();
		this.initEvents();
		this.afficherImage();

		setInterval(() => this.moveMonster(), 100 / 60);

		Router.setMenuElement(element);
	}

	private initEvents() {
		window.addEventListener('keydown', e => this.selectDirection(e));
		window.addEventListener('keyup', e => this.arretDirection(e));
	}

	private afficherImage() {
		this.image.src = perso;
		this.image.onload = () => {
			requestAnimationFrame(this.render);
		};
	}

	render = () => {
		this.context.fillStyle = 'red';
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.context.drawImage(this.image, this.x, this.y);
		requestAnimationFrame(this.render);
	};

	private moveMonster() {
		this.x += this.vx * this.speed;
		this.y += this.vy * this.speed;

		if (this.x < 0) this.x = 0;
		if (this.y < 0) this.y = 0;
		if (this.x + this.image.width > this.canvas.width)
			this.x = this.canvas.width - this.image.width;
		if (this.y + this.image.height > this.canvas.height)
			this.y = this.canvas.height - this.image.height;
	}

	private resampleCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
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
