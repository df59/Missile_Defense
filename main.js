//import './style.css'
import Phaser from 'phaser'
import PlayScene from './scenes/PlayScene'
import LoaderScene from './scenes/LoaderScene';
import UpgradeScene from './scenes/UpgradeScene';
import TurretScene from './scenes/TurretUpgradeScene';
import PointModeScene from './scenes/PointModeScene';
import MainMenuScene from './scenes/MainMenuScene';
import TutorialScene from './scenes/TutorialScene';

const sizes={
  width:1920,
  height:960
}

const initialPlayerSpeed = 250;
const initialSpeedDown = 300
const spawnInterval = 1000;
const maxTargets = 10;
let spawnRate = 1;


const missiles = [
  {key: 'missile1', speed: 200, damage: 10, health: 1},
  {key: 'missile2', speed: 250, damage: 20, health: 2},
  {key: 'missile3', speed: 300, damage: 30, health: 3},
  {key: 'missile4', speed: 350, damage: 40, health: 4},
]

const config = {
  type:Phaser.WEBGL,
  width:sizes.width,
  height:sizes.height,
  canvas:gameCanvas,
  physics:{
    default:"arcade",
    arcade:{
      gravity: false,
      debug:true
    }
  },
  scene: [
    LoaderScene,
    PlayScene,
    UpgradeScene,
    TurretScene,
    PointModeScene,
    MainMenuScene,
    TutorialScene
  ]
}

const game = new Phaser.Game(config)