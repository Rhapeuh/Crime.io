export interface Coordonee {
	x: number;
	y: number;
}

export interface scores {
	pseudo: string;
	score: number;
	date: string;
}

export interface bonusEnum {
	effect:
		| 'VIES_ADD'
		| 'VIES_REMOVE'
		| 'SPEED_ADD'
		| 'SPEED_REMOVE'
		| 'BULLET_WIDTH_ADD'
		| 'BULLET_WIDTH_REMOVE';
	value: number;
}
