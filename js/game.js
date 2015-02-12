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
  this.border;
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

      this.border = 240;

      //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
      this.stage.backgroundColor = '#ef5350';
      this.background = this.add.tileSprite(0, 0, this.world.width-this.border, this.world.height, 'grass');

      // Cats
      this.cats = this.add.group();
      var cat = this.cats.create(this.world.centerX, this.world.centerY, 'cat');
      cat.frame = 2;
      cat.name = "Frank";
      var bounds = new Phaser.Rectangle(0, 0, this.world.width-this.border, this.world.height);
      cat.inputEnabled = true;
      cat.input.enableDrag(false, true, false, 255, bounds);

      // Info section
    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.state.start('MainMenu');

    }

};
