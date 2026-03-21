import type { scores } from "../../common/types";

export default class Score {
	static genererTableauScores(listeScore: scores[]): string {
		let i = 1;
		let res = `<div class="score_open">
                        <div class="scores-header">
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
                        <td class="col-rank">${i++}</td>
                        <td class="col-pseudo">${s.pseudo}</td>
                        <td class="col-score">${s.score}</td>
                        <td class="col-date">${s.date}</td>
                    </tr>`;
		});
		return res + `</tbody></table></div>`;
	}
}
