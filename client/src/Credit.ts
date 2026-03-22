export default class Credit {
    static genererCredit(): string {
        let res = `<div class="credit_open">
                        <div class="credit-header">
                            <h2>CREDITS</h2>
                        </div>
                        <div class="creditContent">
                        <iframe class="steamPage active" src="src/steam_pages/Communauté Steam __ YuNeria.html"></iframe>
                        <iframe class="steamPage" src="src/steam_pages/Communauté Steam __ YuNeria.html"></iframe>
                        <iframe class="steamPage" src="src/steam_pages/Communauté Steam __ YuNeria.html"></iframe>
                        </div>
                        `;

        return res + `</div>`;
    }
}
