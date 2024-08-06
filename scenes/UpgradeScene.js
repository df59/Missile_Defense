import Phaser from "phaser";
import TurretUpgradeScene from "./TurretUpgradeScene";
import Turret from "../entities/Turret";

export default class TankUpgradeScene extends Phaser.Scene {
  constructor() {
    super("upgrade-scene");
    this.playScene;
    this.tank;
  }

  init(data) {
    this.playScene = data.playScene; // Receive the PlayScene reference
    this.tank = data.tank;
  }

  create() {
    // Create the upgrade panel
    const bg = this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.6
      )
      .setOrigin(0); // Make background faded
    const panel = this.add
      .rectangle(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 50,
        600,
        800,
        0x348ceb,
        0.7
      )
      .setOrigin(0.5);
    const title = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 260,
        "Main Tank Store",
        { fontSize: "32px", fill: "#fff" }
      )
      .setOrigin(0.5);
    const header1 = this.add
      .text(
        this.cameras.main.width / 2 - 180,
        this.cameras.main.height / 2 - 200,
        "Upgrade",
        { fontSize: "32px", fill: "#fff" }
      )
      .setOrigin(0.5);
    const header2 = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 200,
        "Cost",
        { fontSize: "32px", fill: "#fff" }
      )
      .setOrigin(0.5);
    const header3 = this.add
      .text(
        this.cameras.main.width / 2 + 180,
        this.cameras.main.height / 2 - 200,
        "Tier",
        { fontSize: "32px", fill: "#fff" }
      )
      .setOrigin(0.5);

    // Create buttons
    const button1 = this.createButton(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 350,
      "Close",
      null,
      () => {
        this.scene.stop();
        this.scene.resume("play-scene");
      }
    );
    const button2 = this.createButton(
      this.cameras.main.width / 2 - 180,
      this.cameras.main.height / 2 - 130,
      "Fire Rate",
      "fire-rate",
      null
    );
    const button3 = this.createButton(
      this.cameras.main.width / 2 - 180,
      this.cameras.main.height / 2 - 60,
      "Bullet Speed",
      "bullet-speed",
      null
    );
    const button4 = this.createButton(
      this.cameras.main.width / 2 - 180,
      this.cameras.main.height / 2 + 10,
      "Bullet Damage",
      "bullet-damage",
      null
    );
    const button5 = this.createButton(
      this.cameras.main.width / 2 - 180,
      this.cameras.main.height / 2 + 80,
      "Tank Speed",
      "tank-speed",
      null
    );
    const button6 = this.createButton(
      this.cameras.main.width / 2 - 180,
      this.cameras.main.height / 2 + 150,
      "Buy Turret",
      "buy-turret",
      null
    );

    // Description textbox
    this.descriptionText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 250,
        "",
        { fontSize: "24px", fill: "#fff" }
      )
      .setOrigin(0.5);

    // Funds textbox
    this.fundsText = this.add
      .text(
        this.cameras.main.width / 2 - 200,
        this.cameras.main.height / 2 + 350,
        `Funds: ${this.playScene.funds}`,
        { fontSize: "24px", fill: "#fff" }
      )
      .setOrigin(0.5);

    // Key to trigger the upgrade scene
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.stop();
      this.scene.resume("play-scene");
    });
  }

  createButton(x, y, text, upgradeKey, callback) {
    const button = this.add
      .image(0, 0, "blue_button_rectangle_flat")
      .setInteractive();
    const buttonText = this.add
      .text(0, 0, text, { fontSize: "24px", fill: "#fff" })
      .setOrigin(0.5);

    // Set cost and tier text
    let costText, tierText;
    if (this.tank.upgrades[upgradeKey]) {
      // If not the close button
      costText = this.add
        .text(x + 180, y, `${this.tank.upgrades[upgradeKey].cost}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5);
      tierText = this.add
        .text(x + 360, y, `${this.tank.upgrades[upgradeKey].tier}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5);
    }

    // Make the button click call the callback variable
    if (this.tank.upgrades[upgradeKey]) {
      // If not the close button
      button.on("pointerdown", () => {
        this.upgrade(upgradeKey, costText, tierText);
      });
    } else {
      button.on("pointerdown", callback);
    }

    // Hover animation
    button.on("pointerover", () => {
      if (
        this.tank.upgrades[upgradeKey] &&
        this.playScene.funds < this.tank.upgrades[upgradeKey].cost
      ) {
        button.setTint(0xff0000);
        buttonText.setStyle({ fill: "#f39c12" });
      } else {
        button.setTint(0x5d12f3);
        buttonText.setStyle({ fill: "#f39c12" });
      }
      if (this.tank.upgrades[upgradeKey]) {
        this.descriptionText.setText(
          this.tank.upgrades[upgradeKey].description
        );
      }
    });

    // Reset hover animation
    button.on("pointerout", () => {
      button.clearTint();
      buttonText.setStyle({ fill: "#fff" });
    });

    // Create a container to hold the button and text
    const buttonContainer = this.add.container(0, 0, [button, buttonText]);
    buttonContainer.setPosition(x, y);

    return buttonContainer;
  }

  upgrade(option, costText, tierText) {
    switch (option) {
      case "fire-rate":
        console.log("Fire Rate selected");
        if (
          this.tank.upgrades[option] &&
          this.playScene.funds >= this.tank.upgrades[option].cost
        ) {
          this.tank.fireInterval -= 10;
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "bullet-speed":
        console.log("Bullet Speed selected");
        if (
          this.tank.upgrades[option] &&
          this.playScene.funds >= this.tank.upgrades[option].cost
        ) {
          this.tank.bulletSpeed += 100;
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "bullet-damage":
        console.log("Bullet Damage selected");
        if (
          this.tank.upgrades[option] &&
          this.playScene.funds >= this.tank.upgrades[option].cost
        ) {
          this.tank.bulletDamage += 1;
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "tank-speed":
        console.log("Tank Speed selected");
        if (
          this.tank.upgrades[option] &&
          this.playScene.funds >= this.tank.upgrades[option].cost
        ) {
          this.tank.tankSpeed += 100;
          this.playScene.funds -= this.tank.upgrades[option].cost;
          this.tank.upgrades[option].tier += 1;
        } else {
          this.descriptionText.setText("Insufficient funds.");
        }
        break;
      case "buy-turret":
        console.log("Buy Turret selected");
        if (
          this.tank.upgrades[option] &&
          this.playScene.funds >= this.tank.upgrades[option].cost
        ) {
          const turret = new Turret(
            this.playScene,
            500,
            this.playScene.sizes.height - 200
          );
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
