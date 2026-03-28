import type { Socket } from 'socket.io-client';
import { currentCharacter } from './main';
import JeuView from './JeuView';
import Router from './Router';

export default class JeuMultiView extends JeuView {

	constructor(
		element: HTMLElement,
		socket: Socket,
		pseudo: string,
		roomName: string = ''
	) {
		super(element, socket);
		socket.emit('rejoindreMulti', pseudo, roomName, currentCharacter);
		socket.on('plusDePlace', () => Router.navigate('/room'));
		if (pseudo === '') {
			this.element.classList.remove('active');

			setTimeout(() => {
				Router.navigate('/');
			}, 0);

			socket.emit('quitterMulti');
			return;
		}
		this.socket.on('renderMulti', this.handleRender);
	}

	destroy() {
		this.socket.off('renderMulti', this.handleRender);

		this.socket.emit('quitterMulti');

		super.destroy();
	}
}
