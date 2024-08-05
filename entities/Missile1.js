import Phaser from "phaser";

export default class Missile1 extends Phaser.Physics.Arcade.Image {

    constructor(scene, x, y) {
        super(scene, x, y)
        this.localScene = scene;
        this.setTexture('missile1')
        this.speed = 200
        this.health = 5
        this.damage = 10

        this.active = false
        this.visible = false

    }


    update(time, delta) {
        if (this.active && this.body) {
            this.setVelocityY(this.speed)
            if (this.y > this.localScene.sizes.height - 150) {
                this.setVisible(false)
                this.setActive(false)
                this.destroy()
                this.localScene.decrementPlayerHealth(10)
            }
        }
    }


}