module SportsMedley.Entities.Base {
    export class Ball extends Pawn {
        radius: number;
        bodyOptions: any;

        body: any;
        lastThrownBy: Player;
        possessor: Player;

        constructor(game: SportsMedleyGame, x: number, y: number, radius: number, bodyOptions: any) {
            super(game);

            this.radius = radius;
            this.bodyOptions = bodyOptions;

            this.body = this.createBody(x, y, radius, bodyOptions);
            this.lastThrownBy = null;
            this.possessor = null;
        }

        public canGrab(): boolean {
            return false;
        }

        public tick(tickEvent: any): void {
            if (this.isOutOfWorld()) {
                var correctiveTranslation = {
                    x: (this.world.bounds.max.x + this.world.bounds.min.x) / 2 - this.body.position.x,
                    y: (this.world.bounds.max.y + this.world.bounds.min.y) / 2 - this.body.position.y
                };

                Matter.Body.translate(this.body, correctiveTranslation);
            }
        }

        public createBody(x: number, y: number, radius: number, bodyOptions: any): any {
            var newBody = Matter.Bodies.circle(x, y, radius, bodyOptions);
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