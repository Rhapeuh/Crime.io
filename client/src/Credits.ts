export async function genererCredits(): Promise<string> {
	const response = await fetch('/credits.html');
	return await response.text();
}
