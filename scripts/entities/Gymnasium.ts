module SportsMedley.Entities {
    export class Gymnasium {
        wallThickness: number = 25;

        goalWidth: number = 30;
        goalHeight: number = 150;
        goalBuffer: number = 65;

        totalDodgeballs: number = 5;
        dodgeballSize: number = 7;
        hockeyPuckSize: number = 5;
        flyingDiscSize: number = 7;

        game: SportsMedleyGame;
        world: any;
        gymWidth: number;
        gymHeight: number;
        centerX: number;
        centerY: number;

        walls: Base.Wall[];
        goals: Goal[];
        dodgeballs: Dodgeball[];
        flag: Flag;
        flyingDisc: FlyingDisc;

        constructor(game: SportsMedleyGame) {
            this.game = game;
            this.world = game.getWorld();

            this.gymWidth = this.world.bounds.max.x - this.world.bounds.min.x;
            this.gymHeight = this.world.bounds.max.y - this.world.bounds.min.y;
            this.centerX = (this.world.bounds.max.x + this.world.bounds.min.x) / 2;
            this.centerY = (this.world.bounds.max.y + this.world.bounds.min.y) / 2;

            this.walls = this.createWalls();
            this.goals = this.createGoals();
            this.dodgeballs = this.createDodgeballs();
            this.flag = this.createFlag();
            this.flyingDisc = this.createFlyingDisc();
        }

        public getEndZone(pawn: Base.Pawn): number {
            if (pawn.body.position.x < this.goalWidth + this.goalBuffer + this.wallThickness) {
                return 0;
            }

            if (pawn.body.position.x > this.world.bounds.max.x - this.goalBuffer - this.goalWidth - this.wallThickness) {
                return 1;
            }

            return null;
        }

        public createFlyingDisc(): FlyingDisc {
            var result: FlyingDisc;
            var randomSide = Math.random();

            if (randomSide < 1 / 3) {
                result = new FlyingDisc(this.game, this.centerX, this.wallThickness + FlyingDisc.prototype.radius);
            } else if (randomSide > 1 / 3 && randomSide < 2 / 3) {
                result = new FlyingDisc(this.game, this.centerX, this.gymHeight - this.wallThickness - FlyingDisc.prototype.radius);
            } else {
                result = new FlyingDisc(this.game, this.centerX, this.centerY);
            }

            return result;
        }

        public createHockeyPuck(): HockeyPuck {
            var w = this.world.bounds.max.x;
            var h = this.world.bounds.max.y;

            var x = w / 4 + w / 2 * Math.round(Math.random());
            var y = h / 4 + h / 2 * Math.round(Math.random());

            return new HockeyPuck(this.game, x, y);
        }

        private createWalls(): Base.Wall[] {
            return [
                new Base.Wall(this.game, this.centerX, -100 + this.wallThickness, this.gymWidth, 200), // top,
                new Base.Wall(this.game, this.world.bounds.max.x + 100 - this.wallThickness, this.centerY, 200, this.gymHeight), // right
                new Base.Wall(this.game, this.centerX, this.world.bounds.max.y + 100 - this.wallThickness, this.gymWidth, 200), // bottom,
                new Base.Wall(this.game, -100 + this.wallThickness, this.centerY, 200, this.gymHeight) // left
            ];
        }

        private createGoals(): Goal[] {
            return [
                new Goal(this.game, this.world.bounds.min.x + this.goalBuffer + this.wallThickness, this.centerY, 0),
                new Goal(this.game, this.world.bounds.max.x - this.goalBuffer - this.wallThickness, this.centerY, 1)
            ];
        }

        private createDodgeballs(): Dodgeball[] {
            var centerCircleRadius = 50;
            var newDodgeballs = [];

            for (var direction = 0; direction < Math.PI * 2; direction += Math.PI * 2 / this.totalDodgeballs) {
                var newDodgeball: Dodgeball = new Dodgeball(this.game, this.centerX + Math.cos(direction) * centerCircleRadius,
                    this.centerY + Math.sin(direction) * centerCircleRadius);
                newDodgeballs.push(newDodgeball);
            }

            return newDodgeballs;
        }

        private createFlag(): Flag {
            return new Flag(this.game, this.centerX, this.centerY);
        }
    }
}