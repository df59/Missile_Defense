document.getElementById("version").textContent = "Phaser v" + Phaser.VERSION;

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  loader: {
    baseURL: "https://labs.phaser.io",
    crossOrigin: "anonymous"
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

var block, flower;

function preload() {
  this.load.image("block", "assets/sprites/block.png");
  this.load.image("flower", "assets/sprites/flower-exo.png");
}

function create() {
  block = this.physics.add.image(400, 100, "block");

  block.setVelocity(100, 200);
  block.setBounce(1, 1);
  block.setCollideWorldBounds(true);

  flower = this.add.image(0, 0, "flower");

  // Use EITHER:
  // (1) Read sprite position in 'postupdate' or
  // (2) Read body position in update()

  // (1) aka Phaser.Scene.Events.POST_UPDATE
  this.events.on("postupdate", function () {
    Phaser.Display.Align.To.TopCenter(flower, block);
  });
}

function update() {
  // (2)
  // Phaser.Display.Bounds.SetCenterX(flower, block.body.center.x);
  // Phaser.Display.Bounds.SetBottom(flower, block.body.top);
}