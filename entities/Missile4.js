import Phaser from "phaser";

export default class Missile4 extends Phaser.Physics.Arcade.Image {
  // A very slow very strong boss missile
  constructor(scene, x, y) {
    super(scene, x, y);
    this.playScene = scene;
    this.setTexture("missile4");
    this.speed = 20;
    this.health = 100;
    this.score = 1000;
    this.damage = 50;
    this.setScale(2);
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
