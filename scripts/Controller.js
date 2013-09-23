define([
    "Tile",
    "lib/pubsub",
    "lib/typo/typo",
    "text!./templates/grid.html"
], function(Tile, PubSub, Typo, template) {
    var Controller = function() {
        this.tiles = this.getEmptyTiles();
        this.clicked = [];
        this.word = "";
        this.score = 0;
        this.total = 0;
        this.update = false;
        this.data;
        this.count = 60;
        this.counter;
        var _this = this;
        this.req = new XMLHttpRequest();
        this.req.open("GET", "/couchdb/wordsoup/record");
        this.req.send("");
        this.req.onload = function() {
            if (this.status == 200) {
                _this.data = JSON.parse(this.responseText);
            }
        };
        
        document.getElementById("container").innerHTML = template;
        this.grid = document.getElementById("grid");
        this.scoreDisplay = document.getElementById("scoreDisplay");
        this.wordDisplay = document.getElementById("wordDisplay");

        this.render();

        this.blocker = document.getElementById("blocker");
        var util = new Typo();
        var affData = util._readFile("scripts/lib/typo/dictionaries/en_GB/en_GB.aff");
        var dicData = util._readFile("scripts/lib/typo/dictionaries/en_GB/en_GB.dic");
        this.dic = new Typo("en_GB", affData, dicData);

        this.blocker.addEventListener("click", function() {
            this.style.display = "none";
            _this.wordDisplay.innerHTML = "";
            _this.total = 0;
            _this.scoreDisplay.innerHTML = _this.total;
            _this.update = false;
            _this.tiles = _this.getEmptyTiles();
            _this.clicked = [];
            _this.render();
            _this.count = 60;
            document.getElementById("timer").innerHTML = _this.count;
            _this.counter = setInterval(function() {
                _this.timer()
            }, 1000);
        }, false);

        PubSub.subscribe("TILE CLICKED", function(message, tile) {
            _this.click(message, tile);
        });
    };

    Controller.prototype.getEmptyTiles = function() {
        return [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ];
    };
    Controller.prototype.render = function() {
        this.grid.innerHTML = "";
        for (var i = 0; i < this.tiles.length; i++) {
            var div = document.createElement("div");
            div.className = "row";
            for (var j = 0; j < this.tiles[i].length; j++) {
                if (!this.tiles[i][j]) {
                    this.tiles[i][j] = new Tile(i, j);
                }
                div.appendChild(this.tiles[i][j].tile);
            }
            this.grid.appendChild(div);
        }
    }
    Controller.prototype.timer = function() {
        this.count--;
        document.getElementById("timer").innerHTML = this.count;
        if (this.count <= 0) {
            clearInterval(this.counter);
            this.blocker.style.display = "table";
            var _this = this;
            this.req.open("GET", "/couchdb/wordsoup/record");
            this.req.send("");
            this.req.onload = function() {
                if (this.status == 200) {
                    _this.updateData(JSON.parse(this.responseText));
                }
            }
            return;
        }
    }
    Controller.prototype.updateData = function(storedData) {
        if (this.update) {
            this.update = false;
            if (this.data.high_score > storedData.high_score) {
                storedData.high_score = this.data.high_score;
                this.update = true;
            }
            if (this.data.best_word_score > storedData.best_word_score) {
                storedData.best_word = this.data.best_word;
                storedData.best_word_score = this.data.best_word_score;
                this.update = true;
            }
            if (this.data.longest_word.length > storedData.longest_word.length) {
                storedData.longest_word = this.data.longest_word;
                this.update = true;
            }
        }
        this.data = storedData;
        if (this.update) {
            this.req.open("POST", "/couchdb/wordsoup");
            this.req.setRequestHeader("Content-type", "application/json");
            this.req.send(JSON.stringify(this.data));
        }
        
        alert("Score: " + this.total + "\nHigh score: " + this.data.high_score
            + "\nBest word: " + this.data.best_word + ": "
            + this.data.best_word_score + "\nLongest word: "
            + this.data.longest_word);
    }
    Controller.prototype.submit = function() {
        if (this.dic.check(this.word)) {
            var multiplier = 1;
            for (var i = 0; i < this.clicked.length; i++) {
                this.count += this.clicked[i].bonusTime;
                this.score += this.clicked[i].score;
                multiplier *= this.clicked[i].bonusScore;
                this.clicked[i].deselect();
                delete this.tiles[this.clicked[i].i][this.clicked[i].j];
            }
            this.score *= multiplier;
            
            var wordRow = document.createElement("div");
            var wordSpan = document.createElement("span");
            wordSpan.innerHTML = this.word + ": " + this.score;
            wordRow.appendChild(wordSpan);
            this.wordDisplay.appendChild(wordRow);

            if (this.word.length > this.data.longest_word.length) {
                this.data.longest_word = this.word;
                this.update = true;
            }
            if (this.score > this.data.best_word_score) {
                this.data.best_word = this.word;
                this.data.best_word_score = this.score;
                this.update = true;
            }
            this.total += this.score;
            this.scoreDisplay.innerHTML = this.total;
            if (this.total > this.data.high_score) {
                this.data.high_score = this.total;
                this.update = true;
            }
            this.score = 0;
            this.clicked = [];
            this.render();
        }
    }
    Controller.prototype.click = function(message, tile) {
        if (this.clicked.length) {
            var last = this.clicked[this.clicked.length-1];
            var index = this.clicked.indexOf(tile);

            if (last.i == tile.i && last.j == tile.j) {
                if (this.clicked.length >= 3) {
                    this.submit();
                } else if (this.clicked.length == 1) {
                    this.clicked[0].deselect();
                    this.clicked.pop();
                }
            } else if (index > -1) {
                for (var i = this.clicked.length - 1; i > index; i--) {
                    this.clicked[i].deselect();
                    this.clicked.pop();
                }
                this.word = this.word.substring(0, this.clicked.length);
            } else if ((last.i == tile.i && (last.j == tile.j-1 || last.j == tile.j+1)) || 
                ((last.i == tile.i-1 && tile.j >= last.j-1 && tile.j <= last.j+1) || (last.i == tile.i+1 && tile.j >= last.j-1 && tile.j <= last.j+1))) {
                
                this.clicked.push(tile);
                tile.select();
                this.word += tile.letter;
            } else {
                for (var i = 0; i < this.clicked.length; i++) {
                    this.clicked[i].deselect();
                }
                this.clicked = [tile];
                tile.select();
                this.word = tile.letter;
            }
        } else {
            this.clicked.push(tile);
            tile.select();
            this.word = tile.letter;
        }
    }

    return Controller;
});
