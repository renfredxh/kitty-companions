function contains(value, array) {
  return array.indexOf(value) > -1;
}

function remove(value, array) {
  var index = array.indexOf(value);
  array.splice(index, 1);
  return array;
}
function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

BasicGame.Data = {
  rnd: new Phaser.RandomDataGenerator([Date.now()]),
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
    "Skitty",
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
  getLikes: function(min, max, others) {
    var likes;
    var like;
    var count;
    if (others === undefined) others = [];
    count = this.rnd.between(min, max);
    likes = []
    for (var i=0; i<count; i++) {
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
    for (var i=0; i<8; i++) {
      if (i%2 === 0) {
        likes = this.getLikes(3, 4);
      } else {
        // Every cat that's made has an "optimal" match with the same
        // or very similar likes/dislikes.
        newLike = this.rnd.pick(this.likes);
        if (!contains(newLike, likes)) {
          likes = likes.slice();
          // Add in a new like to mix it up sometimes.
          if (this.rnd.between(0, 1) === 1) {
            likes[0] = newLike;
          }
        }
      }
      this.cats.push({
        name: this.getName(),
        color: this.rnd.between(1, this.colors),
        likes: likes,
        dislikes: this.getLikes(1, 2, likes)
      });
    }
  },
  getCat: function() {
    if (this.cats.length <= 0) {
      this.generateNewCats();
    }
    var cat = this.rnd.pick(this.cats);
    remove(cat, this.cats);
    return cat;
  }
};
