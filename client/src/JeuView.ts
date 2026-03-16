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
	vx: number = 0;
	vy: number = 0;
	socket;

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
		this.handleShooting = this.handleShooting.bind(this);

		this.canvas = canvas;
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
		if (e.type === 'mousedown') {
			const rectangle = this.canvas.getBoundingClientRect();

			const mouseX = e.clientX - rectangle.left;
			const mouseY = e.clientY - rectangle.top;

			const pourcentX = mouseX / window.innerWidth;
			const pourcentY = mouseY / window.innerHeight;

			this.socket.emit('shooting', {
				active: true,
				pourcentX: pourcentX,
				pourcentY: pourcentY,
			});
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

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
		if (g.ennemies) this.renderEnnemies(g.ennemies);
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
}
