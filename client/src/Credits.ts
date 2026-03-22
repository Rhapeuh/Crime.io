export async function genererCredits(): Promise<string> {
	const response = await fetch('/credits.html');
	return await response.text();
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
