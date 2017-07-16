"use strict";
var Calculator;
(function (Calculator) {
    function clamp(num, min, max) {
        return Math.min(Math.max(num, min), max);
    }
    function createBuild(partGroups) {
        var stats = {};
        Data.Statistics.forEach(function (stat, i) {
            var statValue = partGroups.reduce(function (a, b) { return a + b.statValues[i]; }, 0);
            stats[stat] = clamp(statValue, 0.75, 5.75);
        });
        return {
            partGroups: partGroups,
            stats: stats
        };
    }
    function cartesianProduct(arr) {
        return arr.reduce(function (a, b) {
            return a.map(function (x) { return b.map(function (y) { return x.concat(y); }); })
                .reduce(function (a, b) { return a.concat(b); }, []);
        }, [[]]);
    }
    function genBuilds() {
        var groups = Object.keys(Data.PartStats).map(function (type) { return Data.PartStats[type]; });
        return cartesianProduct(groups).map(createBuild);
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
    var allBuilds = genBuilds();
    Calculator.allParts = genParts();
    function scoreBuilds(weights) {
        var scoredBuilds = allBuilds.map(function (build) { return ({
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
        var weights = {};
        Data.Statistics.forEach(function (stat) {
            var rangeInput = document.getElementById(getStatisticSliderId(stat));
            weights[stat] = parseInt(rangeInput.value);
        });
        return weights;
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
UI.init({
    slidersDiv: document.getElementById("sliders"),
    calculateButton: document.getElementById("calculate"),
    resultsDiv: document.getElementById("results")
});
//# sourceMappingURL=main.js.map