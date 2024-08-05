import Phaser from 'phaser';

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super('tutorial-scene');
  }

  create() {
    this.add.image(0,0,"bg").setOrigin(0,0);
    // Create the tutorial panel
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.6).setOrigin(0); // Make background faded
    const panel = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, 1400, 800, 0x348ceb, 0.7).setOrigin(0.5);
    const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 360, 'Tutorial', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    // Add images and descriptions
    const tutorialImage1 = this.add.image(this.cameras.main.width / 2 - 400, this.cameras.main.height / 2 - 300, 'tank')
    tutorialImage1.setScale(.5)
    const description1 = this.add.text(this.cameras.main.width / 2 - 250, this.cameras.main.height / 2 - 300, 'Move your tank left and right with A and D.', { fontSize: '24px', fill: '#fff' })

    const tutorialImage2 = this.add.image(this.cameras.main.width / 2 - 450, this.cameras.main.height / 2 - 200, 'missile1')
    tutorialImage2.setScale(.7)
    const tutorialImage3 = this.add.image(this.cameras.main.width / 2 - 400, this.cameras.main.height / 2 - 200, 'missile2')
    tutorialImage3.setScale(.5)
    const description2 = this.add.text(this.cameras.main.width / 2 - 250, this.cameras.main.height / 2 - 200, 'Different missiles will fall from the sky.', { fontSize: '24px', fill: '#fff' })

    const tutorialImage4 = this.add.image(this.cameras.main.width / 2 - 400, this.cameras.main.height / 2 - 100, 'bullet')
    tutorialImage4.setScale(1)
    const description3 = this.add.text(this.cameras.main.width / 2 - 250, this.cameras.main.height / 2 - 100, 'Click to shoot them down before they land and reduce your health!', { fontSize: '24px', fill: '#fff' })


    const tutorialImage5 = this.add.image(this.cameras.main.width / 2 - 470, this.cameras.main.height / 2, 'heart')
    tutorialImage5.setScale(.5)
    const tutorialImage6 = this.add.image(this.cameras.main.width / 2 - 400, this.cameras.main.height / 2, 'carePackage')
    tutorialImage6.setScale(.3)
    const description4 = this.add.text(this.cameras.main.width / 2 - 250, this.cameras.main.height / 2, 'Collect money and health powerups on the ground.', { fontSize: '24px', fill: '#fff' })
    const description5 = this.add.text(this.cameras.main.width / 2 - 250, this.cameras.main.height / 2 + 100, 'Press Spacebar to pause and access upgrades and turrets.', { fontSize: '24px', fill: '#fff' })
    const tutorialImage7 = this.add.image(this.cameras.main.width / 2 - 400, this.cameras.main.height / 2 + 200, 'turret')
    tutorialImage7.setScale(1)
    const description6 = this.add.text(this.cameras.main.width / 2 - 250, this.cameras.main.height / 2 + 200, 'Click and drag to move turrets. Double click it for upgrades.', { fontSize: '24px', fill: '#fff' })


    // Create a back button to return to the main menu
    const backButton = this.createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 300, 'Back', () => {
      this.scene.start('main-menu-scene');
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