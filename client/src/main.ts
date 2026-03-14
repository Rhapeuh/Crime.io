import AcceuilView from './AcceuilView';
import CreditView from './CreditView';
import Router from './Router.ts';
import JeuSoloView from './JeuSoloView.ts';
import { io } from 'socket.io-client';

const socket = io(window.location.hostname + `:9876`);

const routes = [
	{ path: '/', getView: () => new AcceuilView(document.querySelector('.viewContent > .accueil')!) },
	{ path: '/credit', getView: () => new CreditView(document.querySelector('.viewContent > .credit')!) },
	{ path: '/jeuSolo', getView: () => new JeuSoloView(document.querySelector('.viewContent > .jeuSolo')!, socket) },
];

Router.routes = routes;

Router.navigate(window.location.pathname, true);

window.onpopstate = () => Router.navigate(document.location.pathname, true);
