function contains(value, array) {
  return array.indexOf(value) > -1;
}

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

BasicGame.Data = {
  rnd: new Phaser.RandomDataGenerator(),
  cats: [],
  names: shuffle([
    "Frank",
    "Sam",
    "Boots",
    "Lilly",
    "Tigger",
    "Aaron",
    "Mochi",
    "Shinobi",
    "Bella",
    "Creme Puff",
    "Grumpy",
    "Scarlett",
    "Katie",
    "Winnie",
    "Garfield",
    "Felix",
    "Tom",
    "Luna",
    "Marie",
    "Pink",
    "Cheshire",
    "Heathcliff",
    "Cleo",
    "Sylvester",
    "Simba",
    "Figaro",
    "Moon",
  ]),
  nameCount: 0,
  likes: [
    "Cat Nip",
    "Sun Bathing",
    "Beaches",
    "Cat Naps",
    "Programming",
    "Baking",
    "Knitting",
    "Podcasts",
    "Sports",
    "Yoga",
    "Cryptography",
    "Cooking",
    "Board Games",
    "Reading",
    "Yodeling",
    "Anime",
    "Video Games",
    "Scratching",
    "Yarn",
  ],
  getName: function() {
    var name = this.names[this.nameCount];
    this.nameCount =  this.nameCount == this.names.length-1 ? 0 : this.nameCount+1;
    return name;
  },
  colors: 6,
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
          likes = likes.slice();
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
    if (this.cats.length <= 0) {
      this.generateNewCats();
    }
    var cat = this.rnd.pick(this.cats);
    return cat;
  }
};
