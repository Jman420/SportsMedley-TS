module SportsMedley.Entities {
    export class Equipment extends Pawn {
        holder: Player;

        public canEquip(): boolean {
            return false;
        }

        public canSwing(): boolean {
            return false;
        }

        public destroy(): void {
            if (this.holder) {
                this.holder.dropEquipment();
            }

            super.destroy();
        }
    }
}