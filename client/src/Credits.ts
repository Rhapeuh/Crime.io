export function genererCredits(): string {
	return `<div class="score_open credit-open">
                        <div class="scores-header">
                            <h2>Crédits</h2>
                        </div>
                        <div class="credits-content">
                            <p class="credits-subtitle">Projet réalisé par l'équipe JSAÉ :</p>
                            <div class="team-grid">
                                <div class="team-member" style="color: var(--electric-citrus1);" data-nom="Wattrelos" data-prenom="Ylann" data-groupe="JSAÉ" data-surnom="test" data-jeu="Geometry Dash" data-note="33.3%">
                                    <div class="member-avatar">Y</div>
                                    <div class="member-info">
                                        <span class="member-firstname">Ylann</span>
                                        <span class="member-lastname">Wattrelos</span>
                                    </div>
                                </div>
                                <div class="team-member" style="color: var(--electric-blue1);" data-nom="Stievenard" data-prenom="Adam" data-groupe="JSAÉ" data-surnom="test" data-jeu="Counter-Strike 2" data-note="33.3%">
                                    <div class="member-avatar">A</div>
                                    <div class="member-info">
                                        <span class="member-firstname">Adam</span>
                                        <span class="member-lastname">Stievenard</span>
                                    </div>
                                </div>
                                <div class="team-member" style="color: var(--electric-pink);" data-nom="Seulin" data-prenom="Ethan" data-groupe="JSAÉ" data-surnom="test" data-jeu="Counter-Strike 2" data-note="33.4%">
                                    <div class="member-avatar">E</div>
                                    <div class="member-info">
                                        <span class="member-firstname">Ethan</span>
                                        <span class="member-lastname">Seulin</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="member-details hidden">
                                <h3>Informations du membre</h3>
                                <div class="details-grid">
                                    <div class="detail-item">
                                        <span class="detail-label">Prénom</span>
                                        <span class="detail-val" id="det-prenom"></span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Nom</span>
                                        <span class="detail-val" id="det-nom"></span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Groupe</span>
                                        <span class="detail-val" id="det-groupe"></span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Surnom</span>
                                        <span class="detail-val" id="det-surnom"></span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Jeu Préféré</span>
                                        <span class="detail-val" id="det-jeu"></span>
                                    </div>
                                    <div class="detail-item">
                                        <span class="detail-label">Part de la note</span>
                                        <span class="detail-val" id="det-note"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
}

export function initEvents() {
	const members = document.querySelectorAll('.team-member');
	const detailsSection = document.querySelector(
		'.member-details'
	) as HTMLElement;

	if (!detailsSection) return;

	members.forEach(member => {
		member.addEventListener('click', event => {
			event.preventDefault();
			members.forEach(m => m.classList.remove('active'));
			member.classList.add('active');

			const dataset = (member as HTMLElement).dataset;

			const valPrenom = document.getElementById('det-prenom');
			const valNom = document.getElementById('det-nom');
			const valGroupe = document.getElementById('det-groupe');
			const valSurnom = document.getElementById('det-surnom');
			const valJeu = document.getElementById('det-jeu');
			const valNote = document.getElementById('det-note');

			if (valPrenom) valPrenom.innerText = dataset.prenom || '';
			if (valNom) valNom.innerText = dataset.nom || '';
			if (valGroupe) valGroupe.innerText = dataset.groupe || '';
			if (valSurnom) valSurnom.innerText = dataset.surnom || '';
			if (valJeu) valJeu.innerText = dataset.jeu || '';
			if (valNote) valNote.innerText = dataset.note || '';

			detailsSection.style.borderTopColor = (member as HTMLElement).style.color;

			detailsSection.classList.remove('hidden');
		});
	});
}
