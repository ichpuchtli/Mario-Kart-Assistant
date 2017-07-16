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
    function init() {
        var builds = genBuilds();
        console.log(builds);
    }
    Program.init = init;
})(Program || (Program = {}));
Program.init();
//# sourceMappingURL=main.js.map