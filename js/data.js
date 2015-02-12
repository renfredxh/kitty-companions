function contains(value, array) {
  return array.indexOf(value) > -1;
}

BasicGame.Data = {
  rnd: new Phaser.RandomDataGenerator(),
  cats: [],
  names: [
    "Frank",
    "Katie",
    "Sam",
    "Boots",
    "Lilly",
    "Tigger",
    "Aaron",
    "Moody",
    "Mochi",
    "Shinobi",
    "Bella",
  ],
  nameCount: 0,
  likes: [
    "Cat Nip",
    "Sun Bathing",
    "Beaches",
    "Naps",
    "Baking",
    "Video Games",
  ],
  getName: function() {
    var name = this.names[this.nameCount];
    this.nameCount =  this.nameCount == this.names.length-1 ? 0 : this.nameCount+1;
    return name;
  },
  colors: 1,
  getLikes: function(others) {
    var likes;
    var like;
    if (others === undefined) others = [];
    likes = []
    for (var i=0; i<this.rnd.between(3,5); i++) {
      like = this.rnd.pick(this.likes);
      if (!contains(like, likes) && !contains(like, others)) {
        likes.push(like);
      }
    }
    return likes;
  },
  generateNewCats: function() {
    var likes = [];
    var newLike;
    for (var i=0; i<10; i++) {
      if (i%2 === 0) {
        likes = this.getLikes();
      } else {
        newLike = this.rnd.pick(this.likes);
        if (!contains(newLike, likes)) {
          likes[0] = newLike;
        }
      }

      this.cats.push({
        name: this.getName(),
        color: this.rnd.between(1, this.colors),
        likes: likes,
        dislikes: this.getLikes(likes)
      });
    }
  },
  getCat: function() {
    var cat = this.rnd.pick(this.cats);
    return cat;
  }
};
