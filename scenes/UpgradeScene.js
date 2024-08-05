import Phaser from 'phaser';
import TurretScene from './TurretScene';
import Turret from '../entities/Turret';

export default class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('upgrade-scene');
    this.playScene;
    this.upgrades = {
        'fire-rate': { cost: 100, description: 'Increase bullet fire rate.', tier: 0 },
        'bullet-speed': { cost: 150, description: 'Increase bullet speed.', tier: 0 },
        'tank-speed': { cost: 200, description: 'Increase tank movement speed.', tier: 0 },
        'buy-turret': { cost: 500, description: 'Buy a turret that auto fires.', tier: 0 }

      };  
    }

  init(data) {
    this.playScene = data.playScene; // Receive the PlayScene reference
  }

  create() {
    // Create the upgrade panel
    const bg = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, .6).setOrigin(0); // Make background faded
    const panel = this.add.rectangle(this.cameras.main.width / 2, this.cameras.main.height / 2, 600, 600, 0x348ceb, .5).setOrigin(0.5);
    const title = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 260, 'Upgrades', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const header1 = this.add.text(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 - 200, 'Upgrade', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const header2 = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 200, 'Cost', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const header3 = this.add.text(this.cameras.main.width / 2 + 180, this.cameras.main.height / 2 - 200, 'Tier', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    const header5 = this.add.text(this.cameras.main.width / 2 + 180, this.cameras.main.height / 2 - 200, 'Tier', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

    


    // Create buttons
    const button1 = this.createButton(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 - 130, 'Fire Rate', 'fire-rate', null);
    const button2 = this.createButton(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 - 60, 'Bullet Speed', 'bullet-speed', null);
    const button3 = this.createButton(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 + 10, 'Tank Speed', 'tank-speed', null);
    const button4 = this.createButton(this.cameras.main.width / 2, this.cameras.main.height / 2 + 250, 'Close', null, () => {
      this.scene.stop();
      this.scene.resume('play-scene');
    });

    const button5 = this.createButton(this.cameras.main.width / 2 - 180, this.cameras.main.height / 2 + 80, 'Buy Turret', 'buy-turret', null);

    // Description textbox
    this.descriptionText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 150, '', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

    // Funds textbox
    this.fundsText = this.add.text(this.cameras.main.width / 2 - 200, this.cameras.main.height / 2 + 250, `Funds: ${this.playScene.funds}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        
    // // Add buttons to the scene
    // this.add.existing(button1);
    // this.add.existing(button2);
    // this.add.existing(button3);
  }

  createButton(x, y, text, upgradeKey, callback) {
    const button = this.add.image(0, 0, 'blue_button_rectangle_flat').setInteractive();
    const buttonText = this.add.text(0, 0, text, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

    // Set cost and tier text
    let costText, tierText
    if(this.upgrades[upgradeKey]) { // If not the close button
        costText = this.add.text(x + 180, y, `${this.upgrades[upgradeKey].cost}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
        tierText = this.add.text(x + 360, y, `${this.upgrades[upgradeKey].tier}`, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    }

    // Make the button interactive
    if(this.upgrades[upgradeKey]) {  // If not the close button
        button.on('pointerdown', () => {
                this.upgrade(upgradeKey, costText, tierText);
        });
        } else {
            button.on('pointerdown', callback);
        }

    // Hover animation
    button.on('pointerover', () => {
        if(this.upgrades[upgradeKey] && this.playScene.funds < this.upgrades[upgradeKey].cost) {
            button.setTint(0xff0000);
            buttonText.setStyle({ fill: '#f39c12' });
        } else {
            button.setTint(0x5d12f3);
            buttonText.setStyle({ fill: '#f39c12' });    
        }
        if(this.upgrades[upgradeKey]) {
            this.descriptionText.setText(this.upgrades[upgradeKey].description);
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
        if(this.upgrades[option] && this.playScene.funds >= this.upgrades[option].cost) {
            this.playScene.fireInterval -= 10;
            this.playScene.funds -= this.upgrades[option].cost;
            this.upgrades[option].tier += 1;
        } else {
            this.descriptionText.setText("Insufficient funds.")
        }
        break;
    case 'bullet-speed':
        console.log('Bullet Speed selected');
        if(this.upgrades[option] && this.playScene.funds >= this.upgrades[option].cost) {
            this.playScene.bulletSpeed += 100;
            this.playScene.funds -= this.upgrades[option].cost;
            this.upgrades[option].tier += 1;
        } else {
            this.descriptionText.setText("Insufficient funds.")
        }
        break;
    case 'tank-speed':
        console.log('Tank Speed selected');
        if(this.upgrades[option] && this.playScene.funds >= this.upgrades[option].cost) {
            this.playScene.tankSpeed += 100;
            this.playScene.funds -= this.upgrades[option].cost;
            this.upgrades[option].tier += 1;
        } else {
            this.descriptionText.setText("Insufficient funds.")
        }
        break;
    case 'buy-turret':
        console.log('Buy Turret selected');
        if(this.upgrades[option] && this.playScene.funds >= this.upgrades[option].cost) {
            const turret = new Turret(this.playScene, 500, this.playScene.sizes.height - 170);
            this.playScene.turretGroup.add(turret, true)
            this.playScene.funds -= this.upgrades[option].cost;
            this.upgrades[option].tier += 1;
            // this.scene.setVisible(false);
            // this.scene.pause();
            // this.scene.launch('turret-scene', { playScene: this.playScene });
        } else {
            this.descriptionText.setText("Insufficient funds.")
        }
        break;
    default:
        console.log('Unknown upgrade option');
        break;
    }
    // Update texts
    costText.setText(`${this.upgrades[option].cost}`);
    tierText.setText(`${this.upgrades[option].tier}`);
    this.updateFundsText();
  }

  updateFundsText() {
    this.fundsText.setText(`Funds: ${this.playScene.funds}`);
  }

}