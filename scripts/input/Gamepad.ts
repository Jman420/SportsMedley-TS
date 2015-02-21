module SportsMedley.Input {
    /// <reference path="Joystick.ts"/>
    export class Gamepad {
        leftJoystick: Joystick;
        rightJoystick: Joystick;
        input: any;

        constructor() {
            this.leftJoystick = undefined;
            this.rightJoystick = undefined;
            this.input = undefined;
        }

        public setupComplete(): boolean {
            return Boolean(this.leftJoystick && this.rightJoystick);
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