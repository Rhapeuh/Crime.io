import { Socket } from 'socket.io-client';
import JeuView from './JeuView';
import Router from './Router';

export default class JeuMultiView extends JeuView {
	constructor(element: HTMLElement, socket: Socket, pseudo: string) {
		super(element, socket);
		if (pseudo === '') {
			this.element.classList.remove('active');

			setTimeout(() => {
				Router.navigate('/');
			}, 0);

			return;
		}
		socket.emit('rejoindreMulti', pseudo);
		this.socket.on('renderMulti', this.handleRender);
	}

	destroy() {
		this.socket.off('renderMulti', this.handleRender);

		this.socket.emit('quitterMulti');

		super.destroy();
	}
}
