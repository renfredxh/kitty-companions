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
  this.infoName;
  this.infoLikes;
  this.infoDislikes;
  this.infoPic;
  this.centerText;
  this.newCatTimer;
  this.garbage = [];
  this.total = 0;
  this.maxCatCount = 12;
  this.data = BasicGame.Data;
  this.happyKittySounds;
  this.angryKittySound;
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
      var width = this.world.width;
      var height = this.world.height

      this.rnd.sow([Date.now()]);
      this.infoBorder = 240;
      //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
      this.stage.backgroundColor = '#ef5350';
      this.background = this.add.tileSprite(0, 0, width-this.infoBorder, height, 'grass');

      // Cats
      this.data.cats = [];
      this.data.generateNewCats();
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
      var style, text;
      var infoMargin = width-this.infoBorder+20
      this.infoBlock = this.add.sprite(width-this.infoBorder, 0, null);
      this.physics.enable(this.infoBlock, Phaser.Physics.ARCADE);
      this.infoBlock.body.setSize(this.infoBorder, height, 0, 0);
      style = { stroke: "#000", strokeThickness: 10, fill: "#fff" };
      text = "";
      this.infoName = this.add.text(infoMargin-10, 16, text, style);
      this.infoName.font = "Press Start 2P";
      this.infoName.fontSize = 22;
      this.infoPic = this.add.sprite(infoMargin, this.infoName.y+48, 'catPics');
      style = { stroke: "#000", strokeThickness: 8, fill: "#fff" };
      this.infoLikes = this.add.text(infoMargin, this.infoPic.y+216, text, style);
      this.infoLikes.font = "Press Start 2P";
      this.infoLikes.fontSize = 13;
      this.infoLikes.anchor.set(0);

      // Text
      style = { stroke: "#000", strokeThickness: 16, fill: "#fff", align: "center" };
      var text = this.add.text(this.world.centerX, this.world.centerY, "", style);
      text.fontSize = 256;
      text.font = "Arial";
      text.anchor.set(0.5);
      this.centerText = text;

      // Score
      style = { stroke: "#000", strokeThickness: 5, fill: "#fff" };
      text = "";
      this.scoreText = this.add.text(8, 8, text, style);
      this.scoreText.font = "Press Start 2P";
      this.scoreText.fontSize = 18;
      this.infoLikes.anchor.set(0);

      // Sfx
      this.happyKittySounds = [game.add.audio('happyKitty1'), game.add.audio('happyKitty2'), game.add.audio('happyKitty3'), game.add.audio('happyKitty4')];
      this.angryKittySound = game.add.audio('angryKitty');
      this.angryKittySound.allowMultiple = true;
      this.happyKittySounds.forEach(function(sound) {
        sound.allowMultiple = true;
      })
      this.updateScore(10);
    },

    update: function() {
      this.catCount = this.cats.countLiving();
      this.physics.arcade.overlap(this.infoBlock, this.cats, this.blockCat, null, this);
      this.physics.arcade.overlap(this.cats, this.cats, this.catCollision, null, this);

      this.cats.forEach(function(cat) {
        this.moveCat(cat);
      }, this);

      if (this.time.now > this.newCatTimer && this.catCount < this.maxCatCount) {
        this.addCat();
        this.newCatTimer = this.time.now + this.rnd.between(1000, 4000);
      }
    },

    addCat: function() {
      var cat;
      var props;
      var bounds;
      var placeAttempts;
      var newX, newY
      props = this.data.getCat();
      newX = this.rnd.between(0, 6)*80 + 40;
      newY = this.rnd.between(0, 14)*40 + 20;
      cat = this.cats.create(newX, newY, 'cat');
      cat.busy = false;
      cat.name = props.name;
      cat.likes = props.likes;
      cat.dislikes = props.dislikes;
      cat.frameStart = props.color*2;
      cat.frame = cat.frameStart;
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
        offset = this.rnd.between(-100, 100);
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
        cat.moveTween.to(delta, Math.abs(offset*20), Phaser.Easing.Linear.None);
        cat.moveTween.start();
        cat.moveTimer = this.time.now + this.rnd.between(750, 3000);
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
      this.updateInfoSection(cat);
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
      if (cat2.age > this.time.now - 100) {
        cat2.kill();
        return;
      }
      var heart;
      var heartTween;
      var sfx;
      var score;
      var pointsText;
      var style;
      cat1.inputEnabled = false;
      cat2.inputEnabled = false;
      cat1.busy = true;
      cat2.busy = true;
      cat1.moveTween.stop();
      cat2.moveTween.stop();

      cat1.body.y = cat2.body.y;
      cat1.body.x = cat2.body.x + 80;
      cat1.frame = cat1.frameStart+1;
      cat2.frame = cat2.frameStart;

      score = this.calculateMatch(cat1, cat2);
      if (score >= 3) {
        heart = this.redHearts.getFirstDead();
        sfx = this.rnd.pick(this.happyKittySounds);
      } else if (score < 0) {
        heart = this.blueHearts.getFirstDead();
        sfx = this.angryKittySound;
      } else {
        heart = this.pinkHearts.getFirstDead();
        sfx = this.rnd.pick(this.happyKittySounds);
      }

      heart.anchor.set(0.5);
      heart.reset(cat1.body.x, cat1.body.y-15);
      heartTween = this.add.tween(heart);
      heartTween.to({ y: cat1.body.y-30 }, 1000, Phaser.Easing.Bounce.Out);
      style = { stroke: "#000", strokeThickness: 5, fill: "#fff" };
      pointsText = this.add.text(cat1.body.x, cat1.body.y+30, parseInt(score), style);
      pointsText.fontSize = 16;
      pointsText.font = "Press Start 2P";
      pointsText.anchor.set(0.5, 0);
      pointsTextTween = this.add.tween(pointsText);
      pointsTextTween.to({ y: cat1.body.y+42 }, 1000, Phaser.Easing.Bounce.Out);
      pointsTextTween.start();
      heartTween.start();
      sfx.play();

      this.garbage = this.garbage.concat([cat1, cat2, pointsText, heart]);
      this.time.events.add(2500, this.killGarbage, this);
      this.updateScore(this.score+score);
    },

    calculateMatch: function(cat1, cat2) {
      var score = 0;
      cat1.likes.forEach(function(like) {
        if (contains(like, cat2.likes)) {
          score += 1;
        } else if (contains(like, cat2.dislikes)) {
          score -= 2;
        }
      });
      cat2.likes.forEach(function(like) {
        if (contains(like, cat1.dislikes)) {
          score -= 2;
        }
      });
      return score === 0 ? 1 : score;
    },

    removeCat: function(cat) {
      cat.kill();
    },

    updateInfoSection: function(cat) {
      var likesText = "Likes:\n";
      this.infoName.text = cat.name;
      this.infoPic.frame = cat.frameStart/2;
      cat.likes.forEach(function(like) {
        likesText += "• " + like + "\n"
      });
      likesText += "Dislikes:\n"
      cat.dislikes.forEach(function(dislike) {
        likesText += "• " + dislike + "\n"
      });
      this.infoLikes.text = likesText;
    },

    updateScore: function(newScore) {
      this.score = newScore;
      this.scoreText.text = "Total: " + parseInt(this.score);
      if (this.score >= 30) {
        this.centerText.text = ":3";
        this.centerText.alpha = 1;
      } else if (this.score <= 0) {
        this.centerText.text = ":(";
        this.centerText.alpha = 1;
        this.time.events.add(2000, this.quitGame, this);
      }
      var centerTextTween = this.add.tween(this.centerText);
      centerTextTween.to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, null, 5000);
      centerTextTween.start();
    },

    killGarbage: function() {
      this.garbage.forEach(function(item) {
        if (item.kill !== undefined) {
          item.kill();
        } else {
          item.destroy();
        }
      });
    },

    quitGame: function (pointer) {

      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

      //  Then let's go back to the main menu.
      this.state.start('MainMenu');

    },

};
