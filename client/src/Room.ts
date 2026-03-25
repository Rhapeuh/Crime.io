import type { Socket } from 'socket.io-client';
import View from './View';
import Router from './Router';

export let roomName = '';

export default class Room extends View {
	constructor(element: HTMLElement, socket: Socket) {
		super(element);
		socket.emit('getAllRoom');
		Router.setMenuElement(this.element);
		socket.on('allRoom', allRoom => {
			this.afficherTableau(allRoom);
			this.element.querySelectorAll('.nameRoom').forEach(a => {
				this.handleClick(a);
			});
		});
	}

	private afficherTableau(
		allRoom: Array<{ nom: string; joueursActuels: number; joueursMax: number }>
	) {
		const tbody = this.element.querySelector('.corpsTableauRooms');
		if (tbody) {
			tbody.innerHTML = '';
			if (allRoom.length === 0) {
				tbody.innerHTML =
					'<tr><td colspan="2">Aucune partie en cours.</td></tr>';
				return;
			}

			allRoom.forEach(room => {
				tbody.innerHTML += `
                <tr>
					<td>
						<div class="containerRoom">
							<span>${room.nom}</span>
							<div>
								<span>${room.joueursActuels} / ${room.joueursMax}</span>
								<a id="${room.nom}" class="nameRoom" href="/jeuMulti">REJOINDRE</a>
							</div>
						</div>
					</td>
                </tr>
                `;
			});
		}
	}

	private handleClick(a: Element) {
		a.addEventListener('click', e => {
			e.preventDefault();
			roomName = a.id;
			Router.navigate('/jeuMulti');
		});
	}
}
