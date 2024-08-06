import Phaser from "phaser";

export default class Missile1 extends Phaser.Physics.Arcade.Image {

    constructor(scene, x, y) {
        super(scene, x, y)
        this.playScene = scene;
        this.setTexture('missile1')
        this.speed = 200
        this.health = 1
        this.score = 10
        this.damage = 5
    }


    update(time, delta) {
            this.setVelocityY(this.speed)
            if (this.y > this.playScene.sizes.height - 150) {
                this.setVisible(false)
                this.setActive(false)
                this.destroy()
                this.playScene.decrementPlayerHealth(10)
            }

            if(this.health < 1) {
                this.playScene.score += this.score
                this.setVisible(false)
                this.setActive(false)
                this.destroy() 
            }
    }


}