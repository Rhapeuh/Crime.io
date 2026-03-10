import View from './View';
import Router from './Router';

export default class AcceuilView extends View {
	constructor(element: HTMLElement) {
		super(element);
		Router.setMenuElement(element);
	}
}
