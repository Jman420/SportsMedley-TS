module SportsMedley.Entities {
    export class Player extends Base.Pawn {
        walkForce: number = 0.01;
        framesBetweenWalk: number = 5;
        minWalkSpeed: number = this.walkForce * 10;

        flickThreshold: number = 0.90;
        lungeForce: number = 0.2;
        lungeCooldown: number = 1000;
        lungeDuration: number = 500;
        throwForce: number = 0.03;

        radius:number = 25;

        team: number;
        framesSinceWalk: number;
        nextWalkFrame: number;
        possession: any;
        equipment: Base.Equipment;
        gamepad: Input.Gamepad;
        flickStart: number;
        
        constructor(game: SportsMedleyGame, x: number, y:number, team:number) {
            super(game);

            this.team = team;
            this.framesSinceWalk = 0;
            this.nextWalkFrame = 0;
            this.possession = null;
            this.equipment = null;
            

            game.gym.createHockeyStick(this.body.position.x, this.body.position.y);
        }

        public tick(tickEvent: any): void {
            this.handleInput(tickEvent);

            this.updateTexture();
        }

        public dropEquipment(): void {
            
        }

        private handleInput(tickEvent: any): void {
            if (this.gamepad.setupComplete()) {
                this.handleMovementInput(tickEvent);
                this.handleFlickInput(tickEvent);
            }
        }

        private handleMovementInput(tickEvent: any): void {
            var joyX = this.gamepad.getLeftHorizontalAxis();
            var joyY = this.gamepad.getLeftVerticalAxis();

            var x = joyX * this.walkForce;
            var y = joyY * this.walkForce;

            if (this.canWalk())
                Matter.Body.applyForce(this.body, this.body.position, { x: x, y: y });

            if (x || y)
                Matter.Body.rotate(this.body, -this.body.angle + Math.atan2(y, x));
        }

        private handleFlickInput(tickEvent: any): void {
            var joyX = this.gamepad.getRightHorizontalAxis();
            var joyY = this.gamepad.getRightVerticalAxis();

            if (joyX === 0 && joyY === 0)
                this.flickStart = tickEvent.timestamp;

            if (Math.sqrt(joyX * joyX + joyY * joyY) > this.flickThreshold && this.flickStart) {
                var strength = Math.min(1, 30 / (tickEvent.timestamp - this.flickStart));

                var direction = Math.atan2(joyY, joyX);

                if (this.canThrow())
                    this.throw(strength, direction);
                else {
                    if (this.equipment) {
                        if (this.equipment.canSwing()) {
                            this.equipment.swing(strength, direction);
                        }
                    }
                    else {
                        if (this.canLunge())
                            this.lunge(strength, direction);
                    }
                }

                this.flickStart = undefined;
            }
        }

        private canWalk(): boolean {
            return (this.possession && this.possession.bodyB.pawn instanceof FlyingDisc);
        }

        private canThrow(): boolean {
            if (!this.possession) {
                return false;
            }

            if (this.game.gameType == "Dodgeball" && !this.isOffsides()) {
                return false;
            }

            return true;
        }

        private isOffsides(): boolean {
            var half = Math.floor(this.body.position.x / (this.world.bounds.max.x / 2));
            return half == this.team;
        }

        private updateTexture(): void {
            if (this.body.speed >= this.minWalkSpeed) {
                if (this.framesSinceWalk > this.framesBetweenWalk) {
                    this.body.render.sprite.texture = "./assets/images/player-team" + this.team + "-walk" + this.nextWalkFrame + ".png";
                    this.nextWalkFrame = 1 - this.nextWalkFrame;
                    this.framesSinceWalk = 0;
                }
                else {
                    this.framesSinceWalk++;
                }
            }
            else {
                this.body.render.sprite.texture = "./assets/images/player-team" + this.team + "-idle.png";
            }
        }
    }
}