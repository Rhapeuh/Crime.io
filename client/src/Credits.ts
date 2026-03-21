export default function genererCredits(): string {
	return `<div class="score_open credit-open">
                        <div class="scores-header">
                            <h2>Crédits</h2>
                        </div>
                        <div class="credits-content">
                            <p class="credits-subtitle">Projet réalisé par l'équipe JSAÉ :</p>
                            <div class="team-grid">
                                <div class="team-member" style="color: var(--electric-citrus1);">
                                    <div class="member-avatar">Y</div>
                                    <div class="member-info">
                                        <span class="member-firstname">Ylann</span>
                                        <span class="member-lastname">Wattrelos</span>
                                    </div>
                                </div>
                                <div class="team-member" style="color: var(--electric-blue1);">
                                    <div class="member-avatar">A</div>
                                    <div class="member-info">
                                        <span class="member-firstname">Adam</span>
                                        <span class="member-lastname">Stievenard</span>
                                    </div>
                                </div>
                                <div class="team-member" style="color: var(--electric-pink);">
                                    <div class="member-avatar">E</div>
                                    <div class="member-info">
                                        <span class="member-firstname">Ethan</span>
                                        <span class="member-lastname">Seulin</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
}
