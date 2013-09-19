define(function() {
    return {
        bonus: {
            time: 10,
            score: 2
        },
        data: {
            a: {
                freq: "vhigh",
                weight: 7,
                score: 1
            },
            b: {
                freq: "low",
                weight: 2,
                score: 3
            },
            c: {
                freq: "low",
                weight: 3,
                score: 3
            },
            d: {
                freq: "med",
                weight: 4,
                score: 2
            },
            e: {
                freq: "vhigh",
                weight: 8,
                score: 1
            },
            f: {
                freq: "low",
                weight: 3,
                score: 4
            },
            g: {
                freq: "low",
                weight: 3,
                score: 2
            },
            h: {
                freq: "low",
                weight: 3,
                score: 4
            },
            i: {
                freq: "vhigh",
                weight: 7,
                score: 1
            },
            j: {
                freq: "vlow",
                weight: 1,
                score: 8
            },
            k: {
                freq: "vlow",
                weight: 2,
                score: 5
            },
            l: {
                freq: "med",
                weight: 5,
                score: 1
            },
            m: {
                freq: "med",
                weight: 5,
                score: 3
            },
            n: {
                freq: "med",
                weight: 5,
                score: 1
            },
            o: {
                freq: "high",
                weight: 6,
                score: 1
            },
            p: {
                freq: "low",
                weight: 3,
                score: 3
            },
            q: {
                freq: "vlow",
                weight: 1,
                score: 10
            },
            r: {
                freq: "high",
                weight: 6,
                score: 1
            },
            s: {
                freq: "high",
                weight: 6,
                score: 1
            },
            t: {
                freq: "high",
                weight: 6,
                score: 1
            },
            u: {
                freq: "med",
                weight: 4,
                score: 1
            },
            v: {
                freq: "low",
                weight: 2,
                score: 4
            },
            w: {
                freq: "low",
                weight: 2,
                score: 4
            },
            x: {
                freq: "vlow",
                weight: 1,
                score: 8
            },
            y: {
                freq: "low",
                weight: 2,
                score: 4
            },
            z: {
                freq: "vlow",
                weight: 1,
                score: 10
            }
        },
        getWeightedLetters: function() {
            var weighted = [];
            for (var i in this.data) {
                for (var j = 0; j < this.data[i].weight; j++) {
                    weighted.push(i);
                }
            }
            return weighted;
        }
    };
});
