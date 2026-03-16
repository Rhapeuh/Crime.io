import Entities from './Entities.ts';
import type { Coordonee } from './types.ts';

export default class Ennemy extends Entities {
	constructor(co: Coordonee) {
		super(co, 0, 0, 3, 50, 50, undefined, 1);
	}
}
