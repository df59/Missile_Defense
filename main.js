import "./style.css";
import Phaser from "phaser";
import PlayScene from "./scenes/PlayScene";
import LoaderScene from "./scenes/LoaderScene";
import UpgradeScene from "./scenes/UpgradeScene";
import TurretScene from "./scenes/TurretUpgradeScene";
import PointModeScene from "./scenes/PointModeScene";
import MainMenuScene from "./scenes/MainMenuScene";
import TutorialScene from "./scenes/TutorialScene";
import GameOverScene from "./scenes/GameOverScene";
import LeaderBoardScene from "./scenes/LeaderBoardScene";

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  parent: "game",
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: false,
      debug: false,
    },
  },
  scene: [LoaderScene, PlayScene, UpgradeScene, TurretScene, PointModeScene, MainMenuScene, TutorialScene, GameOverScene, LeaderBoardScene],
};

const game = new Phaser.Game(config);
