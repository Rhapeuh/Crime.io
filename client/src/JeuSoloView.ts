import { Socket } from 'socket.io-client';
import JeuView from './JeuView';

export default class JeuSoloView extends JeuView {

	constructor(element: HTMLElement, socket: Socket, pseudo: string) {
		super(element, socket, pseudo, element.querySelector('.gameCanvasSolo')!);
		socket.emit('rejoindreSolo', pseudo);
		this.socket.on('renderSolo', this.handleRender);
	}

	destroy() {
		super.destroy();

		this.socket.off('renderSolo', this.handleRender);
		this.socket.emit('quitterSolo');
	}
}
