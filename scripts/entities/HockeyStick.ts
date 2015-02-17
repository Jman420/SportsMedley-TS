module SportsMedley.Entities {
    export class HockeyStick extends Base.Equipment {
        swingRange: number = 100;
        swingForce: number = 0.02;

        constructor(game: SportsMedleyGame, x: number, y: number) {
            super(game);

            this.body = this.createBody(x, y);
        }

        public tick(tickEvent: any) {
            this.updateTexture();

            if (this.holder && (this.game.gameType != 'Hockey' && this.game.gameType != 'Bonus'))
                this.holder.dropEquipment();
        }

        public canEquip(): boolean {
            return (this.game.gameType == 'Hockey' || this.game.gameType == 'Bonus') && !this.holder;
        }

        public canSwing(): boolean {
            return Boolean(this.holder); //TODO: cooldown
        }

        public swing(strength: number, direction: number): void {
            var bodiesInRange: any = this.world.bodies.filter(function(body) {
                var dx: number = body.position.x - this.body.position.x;
                var dy: number = body.position.y - this.body.position.y;

                var dist: number = Math.sqrt(dx * dx + dy * dy);
                return dist < this.swingRange;
            }, this);

            bodiesInRange.forEach(function(ball) {
                var force: any = {
                    x: strength * this.swingForce * Math.cos(direction),
                    y: strength * this.swingForce * Math.sin(direction)
                };

                Matter.Body.applyForce(ball, ball.position, force);
            }, this);
        }

        private createBody(x: number, y: number): any {
            var newBody: any = Matter.Bodies.rectangle(x, y, 20, 36, { frictionAir: 0.05, angle: Math.random() * 2 * Math.PI });
            newBody.pawn = this;

            return newBody;
        }

        private updateTexture(): void {
            if (this.game.gameType == 'Hockey' || this.game.gameType == 'Bonus')
                this.body.render.sprite.texture = './assets/images/hockey-stick.png';
            else
                this.body.render.sprite.texture = './assets/images/hockey-stick-inactive.png';
        }
    }
}