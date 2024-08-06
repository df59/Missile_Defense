import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over-scene");
  }

  init(data) {
    this.score = data.score; // Receive the score from PlayScene
  }

  create() {
    // Create the game over panel
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
        "Game Over",
        { fontSize: "32px", fill: "#fff" }
      )
      .setOrigin(0.5);

    // Display the score
    const scoreText = this.add
      .text(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 - 150,
        `Your Score: ${this.score}`,
        { fontSize: "24px", fill: "#fff" }
      )
      .setOrigin(0.5);

    // Create input box for the player's name
    this.nameInput = this.add
      .dom(this.cameras.main.width / 2, this.cameras.main.height / 2)
      .createFromCache("nameform");

    // Create buttons
    const mainMenuButton = this.createButton(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 180,
      "Main Menu",
      () => {
        this.scene.start("main-menu-scene");
      }
    );

    const submitButton = this.createButton(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 100,
      "Submit Score",
      () => {
        let playerName = this.nameInput.getChildByName("name").value.trim();

        if (playerName === "" || playerName.length > 10) {
          alert("Please enter a valid name (1-10 characters).");
          return;
        }

        console.log(`Player Name: ${playerName}, Score: ${this.score}`);
        this.submitScore(playerName, this.score);
        this.scene.start("main-menu-scene");
      }
    );
  }

  createButton(x, y, text, callback) {
    const button = this.add
      .image(0, 0, "blue_button_rectangle_flat")
      .setInteractive();
    const buttonText = this.add
      .text(0, 0, text, { fontSize: "24px", fill: "#fff" })
      .setOrigin(0.5);

    button.on("pointerdown", callback);

    // Create a container to hold the button and text
    const buttonContainer = this.add.container(0, 0, [button, buttonText]);
    buttonContainer.setPosition(x, y);

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

    return buttonContainer;
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
