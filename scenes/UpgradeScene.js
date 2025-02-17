import Phaser from "phaser";
import TurretUpgradeScene from "./TurretUpgradeScene";
import Turret from "../entities/Turret";
import Buttons from "./Buttons";

export default class TankUpgradeScene extends Phaser.Scene {
  constructor() {
    super("upgrade-scene");
    this.playScene;
    this.tank;
    this.buttons = new Buttons();
    this.midWidth;
    this.midHeight;
  }

  init(data) {
    this.playScene = data.playScene; // Receive the PlayScene reference
    this.tank = data.tank;
  }

  create() {
    this.midWidth = this.cameras.main.width / 2;
    this.midHeight = this.cameras.main.height / 2;
    // Create the upgrade panel
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0); // Make background faded
    const panel = this.add.rectangle(this.midWidth, this.midHeight + 50, 600, 800, 0x348ceb, 0.7).setOrigin(0.5);
    const title = this.add.text(this.midWidth, this.midHeight - 260, "Main Tank Store", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    const header1 = this.add.text(this.midWidth - 180, this.midHeight - 200, "Upgrade", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    const header2 = this.add.text(this.midWidth, this.midHeight - 200, "Cost", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    const header3 = this.add.text(this.midWidth + 180, this.midHeight - 200, "Tier", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);

    // Create buttons
    const closeButton = this.buttons.createUpgradeButton(this, this.tank, this.midWidth, this.midHeight + 350, "Close", null, () => {
      this.scene.stop();
      this.scene.resume("play-scene");
    });
    const fireRateButton = this.buttons.createUpgradeButton(
      this,
      this.tank,
      this.midWidth - 180,
      this.midHeight - 130,
      "Fire Rate",
      "fire-rate",
      null
    );
    const bulletSpeedButton = this.buttons.createUpgradeButton(
      this,
      this.tank,
      this.midWidth - 180,
      this.midHeight - 60,
      "Bullet Speed",
      "bullet-speed",
      null
    );
    const bulletDamageButton = this.buttons.createUpgradeButton(
      this,
      this.tank,
      this.midWidth - 180,
      this.midHeight + 10,
      "Bullet Damage",
      "bullet-damage",
      null
    );
    const tankSpeedButton = this.buttons.createUpgradeButton(
      this,
      this.tank,
      this.midWidth - 180,
      this.midHeight + 80,
      "Tank Speed",
      "tank-speed",
      null
    );
    const buyTurretButton = this.buttons.createUpgradeButton(
      this,
      this.tank,
      this.midWidth - 180,
      this.midHeight + 150,
      "Buy Turret",
      "buy-turret",
      null
    );

    // Description textbox
    this.descriptionText = this.add.text(this.midWidth, this.midHeight + 250, "", { fontSize: "24px", fill: "#fff" }).setOrigin(0.5);

    // Funds textbox
    this.fundsText = this.add
      .text(this.midWidth - 200, this.midHeight + 350, `Funds: ${this.playScene.funds}`, {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Key to trigger the upgrade scene
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.stop();
      this.scene.resume("play-scene");
    });
  }

  upgrade(option, costText, tierText) {
    switch (option) {
      case "fire-rate":
        console.log("Fire Rate selected");
        if (this.tank.upgrades[option] && this.playScene.funds >= this.tank.upgrades[option].cost) {
          this.tank.fireInterval -= 10;
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "bullet-speed":
        console.log("Bullet Speed selected");
        if (this.tank.upgrades[option] && this.playScene.funds >= this.tank.upgrades[option].cost) {
          this.tank.bulletSpeed += 100;
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "bullet-damage":
        console.log("Bullet Damage selected");
        if (this.tank.upgrades[option] && this.playScene.funds >= this.tank.upgrades[option].cost) {
          this.tank.bulletDamage += 1;
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "tank-speed":
        console.log("Tank Speed selected");
        if (this.tank.upgrades[option] && this.playScene.funds >= this.tank.upgrades[option].cost) {
          this.tank.tankSpeed += 100;
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "buy-turret":
        console.log("Buy Turret selected");
        if (this.tank.upgrades[option] && this.playScene.funds >= this.tank.upgrades[option].cost) {
          const turret = new Turret(this.playScene, 500, this.playScene.sizes.height - 200);
          this.playScene.turretGroup.add(turret, true);
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
          this.scene.setVisible(false);
          this.scene.stop();
          this.scene.launch("turret-upgrade-scene", {
            playScene: this.playScene,
            turret: turret,
          }); // pass reference to this scene
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      default:
        console.log("Unknown upgrade option");
        break;
    }
    // Update texts
    costText.setText(`${this.tank.upgrades[option].cost}`);
    tierText.setText(`${this.tank.upgrades[option].tier}`);
    this.fundsText.setText(`Funds: ${this.playScene.funds}`);
  }
}
