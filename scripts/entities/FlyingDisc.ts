module SportsMedley.Entities {
    export class FlyingDisc extends Base.Ball {
        static discRadius: number = 10;

        bodyOptions: any = { restitution: 0 };
        landedSpeed: number = 5;
        radius: number = FlyingDisc.discRadius;

        possessor: Player;

        constructor(game: SportsMedleyGame, x: number, y: number) {
            super(game, x, y);

            this.possessor = null;
        }

        public tick(tickEvent: any) {
            super.tick(tickEvent);

            this.body.frictionAir = (this.body.speed > this.landedSpeed ? 0.005 : 0.1);

            if ((this.game.gameType == "Ultimate Flying Disc" || this.game.gameType == "Bonus") && this.possessor) {
                var endZone = this.game.gym.getEndZone(this);
                if (endZone !== null && endZone !== this.possessor.team) {
                    this.game.score(this.possessor.team, 1);
                    this.game.playSound("cheer-short");
                    this.reset();
                }
            }

            this.updateTexture();
        }

        public canGrab(): boolean {
            return (this.game.gameType == "Ultimate Flying Disc" || this.game.gameType == "Bonus") && !this.possessor;
        }

        private updateTexture(): void {
            if (this.game.gameType == "Ultimate Flying Disc" || this.game.gameType == "Bonus") {
                this.body.render.sprite.texture = this.body.speed < this.landedSpeed ? "./assets/images/flyingdisc-active.png" : "./assets/images/flyingdisc-thrown.png";
            } else {
                this.body.render.sprite.texture = "./assets/images/flyingdisc-inactive.png";
            }
        }

        private reset(): void {
            this.game.gym.createFlyingDisc();
            this.destroy();
        }
    }
}