import { Socket } from 'socket.io-client';
import JeuView from './JeuView';
import Router from './Router';

export default class JeuSoloView extends JeuView {
	constructor(element: HTMLElement, socket: Socket, pseudo: string) {
		super(element, socket);
		if (pseudo === '') Router.navigate('/');
		socket.emit('rejoindreSolo', pseudo);
		this.socket.on('renderSolo', this.handleRender);
	}

	destroy() {
		super.destroy();

		this.socket.off('renderSolo', this.handleRender);
		this.socket.emit('quitterSolo');
	}
}
