import "../style.css";
import Phaser from "phaser";
import Missile1 from "../entities/Missile1";
import Missile2 from "../entities/Missile2";
import Missile3 from "../entities/Missile3";
import Missile4 from "../entities/Missile4";
import Bullet from "../entities/Bullet";
import UpgradeScene from "./UpgradeScene";
import CarePackage from "../entities/CarePackage";
import HealthPackage from "../entities/HealthPackage";
import Turret from "../entities/Turret";
import Tank from "../entities/Tank";

export default class PlayScene extends Phaser.Scene {
  constructor() {
    super("play-scene");
    this.tank;
    this.cursor;
    this.missile1Group;
    this.missile2Group;
    this.carePackageGroup;
    this.healthPackageGroup;
    this.bulletGroup;
    this.tankGroup;
    this.turretGroup;

    this.score;
    this.playerHealth;
    this.funds;

    this.spawns = {};

    this.sizes = {};
  }

  create() {
    this.score = 0;
    this.playerHealth = 1;
    this.funds = 10000;

    this.spawns = {
      missile1: {
        spawnInterval: 2000, // Spawn every 2 seconds
        minSpawnInterval: 500, // At most spawn every .5 seconds
        nextSpawnTimer: 2000, // First spawn in 2 seconds
        spawnRate: 1, // Spawn one at a time
        decayRate: 0.995, // Increase the spawn rate every spawn
      },
      missile2: {
        spawnInterval: 4000,
        minSpawnInterval: 1000,
        nextSpawnTimer: 30000,
        spawnRate: 1,
        decayRate: 0.995,
      },
      missile3: {
        spawnInterval: 6000,
        minSpawnInterval: 1000,
        nextSpawnTimer: 60000,
        spawnRate: 1,
        decayRate: 0.995,
      },
      missile4: {
        spawnInterval: 120000,
        minSpawnInterval: 100000,
        nextSpawnTimer: 120000,
        spawnRate: 1,
        decayRate: 0.995,
      },
      carePackage: {
        spawnInterval: 20000,
        minSpawnInterval: 4000,
        nextSpawnTimer: 20000,
        spawnRate: 1,
        decayRate: 0.993,
      },
      healthPackage: {
        spawnInterval: 5000,
        minSpawnInterval: 3000,
        nextSpawnTimer: 30000,
        spawnRate: 1,
        decayRate: 0.993,
      },
    };

    this.sizes = {
      width: 1920,
      height: 960,
    };

    this.add.image(0, 0, "bg").setOrigin(0, 0);

    // Add entity groups to scene
    this.missile1Group = this.physics.add.group({
      classType: Missile1,
      maxSize: 100,
      runChildUpdate: true,
    });

    this.missile2Group = this.physics.add.group({
      classType: Missile2,
      maxSize: 100,
      runChildUpdate: true,
    });

    this.missile3Group = this.physics.add.group({
      classType: Missile3,
      maxSize: 100,
      runChildUpdate: true,
    });

    this.missile4Group = this.physics.add.group({
      classType: Missile4,
      maxSize: 100,
      runChildUpdate: true,
    });

    this.bulletGroup = this.physics.add.group({
      classType: Bullet,
      maxSize: 1000,
      runChildUpdate: true,
    });

    this.carePackageGroup = this.physics.add.group({
      classType: CarePackage,
      maxSize: 100,
      runChildUpdate: true,
    });

    this.healthPackageGroup = this.physics.add.group({
      classType: HealthPackage,
      maxSize: 100,
      runChildUpdate: true,
    });

    this.turretGroup = this.physics.add.group({
      classType: Turret,
      maxSize: 100,
      runChildUpdate: true,
    });

    this.tankGroup = this.physics.add.group({
      classType: Tank,
      maxSize: 1,
      runChildUpdate: true,
    });

    this.tank = new Tank(this, this.sizes.width / 2, this.sizes.height - 265);
    this.tankGroup.add(this.tank, true);
    this.tank.body.setCollideWorldBounds(true);

    // Create collisions
    this.physics.add.overlap(this.missile1Group, this.bulletGroup, this.bulletMissileCollision, null, this);
    this.physics.add.overlap(this.missile2Group, this.bulletGroup, this.bulletMissileCollision, null, this);
    this.physics.add.overlap(this.carePackageGroup, this.bulletGroup, this.bulletCarePackageCollision, null, this);
    this.physics.add.overlap(this.healthPackageGroup, this.bulletGroup, this.bulletHealthPackageCollision, null, this);
    this.physics.add.overlap(this.carePackageGroup, this.tank, this.carePackageTankCollision, null, this);
    this.physics.add.overlap(this.healthPackageGroup, this.tank, this.healthPackageTankCollision, null, this);

    // Add top texts
    this.scoreText = this.add.bitmapText(this.sizes.width - 200, 20, "arcade", "Score: 0000", 24).setOrigin(0.5);

    this.healthText = this.add.bitmapText(this.sizes.width - 400, 20, "arcade", "Health: 100", 24).setOrigin(0.5);

    this.fundsText = this.add.bitmapText(this.sizes.width - 600, 20, "arcade", "Funds: 0", 24).setOrigin(0.5);

    // Add input keys
    this.input.keyboard.manager.enabled = true; // For game restarts from game over scene
    this.cursor = this.input.keyboard.addKeys("A,D, SPACE");

    // Key to trigger the upgrade scene
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.pause();
      this.scene.launch("upgrade-scene", { playScene: this, tank: this.tank }); // pass reference to this scene
    });
  }

  update(time, delta) {
    for (const missileType of Object.keys(this.spawns)) {
      this.checkMissileSpawnTimer(time, delta, missileType);
    }

    // Update text
    this.scoreText.setText("Score: " + this.score);
    this.healthText.setText("Health: " + this.playerHealth);
    this.fundsText.setText("Funds: " + this.funds);

    if (this.playerHealth < 1) {
      this.input.keyboard.manager.enabled = false;
      this.scene.pause();
      this.scene.launch("game-over-scene", { score: this.score }); // pass reference to this scene
    }
  }

  healthPackageTankCollision(tank, healthPackage) {
    console.log(healthPackage.health);
    this.playerHealth += healthPackage.health;
    healthPackage.destroy();
  }

  carePackageTankCollision(tank, carePackage) {
    carePackage.destroy();
    this.funds += carePackage.funds;
  }

  bulletCarePackageCollision(carePackage, bullet) {
    bullet.destroy();
    carePackage.parachute.setActive(false);
    carePackage.parachute.setVisible(false);
    carePackage.parachute.destroy();
    carePackage.speed = 800;
  }

  bulletHealthPackageCollision(healthPackage, bullet) {
    bullet.destroy();
    healthPackage.parachute.setActive(false);
    healthPackage.parachute.setVisible(false);
    healthPackage.parachute.destroy();
    healthPackage.speed = 800;
  }

  decrementPlayerHealth(amount) {
    this.playerHealth -= amount;
  }

  bulletMissileCollision(missile, bullet) {
    missile.health -= bullet.damage;
    bullet.destroy();
  }

  checkMissileSpawnTimer(time, delta, missileType) {
    this.spawns[missileType].nextSpawnTimer -= delta;
    if (this.spawns[missileType].nextSpawnTimer <= 0) {
      console.log(this.spawns[missileType].spawnInterval);
      this.spawnMissiles(missileType);
      this.spawns[missileType].spawnInterval = Math.max(
        this.spawns[missileType].minSpawnInterval,
        this.spawns[missileType].spawnInterval * this.spawns[missileType].decayRate
      );
      this.spawns[missileType].nextSpawnTimer = this.spawns[missileType].spawnInterval;
    }
  }

  spawnMissiles(missileType) {
    switch (missileType) {
      case "missile1":
        this.spawnMissile1();
        break;
      case "missile2":
        this.spawnMissile2();
        break;
      case "missile3":
        this.spawnMissile3();
        break;
      case "missile4":
        this.spawnMissile4();
        break;
      case "carePackage":
        this.spawnCarePackage();
        break;
      case "healthPackage":
        this.spawnHealthPackage();
        break;
    }
  }

  spawnMissile1() {
    for (let i = 0; i < this.spawns["missile1"].spawnRate; i++) {
      const missile1 = new Missile1(this, 300, 300);

      const xPos = this.getRandomX();
      const yPos = 0;
      missile1.setPosition(xPos, yPos);
      missile1.setActive(true);
      missile1.setVisible(true);

      this.missile1Group.add(missile1, true);
    }
  }

  spawnMissile2() {
    for (let i = 0; i < this.spawns["missile2"].spawnRate; i++) {
      const missile2 = new Missile2(this, 300, 300);

      const xPos = this.getRandomX();
      const yPos = 0;
      missile2.setPosition(xPos, yPos);
      missile2.setActive(true);
      missile2.setVisible(true);

      this.missile2Group.add(missile2, true);
    }
  }

  spawnMissile3() {
    for (let i = 0; i < this.spawns["missile2"].spawnRate; i++) {
      const missile2 = new Missile3(this, 300, 300);

      const xPos = this.getRandomX();
      const yPos = 0;
      missile2.setPosition(xPos, yPos);
      missile2.setActive(true);
      missile2.setVisible(true);

      this.missile2Group.add(missile2, true);
    }
  }

  spawnMissile4() {
    for (let i = 0; i < this.spawns["missile2"].spawnRate; i++) {
      const missile2 = new Missile4(this, 300, 300);

      const xPos = this.getRandomX();
      const yPos = 0;
      missile2.setPosition(xPos, yPos);
      missile2.setActive(true);
      missile2.setVisible(true);

      this.missile2Group.add(missile2, true);
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
    this.carePackageGroup.add(carePackage);
    console.log("care package funds: " + carePackage.funds);
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
    this.healthPackageGroup.add(healthPackage);
  }

  getRandomX() {
    return Math.floor(Math.random() * this.sizes.width);
  }
}
