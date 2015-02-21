module SportsMedley.Input {
    export class GamepadListener {
        leftJoystickLayouts: Joystick[] = [
            new Joystick(0, 1),
            new Joystick(1, 0)
        ];
        rightJoystickLayouts: Joystick[] = [
            new Joystick(2, 3),
            new Joystick(3, 2),
            new Joystick(3, 4)
        ];
        joystickConfigCanvasDimension: number = 50;
        joystickIndicatorRange: number = this.joystickConfigCanvasDimension / 4;

        domNode: HTMLElement;
        game: SportsMedleyGame;
        world: any;
        setupPlayer: Entities.Player;
        leftJoystickCanvases: HTMLCanvasElement[];
        rightJoystickCanvases: HTMLCanvasElement[];

        constructor(domNode: HTMLElement, game: SportsMedleyGame) {
            this.domNode = domNode;
            this.game = game;
            this.world = game.getWorld();
            this.setupPlayer = null;

            var container: HTMLDivElement;
            var canvas: HTMLCanvasElement;

            //Left Stick Config
            this.leftJoystickCanvases = [];
            for (var canvasCounter: number = 0; canvasCounter < this.leftJoystickLayouts.length; canvasCounter++) {
                container = <HTMLDivElement>document.getElementById("leftStickCanvasContainer");
                canvas = this.createJoystickCanvas(container, canvasCounter, "left");
                this.leftJoystickCanvases[canvasCounter] = canvas;
            }

            //Right Stick Config
            this.rightJoystickCanvases = [];
            for (canvasCounter = 0; canvasCounter < this.rightJoystickLayouts.length; canvasCounter++) {
                container = <HTMLDivElement>document.getElementById("rightStickCanvasContainer");
                canvas = this.createJoystickCanvas(container, canvasCounter, "right");
                this.rightJoystickCanvases[canvasCounter] = canvas;
            }
        }

        public pollGamepads(tickEvent: any): void {
            var provider: any = navigator;
            var gamepads: any = provider.getGamepads();

            for (var gamepadCounter = 0; gamepadCounter < gamepads.length; gamepadCounter++) {
                if (gamepads[gamepadCounter]) {
                    var player = this.game.players[gamepadCounter];

                    if (!player) {
                        var world = this.world;
                        var team = gamepadCounter % 2;
                        var x = world.bounds.max.x / 4 + team * world.bounds.max.x / 2;
                        player = this.game.players[gamepadCounter] = new Entities.Player(this.game, x, 768 / 2, team);
                    }

                    var input = gamepads[gamepadCounter];
                    player.gamepad.input = input;

                    if (!player.gamepad.setupComplete() && (!this.setupPlayer || this.setupPlayer == player) && input) {
                        this.setupPlayer = player;

                        var joystick: Joystick;
                        var canvas: HTMLCanvasElement;

                        for (var layoutCounter: number = 0; layoutCounter < this.leftJoystickLayouts.length; layoutCounter++) {
                            joystick = this.leftJoystickLayouts[layoutCounter];
                            canvas = this.leftJoystickCanvases[layoutCounter];
                            this.setupJoystickCanvas(joystick, input, canvas);
                        }

                        for (layoutCounter = 0; layoutCounter < this.rightJoystickLayouts.length; layoutCounter++) {
                            joystick = this.rightJoystickLayouts[layoutCounter];
                            canvas = this.rightJoystickCanvases[layoutCounter];
                            this.setupJoystickCanvas(joystick, input, canvas);
                        }

                        document.getElementById("gamepadCanvasContainer").style.display = "block";
                    }
                    else if (!this.setupPlayer) {
                        document.getElementById("gamepadCanvasContainer").style.display = "none";
                    }
                }
            }
        }

        private createJoystickCanvas(container: HTMLDivElement, canvasIndex: number, side: string): HTMLCanvasElement {
            var canvas: HTMLCanvasElement = document.createElement("canvas");
            canvas.width = canvas.height = this.joystickConfigCanvasDimension;
            canvas.addEventListener("click", this.handleJoystickConfigClick.bind(this, canvasIndex, side));
            container.appendChild(canvas);

            return canvas;
        }

        private setupJoystickCanvas(joystick: Joystick, input: any, canvas: HTMLCanvasElement): void {
            if (joystick.horizontalAxis < input.axes.length && joystick.verticalAxis < input.axes.length) {
                var context: CanvasRenderingContext2D = canvas.getContext("2d");
                var widthCenter: number = canvas.width / 2;
                var heightCenter: number = canvas.height / 2;

                context.clearRect(0, 0, canvas.width, canvas.height);
                context.beginPath();
                context.arc(widthCenter, heightCenter, widthCenter, 2 * Math.PI, 0, true);
                context.stroke();
                context.beginPath();
                context.arc(widthCenter + (joystick.getHorizontalAxis(input) * this.joystickIndicatorRange), heightCenter + (joystick.getVerticalAxis(input) * this.joystickIndicatorRange), widthCenter / 4, 2 * Math.PI, 0, true);
                context.strokeStyle = "white";
                context.stroke();
                canvas.style.display = "";
            }
            else {
                canvas.style.display = "none";
            }
        }

        private handleJoystickConfigClick(index: number, side: string, mouseEvent: MouseEvent) {
            if (side == "left") {
                this.setupPlayer.gamepad.leftJoystick = this.leftJoystickLayouts[index];
            }
            else if (side == "right") {
                this.setupPlayer.gamepad.rightJoystick = this.rightJoystickLayouts[index];
            }

            if (this.setupPlayer.gamepad.setupComplete()) {
                this.setupPlayer.addToWorld();
                this.setupPlayer = null;
            }
        }
    }
} 