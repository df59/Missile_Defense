import Phaser from "phaser";

export default class Tank extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.playScene = scene;
    this.tankSpeed = 250;
    this.tankGunLength = 145;
    this.fireInterval = 150;
    this.nextFireTimer = this.fireInterval;
    this.bulletSpeed = 500;
    this.bulletDamage = 1;
    this.turretGunLength = 60;
    this.upgrades = {
      "fire-rate": {
        cost: 200,
        description: "Increase bullet fire rate.",
        tier: 0,
      },
      "bullet-speed": {
        cost: 100,
        description: "Increase bullet speed.",
        tier: 0,
      },
      "tank-speed": {
        cost: 50,
        description: "Increase tank movement speed.",
        tier: 0,
      },
      "buy-turret": {
        cost: 1000,
        description: "Buy a turret that auto fires.",
        tier: 0,
      },
      "bullet-damage": {
        cost: 500,
        description: "Increase bullet damage output.",
        tier: 0,
      },
    };

    // Setup sprites for the container
    this.tank = scene.add.image(0, 0, "tank");
    this.tank.setScale(1);
    this.tank.setOrigin(0, 0);
    this.tankGun = scene.add.image(0, 0, "tankGun");
    this.tankGun.setScale(1);
    this.tankGun.setOrigin(0.5, 0);
    this.tankGun.setPosition(this.tank.width / 2, 50);
    this.add([this.tank, this.tankGun]);

    // Setup physics for the container
    scene.physics.world.enable(this);
    this.body.setSize(this.tank.displayWidth, this.tank.displayHeight);
  }

  update(time, delta) {
    this.checkFireTimer(time, delta);
    this.rotateTankGunToPointer();
    this.moveTank();
  }

  rotateTankGunToPointer() {
    const pointer = this.playScene.input.activePointer;

    // Calculate the angle between the tank gun and the mouse pointer
    const angle =
      Phaser.Math.Angle.Between(this.x + this.tankGun.x, this.y + this.tankGun.y, pointer.worldX, pointer.worldY) + (3 * 3.1415) / 2;

    this.tankGun.setRotation(angle);
  }

  fireBullet() {
    // Fire bullet based on tank and tankgun location
    if (this.playScene.input.activePointer.leftButtonDown()) {
      const shoot = this.playScene.bulletGroup.get();
      if (shoot) {
        shoot.fire(
          this.x + this.tankGun.x - this.tankGunLength * Math.sin(this.tankGun.rotation),
          this.y + this.tankGun.y + this.tankGunLength * Math.cos(this.tankGun.rotation),
          this.tankGun.rotation + 1.855,
          this.bulletSpeed,
          this.bulletDamage
        );
      }
    }
  }

  checkFireTimer(time, delta) {
    // Check if a bullet can be fired yet
    console.log("checkint tank fire timer");
    this.nextFireTimer -= delta;
    if (this.nextFireTimer <= 0 && this.playScene.input.activePointer.leftButtonDown()) {
      this.fireBullet();
      this.nextFireTimer = this.fireInterval;
    }
  }

  moveTank() {
    // Perform tank movement
    if (this.playScene.cursor.A.isDown) {
      this.body.setVelocityX(-this.tankSpeed);
    } else if (this.playScene.cursor.D.isDown) {
      this.body.setVelocityX(this.tankSpeed);
    } else {
      this.body.setVelocity(0);
    }
  }
}
