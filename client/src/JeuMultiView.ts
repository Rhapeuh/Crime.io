import View from './View';
import Router from './Router';
import { Socket } from 'socket.io-client';
import type { Coordonee } from '../../common/types.ts';
import Assets from './asset';
import type Game from '../../common/Game';
import type Joueur from '../../common/Joueur';

export default class JeuMultiView extends View {
    private monPseudo: string;
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private vx: number = 0;
    private vy: number = 0;
    private socket;

    constructor(element: HTMLElement, socket: Socket, pseudo: string) {
        super(element);
        this.monPseudo = pseudo
        this.socket = socket;
        socket.emit('rejoindreMulti', pseudo);

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleRender = this.handleRender.bind(this);

        this.canvas = this.element.querySelector('.gameCanvasMulti')!;
        this.context = this.canvas.getContext('2d')!;

        this.canvas.width = 1920;
        this.canvas.height = 1080;

        this.socket.on('renderMulti', this.handleRender);

        this.initEvents();

        Router.setMenuElement(element);
    }

    private handleRender(game: Game) {
        this.render(game)
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

        this.socket.off('render', this.handleRender);
        
        this.socket.emit('quitterMulti');
    }

    render(game: Game) {
        this.context.clearRect(0, 0, 1920, 1080);
        this.renderJoueur(game.joueurs)
    }

    private renderJoueur(listJoueur: Joueur[]){
        for(const j of listJoueur){
            const currentClient = j.pseudo === this.monPseudo;
            const coord = this.realCordonee(j.coJoueur)
            currentClient ? this.context.drawImage(Assets.persoTemp1, coord.x, coord.y, 50, 50) : this.context.drawImage(Assets.persoTemp2, coord.x, coord.y, 50, 50);
        }
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