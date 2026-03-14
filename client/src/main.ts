import AcceuilView from './AcceuilView';
import CreditView from './CreditView';
import Router from './Router.ts';
import JeuSoloView from './JeuSoloView.ts';
import { io } from 'socket.io-client';

const pseudoInput = document.querySelector('.pseudo-input') as HTMLInputElement;

const socket = io(window.location.hostname + `:9876`);

socket.on(
	'premiereConnexion',
	(pseudo: string) => (pseudoInput.value = pseudo)
);

const routes = [
	{ path: '/', getView: () => new AcceuilView(document.querySelector('.viewContent > .accueil')!) },
	{ path: '/credit', getView: () => new CreditView(document.querySelector('.viewContent > .credit')!) },
	{ path: '/jeuSolo', getView: () => new JeuSoloView(document.querySelector('.viewContent > .jeuSolo')!, socket, pseudoInput.value) },
];

Router.routes = routes;

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);