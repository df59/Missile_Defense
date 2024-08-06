import Phaser from "phaser";
import Buttons from "./Buttons";

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super("tutorial-scene");
    this.buttons = new Buttons();
    this.midWidth;
    this.midHeight;
  }

  create() {
    this.midWidth = this.cameras.main.width / 2;
    this.midHeight = this.cameras.main.height / 2;

    this.add.image(0, 0, "bg").setOrigin(0, 0);
    // Create the tutorial panel
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0); // Make background faded
    const panel = this.add.rectangle(this.midWidth, this.midHeight, 1400, 800, 0x348ceb, 0.7).setOrigin(0.5);
    const title = this.add.text(this.midWidth, this.midHeight - 360, "Tutorial", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);

    // Add images and descriptions
    const tutorialImage1 = this.add.image(this.midWidth - 400, this.midHeight - 300, "tank");
    tutorialImage1.setScale(0.5);
    const description1 = this.add.text(this.midWidth - 250, this.midHeight - 300, "Move your tank left and right with A and D.", {
      fontSize: "24px",
      fill: "#fff",
    });

    const tutorialImage2 = this.add.image(this.midWidth - 450, this.midHeight - 200, "missile1");
    tutorialImage2.setScale(0.7);
    const tutorialImage3 = this.add.image(this.midWidth - 400, this.midHeight - 200, "missile2");
    tutorialImage3.setScale(0.5);
    const description2 = this.add.text(this.midWidth - 250, this.midHeight - 200, "Different missiles will fall from the sky.", {
      fontSize: "24px",
      fill: "#fff",
    });

    const tutorialImage4 = this.add.image(this.midWidth - 400, this.midHeight - 100, "bullet");
    tutorialImage4.setScale(1);
    const description3 = this.add.text(
      this.midWidth - 250,
      this.midHeight - 100,
      "Click to shoot them down before they land and reduce your health!",
      { fontSize: "24px", fill: "#fff" }
    );

    const tutorialImage5 = this.add.image(this.midWidth - 470, this.midHeight, "heart");
    tutorialImage5.setScale(0.5);
    const tutorialImage6 = this.add.image(this.midWidth - 400, this.midHeight, "carePackage");
    tutorialImage6.setScale(0.3);
    const description4 = this.add.text(this.midWidth - 250, this.midHeight, "Collect money and health powerups on the ground.", {
      fontSize: "24px",
      fill: "#fff",
    });
    const description5 = this.add.text(
      this.midWidth - 250,
      this.midHeight + 100,
      "Press Spacebar to pause and access upgrades and turrets.",
      { fontSize: "24px", fill: "#fff" }
    );
    const tutorialImage7 = this.add.image(this.midWidth - 400, this.midHeight + 200, "turret");
    tutorialImage7.setScale(1);
    const description6 = this.add.text(
      this.midWidth - 250,
      this.midHeight + 200,
      "Click and drag to move turrets. Double click it for upgrades.",
      { fontSize: "24px", fill: "#fff" }
    );

    // Create a back button to return to the main menu
    const backButton = this.buttons.createButton(this, this.midWidth, this.midHeight + 300, "Back", () => {
      this.scene.start("main-menu-scene");
    });
  }
}
