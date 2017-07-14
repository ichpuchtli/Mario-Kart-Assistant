"use strict";
var Data;
(function (Data) {
    /**
     * STATISTICS
     */
    Data.StatisticNames = [
        "Speed",
        "Acceleration",
        "Weight",
        "Handling",
        "Traction",
        "Mini-Turbo",
        "Speed (Water)",
        "Speed (Air)",
        "Speed (Anti-Gravity)",
        "Handling (Water)",
        "Handling (Air)",
        "Handling (Anti-Gravity)"
    ];
    // Data comes from https://www.mariowiki.com/Mario_Kart_8_Deluxe#Renewed_statistics
    var CharacterStats = [];
    var KartBikeStats = [];
    var TireStats = [];
    var GliderStats = [];
    Data.PartStats = [
        ["Character", CharacterStats],
        ["Kart/Bike", KartBikeStats],
        ["Tires", TireStats],
        ["Glider", GliderStats]
    ];
    var Characters = [];
    var KartBikes = [];
    var Tires = [];
    var Gliders = [];
    Data.Parts = [
        ["Character", Characters],
        ["Kart/Bike", KartBikes],
        ["Tires", Tires],
        ["Glider", Gliders]
    ];
})(Data || (Data = {}));
//# sourceMappingURL=data.js.map