module SportsMedley.Entities.Base {
    export class Ball extends Pawn {
        radius: number = 10;
        bodyOptions = {};

        body: any;
        lastThrownBy: Player;

        constructor(game: SportsMedleyGame, x: number, y: number) {
            super(game);

            this.body = this.createBody(x, y);
        }

        public canGrab(): boolean {
            return false;
        }

        public tick(): void {
            if (this.isOutOfWorld()) {
                var correctiveTranslation = {
                    x: (this.world.bounds.max.x + this.world.bounds.min.x) / 2 - this.body.position.x,
                    y: (this.world.bounds.max.y + this.world.bounds.min.y) / 2 - this.body.position.y
                };

                Matter.Body.translate(this.body, correctiveTranslation);
            }
        }

        private createBody(x: number, y: number): void {
            var newBody = Matter.Bodies.circle(x, y, this.radius, this.bodyOptions);
            newBody.pawn = this;

            return newBody;
        }

        private isOutOfWorld(): boolean {
            return this.body.position.x < this.world.bounds.min.x
                || this.body.position.y < this.world.bounds.min.y
                || this.body.position.x > this.world.bounds.max.x
                || this.body.position.y > this.world.bounds.max.y;
        }
    }
}