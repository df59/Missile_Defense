import Phaser from "phaser";

export default class LeaderBoardScene extends Phaser.Scene {
  constructor() {
    super("leaderboard-scene");
  }

  create() {
    // Create the background and panel
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    const bg = this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.6
      )
      .setOrigin(0);
    const panel = this.add
      .rectangle(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        600,
        600,
        0x348ceb,
        0.7
      )
      .setOrigin(0.5);
    const title = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 250,
        "Leaderboard",
        { fontSize: "32px", fill: "#fff" }
      )
      .setOrigin(0.5);

    this.displayHighScores();

    // Create a back button
    const backButton = this.createButton(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 250,
      "Back",
      () => {
        this.scene.start("main-menu-scene");
      }
    );
  }

  createButton(x, y, text, callback) {
    const button = this.add
      .image(0, 0, "blue_button_rectangle_flat")
      .setInteractive();
    button.setScale(1.5);
    const buttonText = this.add
      .text(0, 0, text, { fontSize: "32px", fill: "#fff" })
      .setOrigin(0.5);

    button.on("pointerdown", callback);

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
    const buttonContainer = this.add.container(0, 0, [button, buttonText]);
    buttonContainer.setPosition(x, y);

    // Add numbers for ranks
    for (let i = 1; i < 11; i++) {
      this.add
        .text(
          this.cameras.main.width / 2 - 150,
          this.cameras.main.height / 2 - 240 + i * 40,
          i + ")",
          { fontSize: "24px", fill: "#fff" }
        )
        .setOrigin(0.5);
    }

    return buttonContainer;
  }

  displayHighScores() {
    // Retrieve and display high scores

    const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    // Sort scores in descending order
    const topScores = highScores.sort((a, b) => b.score - a.score).slice(0, 10);

    // Display high scores
    topScores.forEach((score, index) => {
      this.add
        .text(
          this.cameras.main.width / 2,
          this.cameras.main.height / 2 - 200 + index * 40,
          `${score.name}: ${score.score}`,
          { fontSize: "24px", fill: "#fff" }
        )
        .setOrigin(0.5);
    });
  }
}
