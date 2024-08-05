import Phaser from "phaser";

export default class Turret extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.fireInterval = 100;
        this.nextFireTimer = this.fireInterval;
        this.bulletSpeed = 500;
        this.turretGunLength = 60;
        this.upgrades = {
            'fire-rate': { cost: 100, description: 'Increase bullet fire rate.', tier: 0 },
            'bullet-speed': { cost: 150, description: 'Increase bullet speed.', tier: 0 },
            'bullet-damage': { cost: 500, description: 'Increase bullet damage output.', tier: 0 },
          };

        this.modes = {
            POINT: 1,
            FOLLOW: 2,
            SPRAY: 3
        };

        this.targetPoint = null;

        this.currentMode = this.modes.FOLLOW

        this.playScene = scene;

        // Create the turret sprite
        this.turret = scene.add.image(0, 0, "turret");
        this.turret.setScale(1.3);
        this.turret.setOrigin(0.5, 0.5);

        // Create the turret gun sprite
        this.turretGun = scene.add.image(0, -40, "turretGun");
        this.turretGun.setScale(1);
        this.turretGun.setOrigin(0.1, 0.5);

        // Add both sprites to the container
        this.add([this.turret, this.turretGun]);

        // Enable physics for the container
        scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.allowGravity = false;
        this.body.setSize(this.turret.displayWidth, this.turret.displayHeight);

        // Add this container to the scene
        scene.add.existing(this);

        // Make the container interactive and enable dragging
        this.setSize(this.turret.displayWidth, this.turret.displayHeight);
        this.setInteractive();
        scene.input.setDraggable(this);

        // Double-click detection variables
        this.clickTime = 0;
        this.doubleClickThreshold = 250; // Time in ms to detect double-click

        // Add pointer events
        this.on('pointerup', this.onPointerUp, this);

        // Drag events
        this.on('drag', this.onDrag, this);
    }

    update(time, delta) {
        this.checkFireTimer(time, delta);
        if (this.currentMode === this.modes.POINT && this.targetPoint) {
          this.rotateGunToPoint(this.targetPoint.x, this.targetPoint.y);
        } else {
          this.rotateGunToPointer();
        }
      }

    onPointerUp(pointer) {
        const currentTime = this.scene.time.now;

        // Check if the click is within the double-click threshold
        if (currentTime - this.clickTime < this.doubleClickThreshold) {
            this.openTurretUpgradeScene();
        }

        // Update the click time
        this.clickTime = currentTime;
    }

    openTurretUpgradeScene() {
        this.playScene.scene.pause()
        this.playScene.scene.launch('turret-upgrade-scene', { playScene: this.playScene, turret: this}); // pass reference to this scene
    }

    rotateGunToPoint(targetX, targetY) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        this.turretGun.setRotation(angle);
      }

    rotateGunToPointer() {
        const pointer = this.playScene.input.activePointer;

        // Calculate the angle between the tank gun and the mouse pointer
        const angle = Phaser.Math.Angle.Between(
            this.x + this.turretGun.x,
            this.y + this.turretGun.y,
            pointer.worldX,
            pointer.worldY
        );

        this.turretGun.setRotation(angle);
    }

    onDrag(pointer, dragX, dragY) {
        this.setPosition(dragX, this.y); // Update position while dragging
    }

    checkFireTimer(time, delta) {
        // Decrease the missile spawn timer
        this.nextFireTimer -= delta;
        if (this.nextFireTimer <= 0) {
            this.fireBullet()
            this.nextFireTimer = this.fireInterval;
        }
      }

    fireBullet() {
        // Fire bullet based on tank and tankgun location
            const shoot = this.playScene.bulletGroup.get()
            if (shoot) {
                shoot.fire(this.x + this.turretGun.x+(this.turretGunLength*Math.cos(this.turretGun.rotation)),
                     this.y + this.turretGun.y+(this.turretGunLength*Math.sin(this.turretGun.rotation)),
                      this.turretGun.rotation + (.28), this.bulletSpeed)
                }
            
      }

    openPointModeScene() {
        this.scene.pause();
        this.scene.launch('point-mode-scene', { playScene: this.playScene, turret: this.turret });
    }

}