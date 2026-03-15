import Entities from './Entities';
import type { Coordonee } from './types';

export default class Ennemy extends Entities {
	constructor(co: Coordonee) {
		super(co, 0, 0, 5, undefined, 1);
	}
}
