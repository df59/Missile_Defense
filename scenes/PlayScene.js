import '../style.css'
import Phaser from 'phaser'
import Missile1 from '../entities/Missile1'
import Bullet from '../entities/Bullet'
import UpgradeScene from './UpgradeScene'
import CarePackage from '../entities/CarePackage'
import HealthPackage from '../entities/HealthPackage'
import Turret from '../entities/Turret'
import Tank from '../entities/Tank'

const initialTankSpeed = 250;
const initialSpeedDown = 300;
const maxTargets = 10;

export default class PlayScene extends Phaser.Scene {

  constructor(){
    super('play-scene')
    this.tank;
    this.cursor;
    this.missile1Group;
    this.spawnInterval = 1000;
    this.spawnRate = 1;
    this.nextSpawnTimer = 2000;
    this.score = 0;
    this.playerHealth = 100;
    this.funds = 10000;
    this.nextCarePackageTimer = 2000;
    this.carePackageSpawnInterval = 10000;
    this.nextHealthPackageTimer = 2000;
    this.healthPackageSpawnInterval = 10000;

    this.sizes={
        width:1920,
        height:960,
      }
  }

  preload() {
  }

  create() {
    
    this.add.image(0,0,"bg").setOrigin(0,0);

    this.missile1Group = this.physics.add.group({
        classType: Missile1,
        maxSize: 100,
        runChildUpdate: true
    })

    this.bulletGroup = this.physics.add.group({
        classType: Bullet,
        maxSize: 1000,
        runChildUpdate: true
      })

    this.carePackageGroup = this.physics.add.group({
        classType: CarePackage,
        maxSize: 100,
        runChildUpdate: true
    })

    this.healthPackageGroup = this.physics.add.group({
        classType: HealthPackage,
        maxSize: 100,
        runChildUpdate: true
    })

    this.turretGroup = this.physics.add.group({
        classType: Turret,
        maxSize: 100,
        runChildUpdate: true
    })

    this.tankGroup = this.physics.add.group({
        classType: Tank,
        maxSize: 1,
        runChildUpdate: true
    })

    this.tank = new Tank(this, this.sizes.width / 2, this.sizes.height - 265)
    this.tankGroup.add(this.tank, true)
    this.tank.body.setCollideWorldBounds(true);



    this.cursor = this.input.keyboard.addKeys("W,A,S,D, SPACE");


    // Create collisions
    this.physics.add.overlap(this.missile1Group, this.bulletGroup, this.bulletMissile1Collision, null, this);
    this.physics.add.overlap(this.carePackageGroup, this.bulletGroup, this.bulletCarePackageCollision, null, this);
    this.physics.add.overlap(this.healthPackageGroup, this.bulletGroup, this.bulletHealthPackageCollision, null, this);
    this.physics.add.overlap(this.carePackageGroup, this.tank, this.carePackageTankCollision, null, this);
    this.physics.add.overlap(this.healthPackageGroup, this.tank, this.healthPackageTankCollision, null, this);

    // Add top texts
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
    this.input.keyboard.on('keydown-SPACE', () => {
        this.scene.pause();
        this.scene.launch('upgrade-scene', { playScene: this, tank: this.tank }); // pass reference to this scene
      });

  }

  update(time, delta){

    this.checkMissileSpawnTimer(time, delta)
    this.checkCarePackageSpawnTimer(time, delta)
    this.checkHealthPackageSpawnTimer(time, delta)

    // Update text
    this.scoreText.setText('Score: ' + this.score)
    this.healthText.setText('Health: ' + this.playerHealth)
    this.fundsText.setText('Funds: ' + this.funds)

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

  bulletMissile1Collision(missile1, bullet) {
    missile1.health -= bullet.damage;
    bullet.destroy()
  }

  checkMissileSpawnTimer(time, delta) {
    // Decrease the missile spawn timer
    this.nextSpawnTimer -= delta;
    if (this.nextSpawnTimer <= 0) {
        this.spawnMissiles();
        this.spawnInterval *= .999
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
      }
  }

  getRandomX() {
    return Math.floor(Math.random() * this.sizes.width)
  }

}