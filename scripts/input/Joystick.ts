module SportsMedley.Input {
    export class Joystick {
        deadZone: number = 0.2;

        horizontalAxis: number;
        verticalAxis: number;

        constructor(horizontalAxis: number, verticalAxis: number) {
            this.horizontalAxis = horizontalAxis;
            this.verticalAxis = verticalAxis;
        }

        public getHorizontalAxis(input: any): number {
            var axis: number = input.axes[this.horizontalAxis];

            if (Math.abs(axis) < this.deadZone) {
                axis = 0;
            }

            return axis;
        }

        public getVerticalAxis(input: any): number {
            var axis: number = input.axes[this.verticalAxis];

            if (Math.abs(axis) < this.deadZone) {
                axis = 0;
            }

            return axis;
        }
    }
} 