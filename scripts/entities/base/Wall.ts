module SportsMedley.Entities.Base {
    export class Wall extends Pawn {
        constructor(game: SportsMedleyGame, x: number, y: number, width: number, height: number) {
            super(game);

            this.body = this.createBody(x, y, width, height);
            Matter.World.add(this.world, this.body);
        }

        private createBody(x: number, y: number, width: number, height: number): any {
            var newBody: any = Matter.Bodies.rectangle(x, y, width, height, { isStatic: true });
            return newBody;
        }
    }
}