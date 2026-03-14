import AcceuilView from './AcceuilView';
import CreditView from './CreditView';
import Router from './Router';
import JeuSoloView from './JeuSoloView';
import { io } from 'socket.io-client';
import JeuMultiView from './JeuMultiView';
import Assets from './asset';

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
	{ path: '/jeuMulti', getView: () => new JeuMultiView(document.querySelector('.viewContent > .jeuMulti')!, socket, pseudoInput.value) },
];

Router.routes = routes;

async function lancerJeu() {
    try {
        await Assets.loadAll();

        Router.navigate(window.location.pathname, true);
        
        window.onpopstate = () => Router.navigate(document.location.pathname, true);
    } catch (erreur) {
        console.error("Erreur lors du chargement des images :", erreur);
    }
}

lancerJeu();