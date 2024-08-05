import Phaser from 'phaser';

export default class PointModeScene extends Phaser.Scene {
  constructor() {
    super('point-mode-scene');
    this.playScene;
    this.turret;
    this.targetPoint;
  }

  init(data) {
    this.playScene = data.playScene;
    this.turret = data.turret;
  }

  create() {
    // Create a semi-transparent background
    this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);

    // Add instructions text
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, 'Click on the screen to set the turret target.', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

    // Add input event listener to set target point
    this.input.on('pointerdown', this.setTargetPoint, this);
  }

  setTargetPoint(pointer) {
    // Set the target point for the turret
    if (this.turret) {
      const targetX = pointer.worldX;
      const targetY = pointer.worldY;

      this.turret.targetPoint = { x: targetX, y: targetY };
      
      // Update turret mode to POINT
      this.turret.currentMode = this.turret.modes.POINT;

      // Stop this scene and resume the PlayScene
      this.scene.stop();
      this.scene.setVisible(true, 'turret-upgrade-scene')
      this.scene.resume('turret-upgrade-scene');
    }
  }
}