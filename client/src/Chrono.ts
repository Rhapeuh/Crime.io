export default class Chrono {
	public startTime = 0;
	public isRunning = false;
	public finalTime = 0;

	start() {
		this.startTime = Date.now();
		this.isRunning = true;
	}

	stop() {
		if (this.isRunning) {
			this.finalTime = Date.now() - this.startTime;
			this.isRunning = false;
		}
	}

	getTimeFormat() {
		const tempsEcoule = this.isRunning
			? Date.now() - this.startTime
			: this.finalTime;

		const minutes = Math.floor(tempsEcoule / 60000);
		const seconde = Math.floor((tempsEcoule % 60000) / 1000);

		const minutesStr = minutes.toString().padStart(2, '0');
		const secondeStr = seconde.toString().padStart(2, '0');

		return `${minutesStr}:${secondeStr}`;
	}
}
