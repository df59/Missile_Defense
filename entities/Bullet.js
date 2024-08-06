import Phaser from "phaser";

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "bullet");

    this.speed = Phaser.Math.GetSpeed(800, 1);
    this.damage = 1;
    this.setScale(0.5);
  }

  fire(x, y, direction, inputSpeed, inputDamage) {
    this.speed = Phaser.Math.GetSpeed(inputSpeed, 1);
    this.damage = inputDamage;
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.body.allowGravity = false;

    this.direction = direction + 6;
    this.rotation = this.direction;
  }

  update(time, delta) {
    this.x += Math.cos(this.direction) * this.speed * delta;
    this.y += Math.sin(this.direction) * this.speed * delta;

    // If bullet is out of bounds delete it
    if (this.x < 0 || this.y < 0 || this.x > 1960 || this.y > 960) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
}
