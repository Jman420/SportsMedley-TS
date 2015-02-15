module SportsMedley.Entities {
    export class Pawn {
        world: any;
        body: any;
        composite: any;

        constructor(game: SportsMedleyGame) {
            this.world = game.getWorld();
        }

        public destroy(): void {
            if (this.body) {
                Matter.World.remove(this.world, this.body);
            }

            if (this.composite) {
                Matter.World.remove(this.world, this.composite, true);
            }
        }

        public tick(): void {
            throw new Error("Pawn.tick() is an abstract method.");
        }
    }
}