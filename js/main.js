"use strict";
var Util;
(function (Util) {
    function clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
    Util.clamp = clamp;
    function cartesianProduct(arr) {
        return arr.reduce(function (a, b) {
            return a.map(function (x) { return b.map(function (y) { return x.concat(y); }); })
                .reduce(function (a, b) { return a.concat(b); }, []);
        }, [[]]);
    }
    Util.cartesianProduct = cartesianProduct;
    /**
     * Takes an array and a function that maps each of it's elements to a key, value pair, then turns that key value pair into an object
     * @param arr array being mapped to object
     * @param mapFunc function which maps elements of arr to key, value pair
     */
    function constructObject(arr, mapFunc) {
        return arr.map(mapFunc).reduce(function (obj, entry) {
            obj[entry[0]] = entry[1];
            return obj;
        }, {});
    }
    Util.constructObject = constructObject;
})(Util || (Util = {}));
var Calculator;
(function (Calculator) {
    function createBuild(partGroups) {
        var stats = Util.constructObject(Data.Statistics, function (stat, i) {
            var statValue = partGroups.reduce(function (a, b) { return a + b.statValues[i]; }, 0);
            return [stat, Util.clamp(statValue, 0.75, 5.75)];
        });
        return { partGroups: partGroups, stats: stats };
    }
    function genBuilds() {
        var groups = Object.keys(Data.PartStats).map(function (type) { return Data.PartStats[type]; });
        return Util.cartesianProduct(groups).map(createBuild);
    }
    function genParts() {
        return Object.keys(Data.PartStats).reduce(function (a, type) {
            return a.concat(Data.PartStats[type].reduce(function (a, partGroup) {
                return a.concat(partGroup.parts.map(function (_, partNum) {
                    return ({ type: type, partGroup: partGroup, partNum: partNum });
                }));
            }, []));
        }, []);
    }
    Calculator.allBuilds = genBuilds();
    Calculator.allParts = genParts();
    function scoreBuilds(weights) {
        var scoredBuilds = Calculator.allBuilds.map(function (build) { return ({
            score: Data.Statistics.reduce(function (sum, stat) { return sum + build.stats[stat] * weights[stat]; }, 0),
            build: build
        }); });
        return scoredBuilds.sort(function (a, b) { return b.score - a.score; });
    }
    Calculator.scoreBuilds = scoreBuilds;
})(Calculator || (Calculator = {}));
var UI;
(function (UI) {
    function getStatisticSliderId(stat) {
        return "slider-" + String(stat).replace(" ", "_");
    }
    function init(elements) {
        elements.slidersDiv.innerHTML = "";
        elements.resultsDiv.innerHTML = "";
        Data.Statistics.forEach(function (stat) {
            var sliderDiv = document.createElement("div");
            var rangeInput = document.createElement("input");
            rangeInput.id = getStatisticSliderId(stat);
            rangeInput.type = "range";
            rangeInput.defaultValue = "50";
            sliderDiv.appendChild(rangeInput);
            sliderDiv.appendChild(document.createTextNode(String(stat)));
            elements.slidersDiv.appendChild(sliderDiv);
        });
        elements.calculateButton.onclick = function () { return recalculateResults(elements.resultsDiv); };
    }
    UI.init = init;
    function getWeights() {
        return Util.constructObject(Data.Statistics, function (stat) {
            var rangeInput = document.getElementById(getStatisticSliderId(stat));
            return [stat, parseInt(rangeInput.value)];
        });
    }
    function recalculateResults(resultsDiv) {
        resultsDiv.innerHTML = "";
        var scores = Calculator.scoreBuilds(getWeights()).slice(0, 10);
        scores.forEach(function (score) {
            var resultDiv = document.createElement("div");
            resultDiv.appendChild(document.createTextNode("Score: " + score.score));
            resultDiv.appendChild(document.createElement("br"));
            resultDiv.appendChild(document.createTextNode("Build: " + score.build.partGroups.map(function (g) { return "[" + g.parts.map(function (p) { return p.name; }).join(", ") + "]"; }).join(", ")));
            resultDiv.appendChild(document.createElement("br"));
            resultDiv.appendChild(document.createTextNode("Stats: " + Data.Statistics.map(function (s) { return String(s) + ": " + score.build.stats[s]; }).join(", ")));
            resultDiv.appendChild(document.createElement("br"));
            resultDiv.appendChild(document.createElement("br"));
            resultsDiv.appendChild(resultDiv);
        });
    }
    UI.recalculateResults = recalculateResults;
})(UI || (UI = {}));
console.log(Calculator.allBuilds.map(function (b) { return [b, Calculator.scoreBuilds(b.stats)[0]]; }));
UI.init({
    slidersDiv: document.getElementById("sliders"),
    calculateButton: document.getElementById("calculate"),
    resultsDiv: document.getElementById("results")
});
//# sourceMappingURL=main.js.map