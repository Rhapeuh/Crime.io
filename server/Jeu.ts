import type { Ennemy } from '../common/Ennemy';
import Joueur  from '../common/Joueur.ts';

export default class Jeu {
	private WORLD_WIDTH = 1920;
	private WORLD_HEIGHT = 1080;
	private PLAYER_SIZE = 50;
	private max_speed: number = 15;

	update(j: Joueur) {
		this.updateSpeed(j);
		j.setX(j.getX() + j.getVX() * j.getSpeed());
		j.setY(j.getY() + j.getVY() * j.getSpeed());

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

	updateEnnemy(e: Ennemy, j: Joueur) {
		this.updateSpeed(e);

		if (Math.abs(e.getX() - j.getX()) > 300){
			if (e.getX() > j.getX()){
				e.setX(e.getX() + (e.speed * -1));
			}else if (e.getX() < j.getX()){
				e.setX(e.getX() + (e.speed * 1));
			}
		}

		if (Math.abs(e.getY() - j.getY()) > 300){
			if (e.getY() > j.getY()){
				e.setY(e.getY() + (e.speed * -1));
			}else if (e.getY() < j.getY()){
				e.setY(e.getY() + (e.speed * 1));
			}
		}

		// j.x += j.vx * j.speed;
		// j.y += j.vy * j.speed;

		if (e.getX() < 0) e.setX(0);
		if (e.getY() < 0) e.setY(0);
		if (e.getX() > this.WORLD_WIDTH - this.PLAYER_SIZE)
			e.setX(this.WORLD_WIDTH - this.PLAYER_SIZE);
		if (e.getY() > this.WORLD_HEIGHT - this.PLAYER_SIZE)
			e.setY(this.WORLD_HEIGHT - this.PLAYER_SIZE);

		// if (j.x < 0) j.x = 0;
		// if (j.y < 0) j.y = 0;
		// if (j.x > this.WORLD_WIDTH - this.PLAYER_SIZE)
		// 	j.x = this.WORLD_WIDTH - this.PLAYER_SIZE;
		// if (j.y > this.WORLD_HEIGHT - this.PLAYER_SIZE)
		// 	j.y = this.WORLD_HEIGHT - this.PLAYER_SIZE;
	}

	private updateSpeed(j: Joueur) {
		if (this.seDeplace(j) && j.getSpeed() < this.max_speed)
			j.setSpeed(j.getSpeed() + 0.2);
		if (!this.seDeplace(j)) j.setSpeed(1);
	}

	private seDeplace(j: Joueur) {
		return j.getVX() != 0 || j.getVY() != 0;
	}
}
