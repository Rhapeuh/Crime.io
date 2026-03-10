import View from './View';
import Router from './Router';

export default class CreditView extends View {
	constructor(element: HTMLElement) {
		super(element);
		Router.setMenuElement(element);
	}
}
