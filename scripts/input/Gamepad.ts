module SportsMedley.Input {
    export class Gamepad {
        leftJoystick: Joystick = undefined;
        rightJoystick: Joystick = undefined;
        input: any = undefined;

        public setupComplete(): boolean {
            return this.leftJoystick !== undefined && this.rightJoystick !== undefined;
        }

        public getLeftHorizontalAxis(): number {
            if (!this.leftJoystick) {
                return undefined;
            }

            return this.leftJoystick.getHorizontalAxis(this.input);
        }

        public getLeftVerticalAxis(): number {
            if (!this.leftJoystick) {
                return undefined;
            }

            return this.leftJoystick.getVerticalAxis(this.input);
        }

        public getRightHorizontalAxis(): number {
            if (!this.rightJoystick) {
                return undefined;
            }

            return this.rightJoystick.getHorizontalAxis(this.input);
        }

        public getRightVerticalAxis(): number {
            if (!this.rightJoystick) {
                return undefined;
            }

            return this.rightJoystick.getVerticalAxis(this.input);
        }
    }
} 