"use strict";
var Data;
(function (Data) {
    /**
     * STATISTICS
     */
    Data.StatisticNames = [
        "Speed",
        "Speed (Water)",
        "Speed (Air)",
        "Speed (Anti-Gravity)",
        "Acceleration",
        "Weight",
        "Handling",
        "Handling (Water)",
        "Handling (Air)",
        "Handling (Anti-Gravity)",
        "Traction",
        "Mini-Turbo"
    ];
    // Data comes from https://www.mariowiki.com/Mario_Kart_8_Deluxe#Renewed_statistics
    var CharacterStats = [];
    var KartBikeStats = [];
    var TireStats = [];
    var GliderStats = [];
    Data.PartStats = [
        { type: "Character", stats: CharacterStats },
        { type: "Kart/Bike", stats: KartBikeStats },
        { type: "Tires", stats: TireStats },
        { type: "Glider", stats: GliderStats }
    ];
    var Characters = [];
    var KartBikes = [];
    var Tires = [];
    var Gliders = [];
    Data.Parts = [
        { type: "Character", parts: Characters },
        { type: "Kart/Bike", parts: KartBikes },
        { type: "Tires", parts: Tires },
        { type: "Glider", parts: Gliders }
    ];
})(Data || (Data = {}));
//# sourceMappingURL=data.js.map