module SportsMedley.Entities.Base {
    /// <reference path="Pawn.ts"/>
    /// <reference path="../Player.ts"/>
    export class Equipment extends Pawn {
        holder: Player;

        public canEquip(): boolean {
            return false;
        }

        public canSwing(): boolean {
            return false;
        }

        public swing(strength:number, direction: number): void {
            throw new Error("Equipment.swing() is an abstract method.");
        }

        public destroy(): void {
            if (this.holder) {
                this.holder.dropEquipment();
            }

            super.destroy();
        }
    }
}