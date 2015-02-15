interface Window { game: SportsMedley.SportsMedleyGame };
window.onload = () => {
    window.game = new SportsMedley.SportsMedleyGame(document.body);
};