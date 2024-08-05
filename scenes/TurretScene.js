import Phaser from 'phaser';
import Turret from '../entities/Turret';

export default class TurretScene extends Phaser.Scene {
    constructor() {
        super('turret-scene');
        this.playScene = null;
    }

    init(data) {
        this.playScene = data.playScene; // Receive the PlayScene reference
    }

    create() {
        // Add a semi-transparent background
        this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.1).setOrigin(0);

        // Add a close button to return to PlayScene
        const closeButton = this.add.text(this.cameras.main.width / 2, this.cameras.main.height - 100, 'Close', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#000'
        }).setOrigin(0.5).setInteractive();

        closeButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('play-scene');
        });
    }

    update(time, delta) {
        // Update logic if needed
    }
}