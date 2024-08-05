import Phaser from 'phaser'

export default class LoaderScene extends Phaser.Scene {
  constructor() {
    super('loader-scene')
  }

  preload() {
    this.load.image('tank', './assets/tank(2).png')
    this.load.image('missile1', './assets/missile1(3).png')
    this.load.image('missile2', './assets/missile2.png')
    this.load.image('tankGun', './assets/tankgun(2).png')
    this.load.image('bullet', './assets/bullet1.png')
    this.load.image('blue_button_rectangle_flat', '/assets/button_rectangle_depth_flat.png')
    this.load.image('carePackage', '/assets/carePackage.png')
    this.load.image('parachute', '/assets/parachute.png')
    this.load.image('heart', '/assets/heart.png')
    this.load.image('turret', '/assets/turret.png')
    this.load.image('turretGun', '/assets/turretGun.png')

    this.load.image('bg', './assets/bg.jpg')

    this.load.bitmapFont(
      "arcade",
      "assets/fonts/arcade.png",
      "assets/fonts/arcade.xml"
    )

  }

  create() {
    this.scene.switch('play-scene')
  }
}