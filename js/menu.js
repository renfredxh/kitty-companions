BasicGame.MainMenu = function (game) {

  this.music = null;
  this.titleText = null;
  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create: function () {
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'titlepage');
    this.setTitleText();
    this.setStartText();

    var enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterKey.onDown.add(this.startGame, this);
  },

  update: function () {
    this.background.tilePosition.x -= 1;
  },

  setTitleText: function () {
    var title = "Place Kitten";
    var style = { stroke: "#000", strokeThickness: 16, fill: "#fff", align: "center" };
    var text = this.add.text(this.world.centerX, this.world.centerY-64, title, style);
    text.fontSize = 64;
    text.font = "Press Start 2P";
    text.anchor.set(0.5);
    this.titleText = text;
  },

  setStartText: function () {
    var title = "Press Enter ▶▶▶";
    var style = { stroke: "#000", strokeThickness: 8, fill: "#fff", align: "center" };
    var text = this.add.text(this.world.centerX, this.world.centerY+64, title, style);
    text.fontSize = 32;
    text.font = "Press Start 2P";
    text.anchor.set(0.5);
    text.alpha = 0;
    this.add.tween(text).to( { alpha: 1 }, 500, Phaser.Easing.Quadratic.In, true, 0, -1, true);
  },

  startGame: function (pointer) {
    //  And start the actual game
    this.state.start('Game');
  }

};
