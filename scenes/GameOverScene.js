import Phaser from "phaser";
import Buttons from "./Buttons";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over-scene");
    this.buttons = new Buttons();
    this.midWidth;
    this.midHeight;
  }

  init(data) {
    this.score = data.score; // Receive the score from PlayScene
  }

  create() {
    this.midWidth = this.cameras.main.width / 2;
    this.midHeight = this.cameras.main.height / 2;
    // Create the game over panel
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0); // Make background faded
    const panel = this.add.rectangle(this.midWidth, this.midHeight, 600, 600, 0x348ceb, 0.7).setOrigin(0.5);
    const title = this.add.text(this.midWidth, this.midHeight - 250, "Game Over", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);

    // Display the score
    const scoreText = this.add
      .text(this.midWidth, this.midHeight - 150, `Your Score: ${this.score}`, {
        fontSize: "24px",
        fill: "#fff",
      })
      .setOrigin(0.5);

    // Create input box for the player's name
    this.nameInput = this.add.dom(this.midWidth, this.midHeight).createFromCache("nameform");

    // Create buttons
    const mainMenuButton = this.buttons.createButton(this, this.midWidth, this.midHeight + 210, "Main Menu", () => {
      this.scene.start("main-menu-scene");
    });

    const submitButton = this.buttons.createButton(this, this.midWidth, this.midHeight + 100, "Submit Score", () => {
      let playerName = this.nameInput.getChildByName("name").value.trim();

      if (playerName === "" || playerName.length > 10) {
        alert("Please enter a valid name (1-10 characters).");
        return;
      }

      console.log(`Player Name: ${playerName}, Score: ${this.score}`);
      this.submitScore(playerName, this.score);
      this.scene.start("main-menu-scene");
    });
  }

  submitScore(playerName, score) {
    // Load existing leaderboard or create a new one
    let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    // Add new score to the leaderboard
    highScores.push({ name: playerName, score: score });

    // Sort leaderboard by score in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Save updated leaderboard to LocalStorage
    localStorage.setItem("highScores", JSON.stringify(highScores));
  }
}
