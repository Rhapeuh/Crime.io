import { Socket } from 'socket.io-client';
import JeuView from './JeuView';
import Router from './Router';

export default class JeuSoloView extends JeuView {
	constructor(element: HTMLElement, socket: Socket, pseudo: string) {
		super(element, socket);
		if (pseudo === '') {
			this.element.classList.remove('active');

			setTimeout(() => {
				Router.navigate('/');
			}, 0);

			return;
		}
		this.socket.emit('rejoindreSolo');
		this.socket.on('renderSolo', this.handleRender);
	}

	destroy() {
		super.destroy();

		this.socket.off('renderSolo', this.handleRender);
		this.socket.emit('quitterSolo');
	}
}
