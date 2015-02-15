module SportsMedley {
    export declare var Matter: any;

    export class SportsMedleyGame {
        engine: any;

        constructor(domNode: HTMLElement) {

        }

        getWorld(): any {
            return this.engine.world;
        }
    }
}