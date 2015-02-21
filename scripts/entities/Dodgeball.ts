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
            if (this.possessor && !this.isActive()) {
                this.possessor.releasePossession();
            }

            this.updateTexture();
        }

        public canGrab(): boolean {
            return this.isActive() && !this.possessor && !this.isThrown();
        }

        public handleCollision(otherThing: any): void {
            if (otherThing instanceof Player) {
                this.hitPlayer(<Player>otherThing);
            }
        }

        public hitPlayer(player: Player): void {
            if (!this.isActive() || !this.isThrown()) {
                return;
            }

            player.dropEquipment();
            if (this.lastThrownBy && this.lastThrownBy.team != player.team) {
                this.game.playSound("dodgeball-score");
                this.game.score(this.lastThrownBy.team, 1 / 20);
            }
        }

        private updateTexture(): void {
            if (this.isActive())
                this.body.render.sprite.texture = this.isThrown() ? "./assets/images/dodgeball-thrown.png" : "./assets/images/dodgeball-active.png";
            else
                this.body.render.sprite.texture = "./assets/images/dodgeball-inactive.png";
        }

        private isThrown(): boolean {
            return this.body.speed > this.hitMinSpeed;
        }

        private isActive(): boolean {
            return this.game.gameType == "Dodgeball" || this.game.gameType == "Bonus";
        }
    }
}