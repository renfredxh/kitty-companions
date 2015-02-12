BasicGame.Game = function (game) {

  //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

  this.game;      //  a reference to the currently running game (Phaser.Game)
  this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
  this.camera;    //  a reference to the game camera (Phaser.Camera)
  this.cache;     //  the game cache (Phaser.Cache)
  this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
  this.load;      //  for preloading assets (Phaser.Loader)
  this.math;      //  lots of useful common math operations (Phaser.Math)
  this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
  this.stage;     //  the game stage (Phaser.Stage)
  this.time;      //  the clock (Phaser.Time)
  this.tweens;    //  the tween manager (Phaser.TweenManager)
  this.state;     //  the state manager (Phaser.StateManager)
  this.world;     //  the game world (Phaser.World)
  this.particles; //  the particle manager (Phaser.Particles)
  this.physics;   //  the physics manager (Phaser.Physics)
  this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)


  this.cats;
  this.infoBorder;
  this.infoBlock;
};

BasicGame.Game.Cat = function() {
  this.frame;
  this.name;
  this.likes;
  this.dislikes;
  this.preference;
}

BasicGame.Game.prototype = {

    create: function () {

      this.infoBorder = 240;
      //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
      this.stage.backgroundColor = '#ef5350';
      this.background = this.add.tileSprite(0, 0, this.world.width-this.infoBorder, this.world.height, 'grass');

      // Cats
      this.cats = this.add.group();
      this.prime = this.addCat();

      // Info section
      this.infoBlock = this.add.sprite(this.world.width-this.infoBorder, 0, null);
      this.physics.enable(this.infoBlock, Phaser.Physics.ARCADE);
      this.infoBlock.body.setSize(this.infoBorder, this.world.height, 0, 0);

      this.debug = new Phaser.Utils.Debug(window.game);
    },

    update: function() {
      this.physics.arcade.overlap(this.infoBlock, this.cats, this.blockCat, null, this);
      this.cats.forEach(function(cat) {
        this.moveCat(cat);
      }, this);

    },

    addCat: function() {
      var cat;
      var bounds;
      cat = this.cats.create(this.world.centerX, this.world.centerY, 'cat');
      cat.busy = false;
      cat.frame = 0;
      cat.name = "Frank";
      cat.moveTimer = this.time.now + 500;

      this.physics.enable(cat, Phaser.Physics.ARCADE);
      cat.body.collideWorldBounds = true

      bounds = new Phaser.Rectangle(0, 0, this.world.width-this.infoBorder, this.world.height);
      cat.inputEnabled = true;
      cat.input.enableDrag(false, true, false, 255, bounds);
      cat.events.onDragStart.add(this.onCatDrag, this);
      cat.events.onDragStop.add(this.onCatDrop, this);
      return cat;
    },

    /* Move a cat in a random direction */
    moveCat: function(cat) {
      var newPos;
      var offset;
      var delta;
      var blocked;
      if (this.time.now > cat.moveTimer && !cat.busy) {
        cat.moveTween = this.add.tween(cat);
        offset = this.rnd.between(-50, 50);
        offset = offset <= 0 ? Math.min(offset, -20) : Math.max(offset, 20)
        newPos = cat.body.x - offset;
        delta = this.rnd.pick([{ x: newPos }, { y: newPos }]);
        cat.moveTween.to(delta, Math.abs(offset*25), Phaser.Easing.Linear.None);
        cat.moveTween.start();
        cat.moveTimer = this.time.now + 2000;
      }
      // Stop moving if the cat hits something
      blocked = cat.body.blocked;
      if (blocked.up || blocked.down || blocked.left || blocked.right) {
        cat.moveTween.stop();
      }
    },

    onCatDrag: function(cat, pointer) {
      cat.busy = true;
      if (cat.moveTween !== undefined) {
        cat.moveTween.stop();
      }
    },

    onCatDrop: function(cat, pointer) {
      cat.busy = false;
    },

    blockCat: function(infoBlock, cat) {
      cat.moveTween.stop();
      cat.body.x -= 1;
    },

    quitGame: function (pointer) {

      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

      //  Then let's go back to the main menu.
      this.state.start('MainMenu');

    },

    render: function() {
    }
};
