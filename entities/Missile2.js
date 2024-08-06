import Phaser from "phaser";

export default class Missile2 extends Phaser.Physics.Arcade.Image {
  // A slow, high health, high damage, medium score missile
  constructor(scene, x, y) {
    super(scene, x, y);
    this.playScene = scene;
    this.setTexture("missile2");
    this.speed = 100;
    this.health = 5;
    this.score = 50;
    this.damage = 20;
  }

  update(time, delta) {
    this.setVelocityY(this.speed);
    if (this.y > this.playScene.sizes.height - 150) {
      this.setVisible(false);
      this.setActive(false);
      this.destroy();
      this.playScene.decrementPlayerHealth(this.damage);
    }

    if (this.health < 1) {
      this.playScene.score += this.score;
      this.setVisible(false);
      this.setActive(false);
      this.destroy();
    }
  }
}
