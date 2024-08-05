import Phaser from 'phaser';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('main-menu-scene');
  }

  create() {
    // Create the background and panel
    this.add.image(0,0,"bg").setOrigin(0,0);
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0);
    const panel = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, 600, 600, 0x348ceb, 0.7).setOrigin(0.5);
    const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 200, 'Missile Defense', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

    // Create buttons
    const playButton = this.createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 - 50, 'Play', () => {
      this.scene.start('play-scene');
    });
    const highScoresButton = this.createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 50, 'Leaderboard', null);
    const tutorialButton = this.createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, 'Tutorial', () => {
        this.scene.start('tutorial-scene');
      });

    // Key to start the play scene
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.stop()
      this.scene.start('play-scene');
    });
  }

  createButton(x, y, text, callback) {
    const button = this.add.image(0, 0, 'blue_button_rectangle_flat').setInteractive();
    button.setScale(1.5)
    const buttonText = this.add.text(0, 0, text, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    // Make the button click call the callback variable
    if (callback) {
      button.on('pointerdown', callback);
    }

    // Hover animation
    button.on('pointerover', () => {
      button.setTint(0x5d12f3);
      buttonText.setStyle({ fill: '#f39c12' });
    });

    // Reset hover animation
    button.on('pointerout', () => {
      button.clearTint();
      buttonText.setStyle({ fill: '#fff' });
    });

    // Create a container to hold the button and text
    const buttonContainer = this.add.container(0, 0, [button, buttonText]);
    buttonContainer.setPosition(x, y);

    return buttonContainer;
  }
}