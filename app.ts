/// <reference path="scripts/entities/base/Pawn.ts"/>
/// <reference path="scripts/entities/base/Ball.ts"/>
/// <reference path="scripts/entities/base/Equipment.ts"/>
/// <reference path="scripts/entities/base/Wall.ts"/>

/// <reference path="scripts/entities/Player.ts"/>
/// <reference path="scripts/entities/HockeyStick.ts"/>
/// <reference path="scripts/entities/HockeyPuck.ts"/>
/// <reference path="scripts/entities/FlyingDisc.ts"/>
/// <reference path="scripts/entities/Flag.ts"/>
/// <reference path="scripts/entities/Dodgeball.ts"/>
/// <reference path="scripts/entities/Goal.ts"/>
/// <reference path="scripts/entities/Gymnasium.ts"/>

/// <reference path="scripts/input/Joystick.ts"/>
/// <reference path="scripts/input/Gamepad.ts"/>
/// <reference path="scripts/input/GamepadListener.ts"/>

/// <reference path="scripts/SportsMedleyGame.ts"/>
interface Window { game: SportsMedley.SportsMedleyGame }
module SportsMedley {
    window.onload = () => {
        window.game = new SportsMedleyGame(document.body);
    };
}