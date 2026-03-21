import { Socket } from 'socket.io-client';
import JeuView from './JeuView';

export default class JeuMultiView extends JeuView {
	constructor(element: HTMLElement, socket: Socket, pseudo: string) {
		super(element, socket);
		socket.emit('rejoindreMulti', pseudo);
		this.socket.on('renderMulti', this.handleRender);
	}

	destroy() {
		this.socket.off('renderMulti', this.handleRender);

		this.socket.emit('quitterMulti');

		super.destroy();
	}
}
