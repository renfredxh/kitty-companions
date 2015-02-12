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
  this.catCount;
  this.infoBorder;
  this.infoBlock;
  this.newCatTimer;
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
      this.catCount = 0;
      this.newCatTimer = this.time.now;
      this.cats = this.add.group();

      // Hearts
      this.redHearts = game.add.group();
      this.pinkHearts = game.add.group();
      this.blueHearts = game.add.group();
      this.redHearts.createMultiple(10, 'redHeart');
      this.pinkHearts.createMultiple(10, 'pinkHeart');
      this.blueHearts.createMultiple(10, 'blueHeart');

      // Info section
      this.infoBlock = this.add.sprite(this.world.width-this.infoBorder, 0, null);
      this.physics.enable(this.infoBlock, Phaser.Physics.ARCADE);
      this.infoBlock.body.setSize(this.infoBorder, this.world.height, 0, 0);

      this.debug = new Phaser.Utils.Debug(window.game);
    },

    update: function() {
      this.physics.arcade.overlap(this.infoBlock, this.cats, this.blockCat, null, this);
      this.physics.arcade.overlap(this.cats, this.cats, this.catCollision, null, this);

      this.cats.forEach(function(cat) {
        this.moveCat(cat);
      }, this);

      if (this.time.now > this.newCatTimer && this.catCount < 10) {
        this.prime = this.addCat();
        this.newCatTimer = this.time.now + 1000;
      }
    },

    addCat: function() {
      var cat;
      var bounds;
      var placeAttempts;
      var newX, newY
      newX = this.rnd.between(0, 6)*80 + 40;
      newY = this.rnd.between(0, 14)*40 + 20;
      cat = this.cats.create(newX, newY, 'cat');
      cat.busy = false;
      cat.frameStart = 0;
      cat.frame = cat.frameStart;
      cat.name = "Frank";
      cat.moveTimer = this.time.now + 500;
      cat.age = this.time.now;
      cat.moveTween = this.add.tween(cat);

      this.physics.enable(cat, Phaser.Physics.ARCADE);
      cat.body.collideWorldBounds = true
      cat.body.setSize(80, 40, 0, 0);

      bounds = new Phaser.Rectangle(0, 0, this.world.width-this.infoBorder, this.world.height);
      cat.inputEnabled = true;
      cat.input.enableDrag(false, true, false, 255, bounds);
      cat.events.onDragStart.add(this.onCatDrag, this);
      cat.events.onDragStop.add(this.onCatDrop, this);
      this.catCount++;
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
        delta = this.rnd.pick([{ x: cat.body.x-offset}, { y: cat.body.y-offset }]);
        // If cat is moving in the x direction, make sure the sprite is flipped correctly.
        if (delta.x !== undefined) {
          if (offset < 0) {
            cat.frame = cat.frameStart;
          } else {
            cat.frame = cat.frameStart+1;
          }
        }
        cat.moveTween.to(delta, Math.abs(offset*25), Phaser.Easing.Linear.None);
        cat.moveTween.start();
        cat.moveTimer = this.time.now + 2000;
      }
      // Stop moving if the cat hits something
      blocked = cat.body.blocked;
      if (this.isBlocked(cat.body) && cat.moveTween !== undefined) {
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

    isBlocked: function(body) {
      var blocked = body.blocked;
      return blocked.up || blocked.down || blocked.left || blocked.right;
    },

    catCollision: function(cat1, cat2) {
      if (cat1 === cat2) return;
      if (cat1.busy || cat2.busy) return;
      if (cat1.age > this.time.now - 100) {
        cat1.kill();
        return;
      }
      var heart;
      var heartTween;
      cat1.inputEnabled = false;
      cat2.inputEnabled = false;
      cat1.busy = true;
      cat2.busy = true;
      if (cat2.age > this.time.now - 100) {
        cat2.kill();
        return;
      }
      cat1.moveTween.stop();
      cat2.moveTween.stop();

      cat1.body.y = cat2.body.y;
      cat1.body.x = cat2.body.x + 80;
      cat1.frame = cat1.frameStart+1;
      cat2.frame = cat2.frameStart;
      heart = this.redHearts.getFirstDead();
      heart.anchor.set(0.5);
      heart.reset(cat1.body.x, cat1.body.y-15);
      heartTween = this.add.tween(heart);
      heartTween.to({ y: cat1.body.y-30 }, 1000, Phaser.Easing.Bounce.Out);
      heartTween.start();
    },

    removeCat: function(cat) {
      cat.kill();
      this.catCount--;
    },

    quitGame: function (pointer) {

      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

      //  Then let's go back to the main menu.
      this.state.start('MainMenu');

    },

    render: function() {
      if (this.prime)
        this.debug.bodyInfo(this.prime, 32, 32)
    }
};
