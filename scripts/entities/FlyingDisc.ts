module SportsMedley.Entities {
    export class FlyingDisc extends Base.Ball {
        static radius: number = 10;
        static bodyOptions: any = {};

        landedSpeed: number = 5;
        possessor: Player;

        constructor(game: SportsMedleyGame, x: number, y: number) {
            super(game, x, y, FlyingDisc.radius, FlyingDisc.bodyOptions);

            this.possessor = null;
        }

        public tick(tickEvent: any) {
            super.tick(tickEvent);

            this.body.frictionAir = (this.body.speed > this.landedSpeed ? 0.005 : 0.1);

            if (this.possessor) {
                if (this.isActive()) {
                    var endZone = this.game.gym.getEndZone(this);
                    if (endZone !== null && endZone !== this.possessor.team) {
                        this.game.score(this.possessor.team, 1);
                        this.game.playSound("cheer-short");
                        this.reset();
                    }
                } else {
                    this.possessor.releasePossession();
                }
            }

            this.updateTexture();
        }

        public canGrab(): boolean {
            return this.isActive() && !this.possessor;
        }

        private updateTexture(): void {
            if (this.isActive()) {
                this.body.render.sprite.texture = this.body.speed < this.landedSpeed ? "./assets/images/flyingdisc-active.png" : "./assets/images/flyingdisc-thrown.png";
            } else {
                this.body.render.sprite.texture = "./assets/images/flyingdisc-inactive.png";
            }
        }

        private reset(): void {
            if (this.possessor) {
                this.possessor.releasePossession();
            }

            this.game.gym.createFlyingDisc();
            this.destroy();
        }

        private isActive(): boolean {
            return this.game.gameType == "Ultimate Flying Disc" || this.game.gameType == "Bonus";
        }
    }
}