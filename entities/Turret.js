import Phaser from "phaser";

export default class Turret extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);

        this.playScene = scene;

        // Create the turret sprite
        this.turret = scene.add.image(0, 0, "turret");
        this.turret.setScale(1);
        this.turret.setOrigin(0.5, 0.5);

        // Create the turret gun sprite
        this.turretGun = scene.add.image(0, -20, "turretGun");
        this.turretGun.setScale(0.8);
        this.turretGun.setOrigin(0.1, 0.5);

        // Add both sprites to the container
        this.add([this.turret, this.turretGun]);

        // Enable physics for the container
        scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.setCollideWorldBounds(true);
        this.body.allowGravity = false;
        this.body.setSize(this.turret.displayWidth, this.turret.displayHeight);

        // Add this container to the scene
        scene.add.existing(this);

        // Make the container interactive and enable dragging
        this.setSize(this.turret.displayWidth, this.turret.displayHeight);
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, this.width, this.height), Phaser.Geom.Rectangle.Contains);
        scene.input.setDraggable(this);

        // Double-click detection variables
        this.clickTime = 0;
        this.doubleClickThreshold = 250; // Time in ms to detect double-click

        // Add pointer events
        this.on('pointerup', this.onPointerUp, this);

        // Drag events
        this.on('drag', this.onDrag, this);
    }

    onPointerUp(pointer) {
        const currentTime = this.scene.time.now;

        // Check if the click is within the double-click threshold
        if (currentTime - this.clickTime < this.doubleClickThreshold) {
            this.openTurretScene();
        }

        // Update the click time
        this.clickTime = currentTime;
    }

    openTurretScene() {
        this.playScene.scene.pause()
        this.playScene.scene.launch('turret-scene', { playScene: this.playScene }); // pass reference to this scene
    }

    update(time, delta) {
        this.rotateGunToPointer();
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

    resetPosition(xPos, yPos) {
        this.setPosition(xPos, yPos);
    }

    onDrag(pointer, dragX, dragY) {
        this.setPosition(dragX, this.y); // Update position while dragging
    }
}