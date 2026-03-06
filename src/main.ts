import AcceuilView from "./AcceuilView";
import CreditView from "./CreditView";
import Router from './Router.js';

console.log('tout est ok');

const acceuilView = new AcceuilView(
	document.querySelector('.viewContent > .accueil')!
);
const creditView = new CreditView(
	document.querySelector('.viewContent > .credit')!
);

const routes = [
	{ path: '/', view: acceuilView, title: 'Accueil' },
	{ path: '/credit', view: creditView, title: 'Crédits' },
];

Router.routes = routes

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);