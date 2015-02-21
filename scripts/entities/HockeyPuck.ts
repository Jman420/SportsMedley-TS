module SportsMedley.Entities {
    /// <reference path="base/Ball.ts"/>
    /// <reference path="../SportsMedleyGame.ts"/>
    export class HockeyPuck extends Base.Ball {
        static radius: number = 11;
        static bodyOptions: any = { density: 0.0005 };

        constructor(game: SportsMedleyGame, x: number, y: number) {
            super(game, x, y, HockeyPuck.radius, HockeyPuck.bodyOptions);
        }

        public tick(tickEvent: any) {
            super.tick(tickEvent);
            this.updateTexture();
        }

        public reset(): void {
            this.game.gym.createHockeyPuck();
            this.destroy();
        }

        private updateTexture(): void {
            if (this.game.gameType == "Hockey" || this.game.gameType == "Bonus")
                this.body.render.sprite.texture = "./assets/images/hockeypuck.png";
            else
                this.body.render.sprite.texture = "./assets/images/hockeypuck-inactive.png";
        }
    }
}