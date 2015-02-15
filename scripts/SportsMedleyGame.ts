module SportsMedley {
    export declare var Matter: any;

    export class SportsMedleyGame {
        engine: any;
        gameType: string;

        constructor(domNode: HTMLElement) {

        }

        public getWorld(): any {
            return this.engine.world;
        }

        public playSound(name: string): void {
            
        }

        public score(team: number, amount: number): void {
            
        }
    }
}