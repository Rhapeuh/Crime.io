import AcceuilView from './AcceuilView';
import CreditView from './CreditView';
import Router from './Router.ts';
import JeuSoloView from './JeuSoloView.ts';
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

const jeuSoloView = new JeuSoloView(document.querySelector('.viewContent > .jeuSolo')!, socket);

const routes = [
	{ path: '/', view: acceuilView },
	{ path: '/credit', view: creditView },
	{ path: '/jeuSolo', view: jeuSoloView },
];

Router.routes = routes;

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);
