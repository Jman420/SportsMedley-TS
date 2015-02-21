module SportsMedley.Entities.Base {
    /// <reference path="../SportsMedleyGame.ts"/>
    export class Pawn {
        game: SportsMedleyGame;
        world: any;
        body: any;
        composite: any;

        constructor(game: SportsMedleyGame) {
            this.game = game;
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

        public tick(tickEvent: any): void {
            throw new Error("Pawn.tick() is an abstract method.");
        }
    }
}