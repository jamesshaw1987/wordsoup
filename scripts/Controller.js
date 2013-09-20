define([
    "Tile",
    "lib/pubsub",
    "lib/typo/typo",
    "text!./templates/grid.html"
], function(Tile, PubSub, Typo, template) {
    return function() {
        var tiles = getEmptyTiles();
        function getEmptyTiles() {
            return [
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0]
            ];
        }

        var clicked = [];
        var word = "";
        var score = 0;
        var total = 0;
        var update = false;
        var data;
        var req = new XMLHttpRequest();
        req.open("GET", "/couchdb/wordsoup/record");
        req.send("");
        req.onload = function() {
            if (req.status == 200) {
                data = JSON.parse(req.responseText);
            }
        };
        
        document.getElementById("container").innerHTML = template;
        var grid = document.getElementById("grid");
        var scoreDisplay = document.getElementById("scoreDisplay");
        var wordDisplay = document.getElementById("wordDisplay");
        function render() {
            grid.innerHTML = "";
            for (var i = 0; i < tiles.length; i++) {
                var div = document.createElement("div");
                div.className = "row";
                for (var j = 0; j < tiles[i].length; j++) {
                    if (!tiles[i][j]) {
                        tiles[i][j] = new Tile(i, j);
                    }
                    div.appendChild(tiles[i][j].tile);
                }
                grid.appendChild(div);
            }
        }

        render();

        var blocker = document.getElementById("blocker");
        var util = new Typo();
        var affData = util._readFile("scripts/lib/typo/dictionaries/en_GB/en_GB.aff");
        var dicData = util._readFile("scripts/lib/typo/dictionaries/en_GB/en_GB.dic");
        var dic = new Typo("en_GB", affData, dicData);

        var count;
        var counter;
        function timer() {
            count--;
            document.getElementById("timer").innerHTML = count;
            if (count <= 0) {
                clearInterval(counter);
                blocker.style.display = "table";
                req.open("GET", "/couchdb/wordsoup/record");
                req.send("");
                req.onload = function() {
                    if (req.status == 200) {
                        updateData(JSON.parse(req.responseText));
                    }
                }
                return;
            }
        }

        function updateData(storedData) {
            if (update) {
                update = false;
                if (data.high_score > storedData.high_score) {
                    storedData.high_score = data.high_score;
                    update = true;
                }
                if (data.best_word_score > storedData.best_word_score) {
                    storedData.best_word = data.best_word;
                    storedData.best_word_score = data.best_word_score;
                    update = true;
                }
                if (data.longest_word.length > storedData.longest_word.length) {
                    storedData.longest_word = data.longest_word;
                    update = true;
                }
            }
            data = storedData;
            if (update) {
                req.open("POST", "/couchdb/wordsoup");
                req.setRequestHeader("Content-type", "application/json");
                req.send(JSON.stringify(data));
            }
            
            alert("Score: " + total + "\nHigh score: " + data.high_score
                + "\nBest word: " + data.best_word + ": "
                + data.best_word_score + "\nLongest word: "
                + data.longest_word);
        }

        blocker.addEventListener("click", function() {
            blocker.style.display = "none";
            wordDisplay.innerHTML = "";
            total = 0;
            scoreDisplay.innerHTML = total;
            update = false;
            tiles = getEmptyTiles();
            render();
            count = 60;
            document.getElementById("timer").innerHTML = count;
            counter = setInterval(timer, 1000);
        }, false);

        function submit() {
            if (dic.check(word)) {
                var multiplier = 1;
                for (var i = 0; i < clicked.length; i++) {
                    count += clicked[i].bonusTime;
                    score += clicked[i].score;
                    multiplier *= clicked[i].bonusScore;
                    clicked[i].deselect();
                    delete tiles[clicked[i].i][clicked[i].j];
                }
                score *= multiplier;
                
                var wordRow = document.createElement("div");
                var wordSpan = document.createElement("span");
                wordSpan.innerHTML = word + ": " + score;
                wordRow.appendChild(wordSpan);
                wordDisplay.appendChild(wordRow);

                if (word.length > data.longest_word.length) {
                    data.longest_word = word;
                    update = true;
                }
                if (score > data.best_word_score) {
                    data.best_word = word;
                    data.best_word_score = score;
                    update = true;
                }
                total += score;
                scoreDisplay.innerHTML = total;
                if (total > data.high_score) {
                    data.high_score = total;
                    update = true;
                }
                score = 0;
                clicked = [];
                render();
            }
        }

        var click = function(message, tile) {
            if (clicked.length) { 
                var last = clicked[clicked.length-1];
                var index = clicked.indexOf(tile);

                if (last.i == tile.i && last.j == tile.j) {
                    if (clicked.length >= 3) {
                        submit();
                    } else if (clicked.length == 1) {
                        clicked[0].deselect();
                        clicked.pop();
                    }
                } else if (index > -1) {
                    for (var i = clicked.length - 1; i > index; i--) {
                        clicked[i].deselect();
                        clicked.pop();
                    }
                    word = word.substring(0, clicked.length);
                } else if ((last.i == tile.i && (last.j == tile.j-1 || last.j == tile.j+1)) || 
                    ((last.i == tile.i-1 && tile.j >= last.j-1 && tile.j <= last.j+1) || (last.i == tile.i+1 && tile.j >= last.j-1 && tile.j <= last.j+1))) {
                    
                    clicked.push(tile);
                    tile.select();
                    word += tile.letter;
                } else {
                    for (var i = 0; i < clicked.length; i++) {
                        clicked[i].deselect();
                    }
                    clicked = [tile];
                    tile.select();
                    word = tile.letter;
                }
            } else {
                clicked.push(tile);
                tile.select();
                word = tile.letter;
            }
        }

        PubSub.subscribe("TILE CLICKED", click);
    };
});
