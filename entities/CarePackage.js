import Phaser from "phaser";

export default class CarePackage extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.playScene = scene;
    this.speed = 100;
    this.funds = this.getRandomFunds();

    // Setup sprites for the container
    this.carePackage = scene.add.image(0, 0, "carePackage");
    this.carePackage.setOrigin(0, 0);
    this.carePackage.setScale(0.5);
    this.parachute = scene.add.image(0, -50, "parachute").setOrigin(0.225, 0.6);
    this.parachute.setScale(0.8);
    this.add([this.parachute, this.carePackage]);

    // Setup physics for the container
    scene.physics.world.enable(this);
    this.body.setVelocityY(this.speed);
    this.body.setSize(this.carePackage.displayWidth, this.carePackage.displayHeight);
  }

  update(time, delta) {
    if (this.y < this.playScene.sizes.height - 220) {
      this.body.setVelocityY(this.speed);
    } else {
      this.body.setVelocityY(0);
      this.parachute.setActive(false);
      this.parachute.setVisible(false);
      this.parachute.destroy();
    }
  }

  getRandomFunds() {
    const rng = Math.floor(Math.random() * 6);
    return 50 + rng * 50;
  }
}
