module SportsMedley.Entities {
    export class Dodgeball extends Base.Ball {
        static radius: number = 10;
        static bodyOptions: any = {
            restitution: 0.2,
            friction: 1
        };

        hitMinSpeed: number = 5;

        constructor(game: SportsMedleyGame, x: number, y: number) {
            super(game, x, y, Dodgeball.radius, Dodgeball.bodyOptions);
        }

        public tick(): void {
            if (this.game.gameType == 'Dodgeball' || this.game.gameType == 'Bonus')
                this.body.render.sprite.texture = this.body.speed < this.hitMinSpeed ? './assets/images/dodgeball-active.png' : './assets/images/dodgeball-thrown.png';
            else
                this.body.render.sprite.texture = './assets/images/dodgeball-inactive.png';
        }

        public canGrab(): boolean {
            return (this.game.gameType == 'Dodgeball' || this.game.gameType == 'Bonus') && this.body.speed < this.hitMinSpeed;
        }

        public handleCollision(otherThing: any): void {
            if (otherThing instanceof Player) {
                this.hitPlayer(<Player>otherThing);
            }
        }

        public hitPlayer(player: Player): void {
            if (this.game.gameType != 'Dodgeball' && this.game.gameType != 'Bonus')
                return;

            if (this.canGrab())
                return;

            if (this.lastThrownBy && this.lastThrownBy.team != player.team) {
                player.dropEquipment();
                this.game.playSound('dodgeball-score');
                this.game.score(this.lastThrownBy.team, 1 / 20);
            }
        }
    }
}