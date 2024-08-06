import Phaser from "phaser";
import Buttons from "./Buttons";

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super("main-menu-scene");
    this.buttons = new Buttons();
    this.midWidth;
    this.midHeight;
  }

  create() {
    this.midWidth = this.cameras.main.width / 2;
    this.midHeight = this.cameras.main.height / 2;
    // Create the background and panel
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);
    const panel = this.add.rectangle(this.midWidth, this.midHeight, 600, 600, 0x348ceb, 0.7).setOrigin(0.5);
    const title = this.add.text(this.midWidth, this.midHeight - 200, "Missile Defense", { fontSize: "48px", fill: "#fff" }).setOrigin(0.5);

    // Create buttons
    const playButton = this.buttons.createButton(this, this.midWidth, this.midHeight - 50, "Play", () => {
      this.scene.start("play-scene");
    });
    const highScoresButton = this.buttons.createButton(this, this.midWidth, this.midHeight + 50, "Leaderboard", () => {
      this.scene.start("leaderboard-scene");
    });
    const tutorialButton = this.buttons.createButton(this, this.midWidth, this.midHeight + 150, "Tutorial", () => {
      this.scene.start("tutorial-scene");
    });

    // Key to start the play scene
    this.input.keyboard.on("keydown-SPACE", () => {
      this.scene.stop();
      this.scene.start("play-scene");
    });
  }
}
