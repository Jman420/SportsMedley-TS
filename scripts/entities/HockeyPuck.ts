module SportsMedley.Entities {
    export class HockeyPuck extends Base.Ball {
        static puckRadius: number = 11;
        radius: number = HockeyPuck.puckRadius;
        bodyOptions: any = { density: 0.0005 };

        public tick(tickEvent: any) {
            super.tick(tickEvent);
            this.updateTexture();
        }

        public reset(): void {
            this.game.gym.createHockeyPuck();
            this.destroy();
        }

        private updateTexture(): void {
            if (this.game.gameType == 'Hockey' || this.game.gameType == 'Bonus')
                this.body.render.sprite.texture = './assets/images/hockeypuck.png';
            else
                this.body.render.sprite.texture = './assets/images/hockeypuck-inactive.png';
        }
    }
}