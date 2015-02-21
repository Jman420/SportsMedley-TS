module SportsMedley.Entities {
    /// <reference path="base/Pawn.ts"/>
    /// <reference path="../SportsMedleyGame.ts"/>
    /// <reference path="base/Wall.ts"/>
    export class Goal extends Base.Pawn {
        thickness: number = 30;
        width: number = 75;
        height: number = 150;

        x: number;
        y: number;
        team: number;
        back: Base.Wall;
        top: Base.Wall;
        bottom: Base.Wall;

        constructor(game: SportsMedleyGame, x: number, y: number, team: number) {
            super(game);

            this.x = x;
            this.y = y;
            this.team = team;

            this.createWalls(x, y);
        }

        public tick(tickEvent: any): void {
            var halfScreenWidth: number = this.width / 2;
            var halfScreenHeight: number = this.height / 2;
            var halfGoalWidth: number = (this.width - this.thickness) / 2;
            var xCenter: number = this.x;
            xCenter += (this.team) ? -halfScreenWidth : halfScreenWidth;

            if (this.game.gameType == "Hockey" || this.game.gameType == "Bonus") {
                this.world.bodies
                    .filter(b => b.pawn && b.pawn instanceof HockeyPuck)
                    .filter(function (puckBody) {
                        return Math.abs(puckBody.position.x - xCenter) < halfGoalWidth
                            && Math.abs(puckBody.position.y - this.y) < halfScreenHeight;
                    }, this)
                    .forEach(function (puckBodyInGoal) {
                        this.game.playSound("buzzer");
                        puckBodyInGoal.pawn.reset();
                        this.game.score(this.team ? 0 : 1, 1);
                    }, this);
            }
        }

        private createWalls(x: number, y: number): void {
            var yOffset: number = this.height / 2;
            var xOffset: number = (this.width - this.thickness) / 2;
            xOffset *= (this.team) ? -1 : 1;

            this.back = new Base.Wall(this.game, x, y, this.thickness, this.height);
            this.top = new Base.Wall(this.game, x + xOffset, y - yOffset, this.width, this.thickness);
            this.bottom = new Base.Wall(this.game, x + xOffset, y + yOffset, this.width, this.thickness);
        }
    }
}