import AcceuilView from './AcceuilView';
import CreditView from './CreditView';
import Router from './Router.ts';
import JeuView from './JeuView';
import { io } from 'socket.io-client';

console.log('tout est ok');

const socket = io(window.location.hostname + `:9876`);

socket.on('premiereConnexion', message => {
	console.log(message);
});

const acceuilView = new AcceuilView(
	document.querySelector('.viewContent > .accueil')!
);
const creditView = new CreditView(
	document.querySelector('.viewContent > .credit')!
);

const jeuView = new JeuView(document.querySelector('.viewContent > .jeu')!);

const routes = [
	{ path: '/', view: acceuilView },
	{ path: '/credit', view: creditView },
	{ path: '/jeu', view: jeuView },
];

Router.routes = routes;

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);
