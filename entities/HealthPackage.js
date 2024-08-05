import Phaser from "phaser";

export default class HealthPackage extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {
        super(scene, x, y);

        this.playScene = scene;
        this.speed = 100;
        this.health = 10;

        // Setup sprites for the container
        this.heart = scene.add.image(0, 0, "heart")
        this.heart.setOrigin(0, 0)
        this.heart.setScale(.8)
        this.parachute = scene.add.image(0, -50, "parachute").setOrigin(0.28, .6);
        this.parachute.setScale(.8)
        this.add([this.parachute, this.heart]);

        // Setup physics for the container
        scene.physics.world.enable(this);
        this.body.setVelocityY(this.speed);
        this.body.setImmovable(true);
        this.body.setCollideWorldBounds(true);
        this.body.allowGravity = false;
        this.body.setSize(this.heart.displayWidth, this.heart.displayHeight)
    }

    update(time, delta) {
            if (this.y < this.playScene.sizes.height - 200) {
                this.body.setVelocityY(this.speed)
            } else {
                this.body.setVelocityY(0)
                this.parachute.setActive(false)
                this.parachute.setVisible(false)
                this.parachute.destroy()
            }
    }

}