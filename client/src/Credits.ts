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

			const iframes = document.querySelectorAll('.steamPage');
			iframes.forEach((frame) => frame.setAttribute('class', 'steamPage'));

			if (member == document.querySelector('[data-prenom="Ylann"]')) {
				document.querySelector('.steamPage[src="/pageSteam/Rhapeuh.html"]')?.setAttribute('class', 'steamPage active');				
			}
			if (member == document.querySelector('[data-prenom="Adam"]')) {
				document.querySelector('.steamPage[src="/pageSteam/YuNeria.html"]')?.setAttribute('class', 'steamPage active');			
			}
			if (member == document.querySelector('[data-prenom="Ethan"]')) {
				document.querySelector('.steamPage[src="/pageSteam/Fleinz.html"]')?.setAttribute('class', 'steamPage active');		
			}
		});
	});
}
