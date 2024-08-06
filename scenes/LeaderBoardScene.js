import Phaser from "phaser";
import Buttons from "./Buttons";

export default class LeaderBoardScene extends Phaser.Scene {
  constructor() {
    super("leaderboard-scene");
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
    const title = this.add.text(this.midWidth, this.midHeight - 250, "Leaderboard", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);

    this.displayHighScores();

    // Create a back button
    const backButton = this.buttons.createButton(this, this.midWidth, this.midHeight + 250, "Back", () => {
      this.scene.start("main-menu-scene");
    });

    // Add numbers for ranks
    for (let i = 1; i < 11; i++) {
      this.add.text(this.midWidth - 150, this.midHeight - 240 + i * 40, i + ")", { fontSize: "24px", fill: "#fff" }).setOrigin(0.5);
    }
  }

  displayHighScores() {
    // Retrieve and display high scores

    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    // Sort scores in descending order
    const topScores = highScores.sort((a, b) => b.score - a.score).slice(0, 10);

    // Display high scores
    topScores.forEach((score, index) => {
      this.add
        .text(this.midWidth, this.midHeight - 200 + index * 40, `${score.name}: ${score.score}`, {
          fontSize: "24px",
          fill: "#fff",
        })
        .setOrigin(0.5);
    });
  }
}
