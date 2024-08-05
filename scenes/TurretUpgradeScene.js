import Phaser from 'phaser';
import Turret from '../entities/Turret';

export default class TurretUpgradeScene extends Phaser.Scene {
  constructor() {
    super('turret-upgrade-scene');
    this.playScene;
    this.turret;
    }

  init(data) {
    this.playScene = data.playScene; // Receive the PlayScene reference
    this.turret = data.turret;
  }

  create() {
    // Create the upgrade panel
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, .6).setOrigin(0); // Make background faded
    const panel = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, 600, 600, 0x348ceb, .7).setOrigin(0.5);
    const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 260, 'Turret Upgrade Store', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const header1 = this.add.text(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 - 200, 'Upgrade', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const header2 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 200, 'Cost', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const header3 = this.add.text(this.cameras.main.width / 2 + 180, this.cameras.main.height / 2 - 200, 'Tier', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    // Create buttons
    const button1 = this.createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 250, 'Close', null, () => {
        this.scene.stop();
        this.scene.resume('play-scene');
      });
    const button2 = this.createButton(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 - 130, 'Fire Rate', 'fire-rate', null);
    const button3 = this.createButton(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 - 60, 'Bullet Speed', 'bullet-speed', null);
    const button4 = this.createButton(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 + 10, 'Bullet Damage', 'bullet-damage', null);
    const button5 = this.createButton(this.cameras.main.width / 2 - 100, this.cameras.main.height / 2 + 80, 'Point Mode', null, () => {
        this.descriptionText.setText("Point mode selected.")
        this.scene.setVisible(false);
        this.scene.pause();
        this.scene.launch('point-mode-scene', { playScene: this.playScene, turret: this.turret });
      });
    const button6 = this.createButton(this.cameras.main.width / 2 + 100, this.cameras.main.height / 2 + 80, 'Follow Mode', null, () => {
        this.descriptionText.setText("Follow mode selected.")
        this.turret.currentMode = this.turret.modes.FOLLOW
    });


    // Description textbox
    this.descriptionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, '', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

    // Funds textbox
    this.fundsText = this.add.text(this.cameras.main.width / 2 - 200, this.cameras.main.height / 2 + 250, `Funds: ${this.playScene.funds}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
  }

  createButton(x, y, text, upgradeKey, callback) {
    const button = this.add.image(0, 0, 'blue_button_rectangle_flat').setInteractive();
    const buttonText = this.add.text(0, 0, text, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

    // Set cost and tier text
    let costText, tierText
    if(this.turret.upgrades[upgradeKey]) { // If not the close button
        costText = this.add.text(x + 180, y, `${this.turret.upgrades[upgradeKey].cost}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        tierText = this.add.text(x + 360, y, `${this.turret.upgrades[upgradeKey].tier}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    }

    // Make the button interactive
    if(this.turret.upgrades[upgradeKey]) {  // If not the close button
        button.on('pointerdown', () => {
                this.upgrade(upgradeKey, costText, tierText);
        });
        } else {
            button.on('pointerdown', callback);
        }

    // Hover animation
    button.on('pointerover', () => {
        if(this.turret.upgrades[upgradeKey] && this.playScene.funds < this.turret.upgrades[upgradeKey].cost) {
            button.setTint(0xff0000);
            buttonText.setStyle({ fill: '#f39c12' });
        } else {
            button.setTint(0x5d12f3);
            buttonText.setStyle({ fill: '#f39c12' });    
        }
        if(this.turret.upgrades[upgradeKey]) {
            this.descriptionText.setText(this.turret.upgrades[upgradeKey].description);
        }
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

  upgrade(option, costText, tierText) {
    switch(option) {
    case 'fire-rate':
        console.log('Fire Rate selected');
        if(this.turret.upgrades[option] && this.playScene.funds >= this.turret.upgrades[option].cost) {
            this.turret.fireInterval -= 10;
            this.playScene.funds -= this.turret.upgrades[option].cost;
            this.turret.upgrades[option].tier += 1;
        } else {
            this.descriptionText.setText("Insufficient funds.")
        }
        break;
    case 'bullet-speed':
        console.log('Bullet Speed selected');
        if(this.turret.upgrades[option] && this.playScene.funds >= this.turret.upgrades[option].cost) {
            this.turret.bulletSpeed += 100;
            this.playScene.funds -= this.turret.upgrades[option].cost;
            this.turret.upgrades[option].tier += 1;
        } else {
            this.descriptionText.setText("Insufficient funds.")
        }
        break;
    default:
        console.log('Unknown upgrade option');
        break;
    }
    // Update texts
    costText.setText(`${this.turret.upgrades[option].cost}`);
    tierText.setText(`${this.turret.upgrades[option].tier}`);
    this.updateFundsText();
  }

  updateFundsText() {
    this.fundsText.setText(`Funds: ${this.playScene.funds}`);
  }

}