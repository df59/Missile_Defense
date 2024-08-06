import Phaser from "phaser";

export default class Missile3 extends Phaser.Physics.Arcade.Image {
  // A fast, high score, low health, low damage missile
  constructor(scene, x, y) {
    super(scene, x, y);
    this.playScene = scene;
    this.setTexture("missile3");
    this.speed = 500;
    this.health = 1;
    this.score = 100;
    this.damage = 2;
    this.setScale(0.5);
  }

  update(time, delta) {
    this.setVelocityY(this.speed);
    if (this.y > this.playScene.sizes.height - 150) {
      this.setVisible(false);
      this.setActive(false);
      this.destroy();
      this.playScene.decrementPlayerHealth(10);
    }

    if (this.health < 1) {
      this.playScene.score += this.score;
      this.setVisible(false);
      this.setActive(false);
      this.destroy();
    }
  }
}
