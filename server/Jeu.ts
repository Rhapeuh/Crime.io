import type { Joueur } from './types';

export default class Jeu {
	private WORLD_WIDTH = 1920;
	private WORLD_HEIGHT = 1080;
	private PLAYER_SIZE = 50;
	private max_speed: number = 15;

	update(j: Joueur) {
		this.updateSpeed(j);
		j.setX(j.getSpeed() + j.getVX() * j.getSpeed());
		j.setY(j.getSpeed() + j.getVY() * j.getSpeed());

		// j.x += j.vx * j.speed;
		// j.y += j.vy * j.speed;

		if (j.getX() < 0) j.setX(0);
		if (j.getY() < 0) j.setY(0);
		if (j.getX() > this.WORLD_WIDTH - this.PLAYER_SIZE)
			j.setX(this.WORLD_WIDTH - this.PLAYER_SIZE);
		if (j.getY() > this.WORLD_HEIGHT - this.PLAYER_SIZE)
			j.setY(this.WORLD_HEIGHT - this.PLAYER_SIZE);

		// if (j.x < 0) j.x = 0;
		// if (j.y < 0) j.y = 0;
		// if (j.x > this.WORLD_WIDTH - this.PLAYER_SIZE)
		// 	j.x = this.WORLD_WIDTH - this.PLAYER_SIZE;
		// if (j.y > this.WORLD_HEIGHT - this.PLAYER_SIZE)
		// 	j.y = this.WORLD_HEIGHT - this.PLAYER_SIZE;
	}

	private updateSpeed(j: Joueur) {
		if (this.seDeplace(j) && j.speed < this.max_speed) {
            j.speed += 0.2;
        }if(!this.seDeplace(j))j.speed = 1;
	}

	private seDeplace(j: Joueur) {
		return j.getVX() != 0 || j.getVY() != 0;
	}
}
