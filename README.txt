Missile Defense is a shooting game I created using the Phaser.js framework where your goal is to shoot down
falling missiles before they land. Each missile has its own attributes, including the damage they deal to you
if they land, their health, their speed, and the score they award you if you shoot them down. There are also
powerups which will fall to increase your health or give you funds to spend on upgrades. Use A and D to move 
your tank to pick these up.

You can upgrade your main tank in various ways, or you can buy turrets and even upgrade them. Press spacebar 
to access the main store. If you buy a turret, you can click and drag it to move its location. You can 
double-click a turret to access its respective upgrade store. In its upgrade store, you also have the option
to set it to one of two modes - point mode and follow mode. In point mode you set the turret to target a 
specific location. In follow mode, the turret will fire at your cursor, just like the main tank.

The game can be played at https://df59.github.io/Missile_Defense/



If you want to run it locally you can clone the repository at https://github.com/df59/Missile_Defense.git

in a terminal in the directory run:

npm install phaser
npm install vite

npm run dev

Now you can access the game in the web browser at the displayed localhost URL.



If you would like to change the game to make it easier or faster, you can change attributes in the 
PlayScene.js at the top of the create() function, such as funds, health, or spawn timings.




Thank you for playing my game!

Dustin Franklin 2024