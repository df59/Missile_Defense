import Phaser from "phaser";

export default class Tank extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {
        super(scene, x, y)
        this.playScene = scene;
        this.tankSpeed = 250;
        this.tankGunLength = 145;
        this.fireInterval = 100;
        this.nextFireTimer = this.fireInterval;
        this.bulletSpeed = 500;
        this.turretGunLength = 60;
        this.upgrades = {
            'fire-rate': { cost: 100, description: 'Increase bullet fire rate.', tier: 0 },
            'bullet-speed': { cost: 150, description: 'Increase bullet speed.', tier: 0 },
            'bullet-damage': { cost: 500, description: 'Increase bullet damage output.', tier: 0 },
          };


        // Create the tank sprite
        this.tank = scene.add.image(0, 0, "tank");
        this.tank.setScale(1);
        this.tank.setOrigin(0, 0);

        // Create the tank gun sprite
        this.tankGun = scene.add.image(0, 0, "tankGun");
        this.tankGun.setScale(1);
        this.tankGun.setOrigin(.5, 0);
        this.tankGun.setPosition(this.tank.width / 2, 50)

        // Add both sprites to the container
        this.add([this.tank, this.tankGun]);

        // Enable physics for the container
        scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setCollideWorldBounds(true);
        this.body.setSize(this.tank.displayWidth, this.tank.displayHeight);

    // // Create a container to hold the tank and the tank gun
    // this.tankContainer = this.add.container(this.sizes.width / 2 - 100, this.sizes.height - 265);

    // // Create the tank and add it to the container
    // this.tank = this.add.image(0, 0, "tank").setOrigin(0, 0);

    // // Create the tank gun and add it to the container
    // this.tankgun = this.add.image(0, 0, "tankgun").setOrigin(.5, 0)
    // this.tankgun.setPosition(this.tank.width / 2, 50);

    // // Add the tank and tank gun to the container
    // this.tankContainer.add([this.tank, this.tankgun]);  // TODO get rid of one of these duplicate lines
    // this.physics.world.enable(this.tankContainer);
    // this.tankContainer.body.setImmovable(true);
    // this.tankContainer.body.allowGravity = false;
    // this.tankContainer.body.setCollideWorldBounds(true);
    // this.tankContainer.add([this.tankgun, this.tank]);
    // this.tankContainer.body.setSize(this.tank.displayWidth, this.tank.displayHeight)

    }


    update(time, delta) {
        this.checkFireTimer(time, delta);
        this.rotateTankGunToPointer();
        this.moveTank();
    }

    rotateTankGunToPointer() {

        const pointer = this.playScene.input.activePointer;
    
        // Calculate the angle between the tank gun and the mouse pointer
        const angle = Phaser.Math.Angle.Between(
          this.x + this.tankGun.x,
          this.y + this.tankGun.y,
          pointer.worldX,
          pointer.worldY
        ) + (3*3.1415/2);
    
        this.tankGun.setRotation(angle);
      }

      fireBullet() {
        // Fire bullet based on tank and tankgun location
        if (this.playScene.input.activePointer.leftButtonDown()) {
            const shoot = this.playScene.bulletGroup.get()
            if (shoot) {
                shoot.fire(this.x+this.tankGun.x-(this.tankGunLength*Math.sin(this.tankGun.rotation)),
                     this.y + this.tankGun.y+(this.tankGunLength*Math.cos(this.tankGun.rotation)),
                      this.tankGun.rotation + (1.855), this.bulletSpeed)
                }
            }
      }

      checkFireTimer(time, delta) {
        console.log("checkint tank fire timer")
        // Decrease the missile spawn timer
        this.nextFireTimer -= delta;
        if (this.nextFireTimer <= 0 && this.playScene.input.activePointer.leftButtonDown()) {
            this.fireBullet()
            this.nextFireTimer = this.fireInterval;
        }
      }

      moveTank() {
        // Perform tank movement
        if(this.playScene.cursor.A.isDown) {
            this.body.setVelocityX(-this.tankSpeed);
          } else if (this.playScene.cursor.D.isDown) {
            this.body.setVelocityX(this.tankSpeed);
          } else {
            this.body.setVelocity(0);
          }
      }

}