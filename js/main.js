"use strict";
var Program;
(function (Program) {
    function init() {
        var stats = Data.PartStats;
        console.log(stats);
        var parts = Data.Parts;
        console.log(parts);
    }
    Program.init = init;
})(Program || (Program = {}));
Program.init();
//# sourceMappingURL=main.js.map