/// <reference path="scripts/SportsMedleyGame.ts"/>
interface Window { game: SportsMedley.SportsMedleyGame }
module SportsMedley {
    window.onload = () => {
        window.game = new SportsMedleyGame(document.body);
    };
}