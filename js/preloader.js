BasicGame.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {

    //  These are the assets we loaded in Boot.js
    //  A nice sparkly background and a loading progress bar
    this.background = this.add.tileSprite(0, 0, this.world.width, this.world.height, 'preloaderBackground');
    this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloaderBar');
    this.preloadBar.anchor.set(0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    //  As this is just a Project Template I've not provided these assets, swap them for your own.
    this.load.image('titlepage', 'assets/menu_background.png');
    this.load.image('grass', 'assets/grass_background.png');
    this.load.spritesheet('cat', 'assets/cat_sprites.png', 80, 40);
    this.load.image('redHeart', 'assets/red_heart.png');
    this.load.image('pinkHeart', 'assets/pink_heart.png');
    this.load.image('blueHeart', 'assets/blue_heart.png');
    this.load.spritesheet('catPics', 'assets/cat_profiles.png', 200, 200);
    //this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
    //this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');
    //this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');

    //  + lots of other required assets here

  },

  create: function () {
    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;
  },

  update: function () {
    this.state.start('Game');
  }

};
