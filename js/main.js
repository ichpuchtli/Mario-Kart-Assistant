"use strict";
var Program;
(function (Program) {
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
    function getWeights() {
        var weights = {};
        Data.Statistics.forEach(function (stat) {
            weights[stat] = 1; // TODO, get this from UI
        });
        return weights;
    }
    Program.allBuilds = genBuilds();
    Program.allParts = genParts();
    function init() {
        console.log(Program.allBuilds);
        console.log(Program.allParts);
    }
    Program.init = init;
    function scoreBuilds() {
        var weights = getWeights();
        var scoredBuilds = Program.allBuilds.map(function (build) { return ({
            score: Data.Statistics.reduce(function (sum, stat) { return sum + build.stats[stat] * weights[stat]; }, 0),
            build: build
        }); });
        return scoredBuilds.sort(function (a, b) { return b.score - a.score; });
    }
    Program.scoreBuilds = scoreBuilds;
})(Program || (Program = {}));
Program.init();
console.log(Program.scoreBuilds());
//# sourceMappingURL=main.js.map