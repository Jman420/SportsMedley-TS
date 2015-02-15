module SportsMedley {
    export declare var Matter: any;

    export class SportsMedleyGame {
        engine: any;
        gameType: string;
        timestamp: number;
        gym: Entities.Gymnasium;

        constructor(domNode: HTMLElement) {
            this.gym = new Entities.Gymnasium(this);
        }

        public getWorld(): any {
            return this.engine.world;
        }

        public playSound(name: string): void {}

        public score(team: number, amount: number): void {}
    }
}