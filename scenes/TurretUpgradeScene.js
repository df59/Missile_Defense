import Phaser from "phaser";
import Turret from "../entities/Turret";
import Buttons from "./Buttons";

export default class TurretUpgradeScene extends Phaser.Scene {
  constructor() {
    super("turret-upgrade-scene");
    this.playScene;
    this.turret;
    this.buttons = new Buttons();
    this.midWidth;
    this.midHeight;
  }

  init(data) {
    this.playScene = data.playScene; // Receive the PlayScene reference
    this.turret = data.turret;
  }

  create() {
    this.midWidth = this.cameras.main.width / 2;
    this.midHeight = this.cameras.main.height / 2;
    // Create the upgrade panel
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0); // Make background faded
    const panel = this.add.rectangle(this.midWidth, this.midHeight, 600, 600, 0x348ceb, 0.7).setOrigin(0.5);
    const title = this.add
      .text(this.midWidth, this.midHeight - 260, "Turret Upgrade Store", { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);
    const header1 = this.add.text(this.midWidth - 180, this.midHeight - 200, "Upgrade", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    const header2 = this.add.text(this.midWidth, this.midHeight - 200, "Cost", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    const header3 = this.add.text(this.midWidth + 180, this.midHeight - 200, "Tier", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);

    // Create buttons
    const button1 = this.buttons.createUpgradeButton(this, this.turret, this.midWidth, this.midHeight + 250, "Close", null, () => {
      this.scene.stop();
      this.scene.switch("upgrade-scene");
    });
    const button2 = this.buttons.createUpgradeButton(
      this,
      this.turret,
      this.midWidth - 180,
      this.midHeight - 130,
      "Fire Rate",
      "fire-rate",
      null
    );
    const button3 = this.buttons.createUpgradeButton(
      this,
      this.turret,
      this.midWidth - 180,
      this.midHeight - 60,
      "Bullet Speed",
      "bullet-speed",
      null
    );
    const button4 = this.buttons.createUpgradeButton(
      this,
      this.turret,
      this.midWidth - 180,
      this.midHeight + 10,
      "Bullet Damage",
      "bullet-damage",
      null
    );
    const button5 = this.buttons.createUpgradeButton(
      this,
      this.turret,
      this.midWidth - 100,
      this.midHeight + 80,
      "Point Mode",
      null,
      () => {
        this.descriptionText.setText("Turret will now fire at the set location.");
        this.scene.setVisible(false);
        this.scene.pause();
        this.scene.launch("point-mode-scene", {
          playScene: this.playScene,
          turret: this.turret,
        });
      }
    );
    const button6 = this.buttons.createUpgradeButton(
      this,
      this.turret,
      this.midWidth + 100,
      this.midHeight + 80,
      "Follow Mode",
      null,
      () => {
        this.descriptionText.setText("Turret will now fire at your cursor.");
        this.turret.currentMode = this.turret.modes.FOLLOW;
      }
    );

    // Description textbox
    this.descriptionText = this.add.text(this.midWidth, this.midHeight + 150, "", { fontSize: "24px", fill: "#fff" }).setOrigin(0.5);

    // Funds textbox
    this.fundsText = this.add
      .text(this.midWidth - 200, this.midHeight + 250, `Funds: ${this.playScene.funds}`, {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Key to trigger the upgrade scene
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.stop();
      this.scene.switch("upgrade-scene");
    });
  }

  upgrade(option, costText, tierText) {
    switch (option) {
      case "fire-rate":
        console.log("Fire Rate selected");
        if (this.turret.upgrades[option] && this.playScene.funds >= this.turret.upgrades[option].cost) {
          this.turret.fireInterval -= 10;
          this.playScene.funds -= this.turret.upgrades[option].cost;
          this.turret.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "bullet-speed":
        console.log("Bullet Speed selected");
        if (this.turret.upgrades[option] && this.playScene.funds >= this.turret.upgrades[option].cost) {
          this.turret.bulletSpeed += 100;
          this.playScene.funds -= this.turret.upgrades[option].cost;
          this.turret.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "bullet-damage":
        console.log("Bullet Damage selected");
        if (this.turret.upgrades[option] && this.playScene.funds >= this.turret.upgrades[option].cost) {
          this.turret.bulletDamage += 1;
          this.playScene.funds -= this.turret.upgrades[option].cost;
          this.turret.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      default:
        console.log("Unknown upgrade option");
        break;
    }
    // Update texts
    costText.setText(`${this.turret.upgrades[option].cost}`);
    tierText.setText(`${this.turret.upgrades[option].tier}`);
    this.updateFundsText();
  }

  updateFundsText() {
    this.fundsText.setText(`Funds: ${this.playScene.funds}`);
  }
}
