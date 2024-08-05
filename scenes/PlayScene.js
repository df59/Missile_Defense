import '../style.css'
import Phaser from 'phaser'
import Missile1 from '../entities/Missile1'
import Bullet from '../entities/Bullet'
import UpgradeScene from './UpgradeScene'
import CarePackage from '../entities/CarePackage'
import HealthPackage from '../entities/HealthPackage'
import Turret from '../entities/Turret'

const initialTankSpeed = 250;
const initialSpeedDown = 300;
const maxTargets = 10;

export default class PlayScene extends Phaser.Scene {

  constructor(){
    super('play-scene')
    this.tank;
    this.tankgun;
    this.cursor;
    this.tankSpeed=initialTankSpeed;
    this.missile1Group;
    this.spawnInterval = 1000;
    this.spawnRate = 1;
    this.nextSpawnTimer = 2000;
    this.score = 0;
    this.playerHealth = 100;
    this.fireInterval = 100;
    this.nextFireTimer = this.fireInterval;
    this.funds = 10000;
    this.bulletSpeed = 500;
    this.nextCarePackageTimer = 2000;
    this.carePackageSpawnInterval = 10000;
    this.nextHealthPackageTimer = 2000;
    this.healthPackageSpawnInterval = 10000;

    this.sizes={
        width:1920,
        height:960,
        tankGunLength:145,
      }
  }

  preload() {
  }

  create() {
    
    this.add.image(0,0,"bg").setOrigin(0,0);



    // Create a container to hold the tank and the tank gun
    this.tankContainer = this.add.container(this.sizes.width / 2 - 100, this.sizes.height - 265);

    // Create the tank and add it to the container
    this.tank = this.add.image(0, 0, "tank").setOrigin(0, 0);

    // Create the tank gun and add it to the container
    this.tankgun = this.add.image(0, 0, "tankgun").setOrigin(.5, 0)
    this.tankgun.setPosition(this.tank.width / 2, 50);

    // Add the tank and tank gun to the container
    this.tankContainer.add([this.tank, this.tankgun]);  // TODO get rid of one of these duplicate lines
    this.physics.world.enable(this.tankContainer);
    this.tankContainer.body.setImmovable(true);
    this.tankContainer.body.allowGravity = false;
    this.tankContainer.body.setCollideWorldBounds(true);
    this.tankContainer.add([this.tankgun, this.tank]);
    this.tankContainer.body.setSize(this.tank.displayWidth, this.tank.displayHeight)


    this.missile1Group = this.physics.add.group({
        maxSize: 100
    })
    this.missile1Array = []


    this.bulletGroup = this.physics.add.group({
        classType: Bullet,
        maxSize: 1000,
        runChildUpdate: true
      })

    this.carePackageGroup = this.physics.add.group({
        classType: CarePackage,
        maxSize: 1000,
        runChildUpdate: true
    })

    this.healthPackageGroup = this.physics.add.group({
        classType: HealthPackage,
        maxSize: 1000,
        runChildUpdate: true
    })

    this.turretGroup = this.physics.add.group({
        classType: Turret,
        maxSize: 100,
        runChildUpdate: true
    })

    this.cursor = this.input.keyboard.addKeys("W,A,S,D, SPACE");

    // Create collision between Missile1 and Bullet
    this.physics.add.overlap(this.missile1Group, this.bulletGroup, this.collision, null, this);

    // Create collision between CarePackage and Bullet
    this.physics.add.overlap(this.carePackageGroup, this.bulletGroup, this.bulletCarePackageCollision, null, this);

    // Create collision between HealthPackage and Bullet
    this.physics.add.overlap(this.healthPackageGroup, this.bulletGroup, this.bulletHealthPackageCollision, null, this);

    // Create collision between CarePackage and Tank
    this.physics.add.overlap(this.carePackageGroup, this.tankContainer, this.carePackageTankCollision, null, this);

    // Create collision between HealthPackage and Tank
    this.physics.add.overlap(this.healthPackageGroup, this.tankContainer, this.healthPackageTankCollision, null, this);




    this.scoreText = this.add
    .bitmapText(this.sizes.width - 200, 20, 'arcade', 'Score: 0000', 24)
    .setOrigin(0.5);

    this.healthText = this.add
    .bitmapText(this.sizes.width - 400, 20, 'arcade', 'Health: 100', 24)
    .setOrigin(0.5);

    this.fundsText = this.add
    .bitmapText(this.sizes.width - 600, 20, 'arcade', 'Funds: 0', 24)
    .setOrigin(0.5);

    // Key to trigger the upgrade scene
    this.input.keyboard.on('keydown-U', () => {
        this.scene.pause();
        this.scene.launch('upgrade-scene', { playScene: this }); // pass reference to this scene
      });

  }

  update(time, delta){

    this.rotateTankGunToPointer()

    for (const missile1 of this.missile1Array) {
        missile1.update(time, delta)
    }

    this.moveTank()

    this.checkMissileSpawnTimer(time, delta)
    this.checkCarePackageSpawnTimer(time, delta)
    this.checkHealthPackageSpawnTimer(time, delta)
    this.checkFireTimer(time, delta)

    // Update text
    this.scoreText.setText('Score: ' + this.score)
    this.healthText.setText('Health: ' + this.playerHealth)
    this.fundsText.setText('Funds: ' + this.funds)

    // console.log(time)
    // console.log(this.nextSpawnTimer)
    // console.log(this.spawnInterval)

  }

  healthPackageTankCollision(tank, healthPackage) {
    console.log(healthPackage.health)
    this.playerHealth += healthPackage.health
    healthPackage.destroy()
  }

  carePackageTankCollision(tank, carePackage) {
    carePackage.destroy()
    this.funds += carePackage.funds
  }

  bulletCarePackageCollision(carePackage, bullet) {
    bullet.destroy()
    carePackage.parachute.setActive(false)
    carePackage.parachute.setVisible(false)
    carePackage.parachute.destroy()
    carePackage.speed = 300
  }


  bulletHealthPackageCollision(healthPackage, bullet) {
    bullet.destroy()
    healthPackage.parachute.setActive(false)
    healthPackage.parachute.setVisible(false)
    healthPackage.parachute.destroy()
    healthPackage.speed = 300
  }

  decrementPlayerHealth(amount) {
    this.playerHealth -= amount;
  }

  collision(missile1, bullet) {
    bullet.destroy()
    missile1.destroy()
    this.score += 10
  }

  checkFireTimer(time, delta) {
    // Decrease the missile spawn timer
    this.nextFireTimer -= delta;
    if (this.nextFireTimer <= 0 && this.input.activePointer.leftButtonDown()) {
        this.fireBullet()
        this.nextFireTimer = this.fireInterval;
    }
  }

  moveTank() {
    // Perform tank movement
    if(this.cursor.A.isDown) {
        this.tankContainer.body.setVelocityX(-this.tankSpeed);
      } else if (this.cursor.D.isDown) {
        this.tankContainer.body.setVelocityX(this.tankSpeed);
      } else {
        this.tankContainer.body.setVelocity(0);
      }
  }


  checkMissileSpawnTimer(time, delta) {
    // Decrease the missile spawn timer
    this.nextSpawnTimer -= delta;
    if (this.nextSpawnTimer <= 0) {
        this.spawnMissiles();
        this.spawnInterval *= .99
        this.nextSpawnTimer = this.spawnInterval;
    }

    }

  checkCarePackageSpawnTimer(time, delta) {
    this.nextCarePackageTimer -= delta;
        if (this.nextCarePackageTimer <= 0) {
            this.spawnCarePackage();
            this.nextCarePackageTimer = this.carePackageSpawnInterval;
        }  
    }

    spawnCarePackage() {
        console.log("spawning care package");
        const xPos = this.getRandomX();
        const yPos = 0;
        const carePackage = new CarePackage(this, xPos, yPos);

        this.add.existing(carePackage);
        this.physics.add.existing(carePackage);

        carePackage.setActive(true);
        carePackage.setVisible(true);
        this.carePackageGroup.add(carePackage)
        console.log("care package funds: " + carePackage.funds)
    }


    checkHealthPackageSpawnTimer(time, delta) {
        this.nextHealthPackageTimer -= delta;
            if (this.nextHealthPackageTimer <= 0) {
                this.spawnHealthPackage();
                this.nextHealthPackageTimer = this.healthPackageSpawnInterval;
            }  
    }

    spawnHealthPackage() {
        console.log("spawning health package");
        const xPos = this.getRandomX();
        const yPos = 0;
        const healthPackage = new HealthPackage(this, xPos, yPos);

        this.add.existing(healthPackage);
        this.physics.add.existing(healthPackage);

        healthPackage.setActive(true);
        healthPackage.setVisible(true);
        this.healthPackageGroup.add(healthPackage)
    }

  spawnMissiles() {

    for (let i = 0; i < this.spawnRate; i++) {
        const missile1 = new Missile1(this, 300, 300)
  
        const xPos = this.getRandomX()
        const yPos = 0
        missile1.setPosition(xPos, yPos)
        missile1.setActive(true)
        missile1.setVisible(true)
  
        this.missile1Group.add(missile1, true)
        this.missile1Array.push(missile1)
      }
  }

  getRandomX() {
    return Math.floor(Math.random() * this.sizes.width)
  }

  fireBullet() {
    // Fire bullet based on tank and tankgun location
    if (this.input.activePointer.leftButtonDown()) {
        const shoot = this.bulletGroup.get()
        if (shoot) {
            shoot.fire(this.tankContainer.x+this.tankgun.x-(this.sizes.tankGunLength*Math.sin(this.tankgun.rotation)),
                 this.tankContainer.y + this.tankgun.y+(this.sizes.tankGunLength*Math.cos(this.tankgun.rotation)),
                  this.tankgun.rotation + (1.855), this.bulletSpeed)
            }
        }
  }


  rotateTankGunToPointer() {

    const pointer = this.input.activePointer;

    // Calculate the angle between the tank gun and the mouse pointer
    const angle = Phaser.Math.Angle.Between(
      this.tankContainer.x + this.tankgun.x,
      this.tankContainer.y + this.tankgun.y,
      pointer.worldX,
      pointer.worldY
    ) + (3*3.1415/2);

    this.tankgun.setRotation(angle);
  }
}