define([
    "Letters",
    "lib/pubsub"
], function(Letters, PubSub) {
    var Tile = function(i, j) {
        this.i = i;
        this.j = j;
        this.bonusTime = 0;
        this.bonusScore = 1;
        var letters = Letters.getWeightedLetters();
        var data = Letters.data;
        this.letter = letters[Math.floor(Math.random()*letters.length)];
        this.score = data[this.letter].score;
        this.tile = document.createElement("button");
        this.tile.className = "tile btn " + data[this.letter].freq;
        this.tile.innerHTML = this.letter;
        var bonus  = document.createElement("sub");
        var bonusRandom = Math.random();
        if (bonusRandom > 0.95) {
            this.bonusTime = Letters.bonus.time;
            bonus.innerHTML = "+" + this.bonusTime + "s";
        } else if (bonusRandom > 0.9) {
            this.bonusScore = Letters.bonus.score;
            bonus.innerHTML = "x" + this.bonusScore;
        }
        this.tile.appendChild(bonus);
        var _this = this;
        this.tile.addEventListener("click", function(event) {
            PubSub.publish("TILE CLICKED", _this);
        }, false);
    };

    Tile.prototype.select = function() {
        this.tile.className += " selected";
    };

    Tile.prototype.deselect = function() {
        this.tile.className = this.tile.className.replace(" selected", "");
    };
    return Tile;
});
