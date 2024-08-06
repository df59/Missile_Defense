import Phaser from "phaser";

export default class Buttons {
  constructor() {}

  createButton(inputScene, x, y, text, callback) {
    const button = inputScene.add.image(0, 0, "blue_button_rectangle_flat").setInteractive();
    button.setScale(1.5);
    const buttonText = inputScene.add.text(0, 0, text, { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);

    // Make the button click call the callback variable
    if (callback) {
      button.on("pointerdown", callback);
    }

    // Hover animation
    button.on("pointerover", () => {
      button.setTint(0x5d12f3);
      buttonText.setStyle({ fill: "#f39c12" });
    });

    // Reset hover animation
    button.on("pointerout", () => {
      button.clearTint();
      buttonText.setStyle({ fill: "#fff" });
    });

    // Create a container to hold the button and text
    const buttonContainer = inputScene.add.container(0, 0, [button, buttonText]);
    buttonContainer.setPosition(x, y);

    return buttonContainer;
  }

  createUpgradeButton(inputScene, item, x, y, text, upgradeKey, callback) {
    const button = inputScene.add.image(0, 0, "blue_button_rectangle_flat").setInteractive();
    const buttonText = inputScene.add.text(0, 0, text, { fontSize: "24px", fill: "#fff" }).setOrigin(0.5);

    // Set cost and tier text
    let costText, tierText;
    if (item.upgrades[upgradeKey]) {
      // If not the close button
      costText = inputScene.add
        .text(x + 180, y, `${item.upgrades[upgradeKey].cost}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5);
      tierText = inputScene.add
        .text(x + 360, y, `${item.upgrades[upgradeKey].tier}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5);
    }

    // Make the button interactive
    if (item.upgrades[upgradeKey]) {
      // If not the close button
      button.on("pointerdown", () => {
        inputScene.upgrade(upgradeKey, costText, tierText);
      });
    } else {
      button.on("pointerdown", callback);
    }

    // Hover animation
    button.on("pointerover", () => {
      if (item.upgrades[upgradeKey] && inputScene.playScene.funds < item.upgrades[upgradeKey].cost) {
        button.setTint(0xff0000);
        buttonText.setStyle({ fill: "#f39c12" });
      } else {
        button.setTint(0x5d12f3);
        buttonText.setStyle({ fill: "#f39c12" });
      }
      if (item.upgrades[upgradeKey]) {
        inputScene.descriptionText.setText(item.upgrades[upgradeKey].description);
      }
    });

    // Reset hover animation
    button.on("pointerout", () => {
      button.clearTint();
      buttonText.setStyle({ fill: "#fff" });
    });

    // Create a container to hold the button and text
    const buttonContainer = inputScene.add.container(0, 0, [button, buttonText]);
    buttonContainer.setPosition(x, y);

    return buttonContainer;
  }
}
