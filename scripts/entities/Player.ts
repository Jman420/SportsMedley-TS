module SportsMedley.Entities {
    export class Player extends Base.Pawn {
        walkForce: number = 0.01;
        framesBetweenWalk: number = 5;
        minWalkSpeed: number = this.walkForce * 10;

        flickThreshold: number = 0.90;
        lungeForce: number = 0.2;
        lungeCooldown: number = 1000;
        attackDuration: number = 500;
        throwForce: number = 0.03;

        radius: number = 25;

        team: number;
        framesSinceWalk: number;
        nextWalkFrame: number;
        possession: any;
        equipment: Base.Equipment;
        gamepad: Input.Gamepad;
        flickStart: number;
        lastLunged: number;
        body: any;

        constructor(game: SportsMedleyGame, x: number, y: number, team: number) {
            super(game);

            this.team = team;
            this.framesSinceWalk = 0;
            this.nextWalkFrame = 0;
            this.lastLunged = 0;
            this.possession = null;
            this.equipment = null;
            this.flickStart = null;

            this.gamepad = new Input.Gamepad();
            this.body = this.createBody(x, y);
        }

        public addToWorld(): void {
            Matter.World.add(this.world, this.body);
            this.game.gym.createHockeyStick(this.body.position.x, this.body.position.y);
        }

        public tick(tickEvent: any): void {
            this.handleInput(tickEvent);

            if (this.equipment) {
                this.translateEquipmentToSelf();
                this.equipment.tick(tickEvent);
            }

            this.updateTexture();
        }

        public handleCollision(otherEntity: any): void {
            if (!this.possession && otherEntity instanceof Base.Ball) {
                var ball: Base.Ball = <Base.Ball>otherEntity;
                if (ball.canGrab()) {
                    this.grabBall(ball);
                }
            }
            else if (!this.equipment && otherEntity instanceof Base.Equipment) {
                var equipment: Base.Equipment = <Base.Equipment>otherEntity;
                if (equipment.canEquip()) {
                    this.equip(equipment);
                }
            }
            else if (otherEntity instanceof Player) {
                var otherPlayer: Player = <Player>otherEntity;
                if (this.isAttacking()) {
                    this.attack(otherPlayer);
                }
            }
        }

        public dropEquipment(): void {
            if (!this.equipment) {
                return;
            }

            Matter.World.add(this.world, this.equipment.body);

            this.equipment.holder = null;
            this.equipment = null;
        }

        public releasePossession(): void {
            if (!this.possession) {
                return;
            }

            var pawn: Base.Ball = this.possession.bodyB.pawn;

            Matter.World.remove(this.world, this.possession);

            pawn.body.groupId = 0;
            pawn.possessor = null;

            this.possession = null;
        }

        private createBody(x: number, y: number): any {
            var body: any = Matter.Bodies.circle(x, y, this.radius, { frictionAir: 0.2 });
            body.pawn = this;
            body.groupId = Matter.Body.nextGroupId();
            return body;
        }

        private handleInput(tickEvent: any): void {
            if (this.gamepad.setupComplete()) {
                this.handleMovementInput(tickEvent);
                this.handleFlickInput(tickEvent);
            }
        }

        private handleMovementInput(tickEvent: any): void {
            var joyX: number = this.gamepad.getLeftHorizontalAxis();
            var joyY: number = this.gamepad.getLeftVerticalAxis();

            var force: any = {
                x: joyX * this.walkForce,
                y: joyY * this.walkForce
            };

            if (this.canWalk()) {
                Matter.Body.applyForce(this.body, this.body.position, force);
            }

            if (force.x || force.y) {
                Matter.Body.rotate(this.body, -this.body.angle + Math.atan2(force.y, force.x));
            }
        }

        private handleFlickInput(tickEvent: any): void {
            var joyX: number = this.gamepad.getRightHorizontalAxis();
            var joyY: number = this.gamepad.getRightVerticalAxis();

            if (joyX === 0 && joyY === 0)
                this.flickStart = tickEvent.timestamp;

            if (Math.sqrt(joyX * joyX + joyY * joyY) > this.flickThreshold && this.flickStart) {
                var strength = Math.min(1, 30 / (tickEvent.timestamp - this.flickStart));

                var direction = Math.atan2(joyY, joyX);

                if (this.canThrow()) {
                    this.throwBall(strength, direction);
                } else if (this.equipment && this.equipment.canSwing()) {
                    this.equipment.swing(strength, direction);
                } else if (this.canLunge()) {
                    this.lunge(strength, direction);
                }

                this.flickStart = undefined;
            }
        }

        private canWalk(): boolean {
            return !(this.possession && this.possession.bodyB.pawn instanceof FlyingDisc);
        }

        private equip(equipment: Base.Equipment): void {
            this.equipment = equipment;
            equipment.holder = this;
            Matter.World.remove(this.world, equipment.body);
        }

        private grabBall(ball: Base.Ball): void {
            ball.possessor = this;

            ball.body.groupId = this.body.groupId;

            this.possession = Matter.Constraint.create({
                bodyA: this.body,
                bodyB: ball.body,
                stiffness: 1,
                render: {
                    lineWidth: 5,
                    strokeStyle: "#F79A42"
                }
            });

            this.possession.length = this.radius + ball.radius;

            Matter.World.add(this.world, this.possession);
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

        private throwBall(strength: number, direction: number): void {
            var force: any = {
                x: Math.cos(direction) * this.throwForce * strength,
                y: Math.sin(direction) * this.throwForce * strength
            };
            var ball: Base.Ball = this.possession.bodyB.pawn;

            this.releasePossession();
            this.translatePossessionAroundPlayer(ball, direction);

            ball.lastThrownBy = this;
            Matter.Body.applyForce(ball.body, ball.body.position, force);
            this.game.playSound("throw-" + Math.floor(strength * 2));
        }

        private translatePossessionAroundPlayer(ball: Base.Ball, direction: number) {
            var desiredBallLocation: any = {
                x: this.body.position.x + Math.cos(direction) * (this.radius + ball.radius + 5),
                y: this.body.position.y + Math.sin(direction) * (this.radius + ball.radius + 5)
            };

            var translation: any = {
                x: desiredBallLocation.x - ball.body.position.x,
                y: desiredBallLocation.y - ball.body.position.y
            };

            Matter.Body.translate(ball.body, translation);
        }

        private canLunge(): boolean {
            return !this.equipment && !this.possession && (this.game.timestamp - this.lastLunged) > this.lungeCooldown;
        }

        private isAttacking(): boolean {
            return this.game.timestamp - this.lastLunged < this.attackDuration;
        }

        private lunge(strength: number, direction: number): void {
            var force: any = {
                x: Math.cos(direction) * strength * this.lungeForce,
                y: Math.sin(direction) * strength * this.lungeForce
            };

            this.lastLunged = this.game.timestamp;

            Matter.Body.applyForce(this.body, this.body.position, force);
        }

        private attack(otherPlayer: Player): void {
            otherPlayer.dropEquipment();
        }

        private translateEquipmentToSelf(): void {
            var translation: any = {
                x: this.body.position.x - this.equipment.body.position.x,
                y: this.body.position.y - this.equipment.body.position.y
            };

            Matter.Body.translate(this.equipment.body, translation);
        }

        private updateTexture(): void {
            if (this.body.speed >= this.minWalkSpeed) {
                if (this.framesSinceWalk > this.framesBetweenWalk) {
                    this.body.render.sprite.texture = "./assets/images/player-team" + this.team + "-walk" + this.nextWalkFrame + ".png";
                    this.nextWalkFrame = 1 - this.nextWalkFrame;
                    this.framesSinceWalk = 0;
                } else {
                    this.framesSinceWalk++;
                }
            } else {
                this.body.render.sprite.texture = "./assets/images/player-team" + this.team + "-idle.png";
            }
        }
    }
}