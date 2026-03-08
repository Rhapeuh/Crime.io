import AcceuilView from "./AcceuilView";
import CreditView from "./CreditView";
import Router from './Router.ts';
import JeuView from "./JeuView";

console.log('tout est ok');

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

Router.routes = routes

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);