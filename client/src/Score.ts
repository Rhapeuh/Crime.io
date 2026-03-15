import TopScores from './data/score.json';

export default class Score {
	static genererTableauScores(): string {
		const i = 1;
		const listeScore = TopScores.topScore;
		listeScore.sort((a, b) => b.score - a.score).slice(0, 20);
		let res = `<div class="scores-header">
                        <h2>Les Meilleurs Scores</h2>
                    </div>
                    <table class="tableau-scores">
                        <thead>
                            <tr>
                                <th>Rang</th>
                                <th>Joueur</th>
                                <th>Score</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>`;
		listeScore.forEach(s => {
			res += `<tr>
                        <td class="col-rank">${i + 1}</td>
                        <td class="col-pseudo">${s.pseudo}</td>
                        <td class="col-score">${s.score.toLocaleString()}</td>
                        <td class="col-date">${s.date}</td>
                    </tr>`;
		});
		return res + `</tbody></table>`;
	}
}
