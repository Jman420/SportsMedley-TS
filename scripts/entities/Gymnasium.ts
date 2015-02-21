module SportsMedley.Entities {
    /// <reference path="../SportsMedleyGame.ts"/>
    /// <reference path="base/Wall.ts"/>
    /// <reference path="Goal.ts"/>
    /// <reference path="Dodgeball.ts"/>
    /// <reference path="Flag.ts"/>
    /// <reference path="FlyingDisc.ts"/>
    /// <reference path="HockeyPuck.ts"/>
    /// <reference path="HockeyStick.ts"/>
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
        hockeyPuck: HockeyPuck;
        hockeySticks: HockeyStick[];

        constructor(game: SportsMedleyGame) {
            this.game = game;
            this.world = game.getWorld();

            this.gymWidth = this.world.bounds.max.x - this.world.bounds.min.x;
            this.gymHeight = this.world.bounds.max.y - this.world.bounds.min.y;
            this.centerX = (this.world.bounds.max.x + this.world.bounds.min.x) / 2;
            this.centerY = (this.world.bounds.max.y + this.world.bounds.min.y) / 2;

            this.createWalls();
            this.createGoals();
            this.createDodgeballs();
            this.createFlag();
            this.createFlyingDisc();
            this.createHockeyPuck();

            this.hockeySticks = [];
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
            var newFlyingDisc: FlyingDisc;
            var randomSide = Math.random();

            if (randomSide < 1 / 3) {
                newFlyingDisc = new FlyingDisc(this.game, this.centerX, this.wallThickness + FlyingDisc.radius);
            } else if (randomSide > 1 / 3 && randomSide < 2 / 3) {
                newFlyingDisc = new FlyingDisc(this.game, this.centerX, this.gymHeight - this.wallThickness - FlyingDisc.radius);
            } else {
                newFlyingDisc = new FlyingDisc(this.game, this.centerX, this.centerY);
            }

            this.flyingDisc = newFlyingDisc;
            Matter.World.add(this.world, this.flyingDisc.body);

            return newFlyingDisc;
        }

        public createHockeyPuck(): HockeyPuck {
            var width = this.world.bounds.max.x;
            var height = this.world.bounds.max.y;

            var x = width / 4 + width / 2 * Math.round(Math.random());
            var y = height / 4 + height / 2 * Math.round(Math.random());

            this.hockeyPuck = new HockeyPuck(this.game, x, y);
            Matter.World.add(this.world, this.hockeyPuck.body);

            return this.hockeyPuck;
        }

        public createHockeyStick(x, y): HockeyStick {
            var newHockeyStick = new HockeyStick(this.game, x, y);
            this.hockeySticks.push(newHockeyStick);
            Matter.World.add(this.world, newHockeyStick.body);

            return newHockeyStick;
        }

        private createWalls(): Base.Wall[]{
            this.walls = [
                new Base.Wall(this.game, this.centerX, -100 + this.wallThickness, this.gymWidth, 200), // top,
                new Base.Wall(this.game, this.world.bounds.max.x + 100 - this.wallThickness, this.centerY, 200, this.gymHeight), // right
                new Base.Wall(this.game, this.centerX, this.world.bounds.max.y + 100 - this.wallThickness, this.gymWidth, 200), // bottom,
                new Base.Wall(this.game, -100 + this.wallThickness, this.centerY, 200, this.gymHeight) // left
            ];
            return this.walls;
        }

        private createGoals(): Goal[]{
            this.goals = [
                new Goal(this.game, this.world.bounds.min.x + this.goalBuffer + this.wallThickness, this.centerY, 0),
                new Goal(this.game, this.world.bounds.max.x - this.goalBuffer - this.wallThickness, this.centerY, 1)
            ];
            return this.goals;
        }

        private createDodgeballs(): Dodgeball[] {
            var centerCircleRadius = 50;
            var newDodgeballs = [];

            for (var direction = 0; direction < Math.PI * 2; direction += Math.PI * 2 / this.totalDodgeballs) {
                var newDodgeball: Dodgeball = new Dodgeball(this.game, this.centerX + Math.cos(direction) * centerCircleRadius,
                    this.centerY + Math.sin(direction) * centerCircleRadius);
                newDodgeballs.push(newDodgeball);

                Matter.World.add(this.world, newDodgeball.body);
            }

            this.dodgeballs = newDodgeballs;
            return newDodgeballs;
        }

        private createFlag(): Flag {
            this.flag = new Flag(this.game, this.centerX, this.centerY);
            Matter.World.add(this.world, this.flag.body);
            return this.flag;
        }
    }
}