"use strict";
var Data;
(function (Data) {
    /**
     * All the statistics used in the calculator
     */
    var Statistic;
    (function (Statistic) {
        Statistic["Speed"] = "Speed";
        Statistic["SpeedWater"] = "Speed (Water)";
        Statistic["SpeedAir"] = "Speed (Air)";
        Statistic["SpeedAntiGrav"] = "Speed (Anti-Gravity)";
        Statistic["Acceleration"] = "Acceleration";
        Statistic["Weight"] = "Weight";
        Statistic["Handling"] = "Handling";
        Statistic["HandlingWater"] = "Handling (Water)";
        Statistic["HandlingAir"] = "Handling (Air)";
        Statistic["HandlingAntiGrav"] = "Handling (Anti-Gravity)";
        Statistic["Traction"] = "Traction";
        Statistic["MiniTurbo"] = "Mini-Turbo";
    })(Statistic = Data.Statistic || (Data.Statistic = {}));
    /**
     * All the possible types of parts
     */
    var PartType;
    (function (PartType) {
        PartType["Character"] = "Character";
        PartType["Body"] = "Body";
        PartType["Tires"] = "Tires";
        PartType["Glider"] = "Glider";
    })(PartType = Data.PartType || (Data.PartType = {}));
    // Data comes from https://www.mariowiki.com/Mario_Kart_8_Deluxe#Renewed_statistics
    var CharacterStats = {
        statOffset: 2,
        groups: [
            { name: "Light (1)", statValues: [1, 2, 3, 0, 8, 0, 12, 10, 12, 12, 9, 8], parts: [{ name: "Baby Peach" }, { name: "Baby Daisy" }] },
            { name: "Light (2)", statValues: [1, 2, 3, 0, 9, 0, 11, 9, 11, 11, 7, 8], parts: [{ name: "Baby Rosalina" }, { name: "Lemmy" }] },
            { name: "Light (3)", statValues: [2, 3, 4, 1, 9, 1, 10, 8, 10, 10, 8, 7], parts: [{ name: "Baby Mario" }, { name: "Baby Luigi" }, { name: "Dry Bones" }, { name: "Mii (Light)" }] },
            { name: "Light (4)", statValues: [3, 4, 5, 2, 8, 2, 10, 8, 10, 10, 9, 7], parts: [{ name: "Koopa" }, { name: "Lakitu" }, { name: "Bowser Jr." }] },
            { name: "Light (5)", statValues: [3, 4, 5, 2, 9, 2, 9, 7, 9, 9, 6, 7], parts: [{ name: "Toadette" }, { name: "Wendy" }, { name: "Isabelle" }] },
            { name: "Light (6)", statValues: [4, 5, 6, 3, 8, 3, 9, 7, 9, 9, 8, 6], parts: [{ name: "Toad" }, { name: "Shy Guy" }, { name: "Larry" }] },
            { name: "Medium (1)", statValues: [5, 6, 7, 4, 8, 3, 8, 6, 8, 8, 7, 6], parts: [{ name: "Cat Peach" }, { name: "Inkling Girl" }, { name: "Villager (F)" }] },
            { name: "Medium (2)", statValues: [6, 7, 8, 5, 7, 4, 7, 5, 7, 7, 7, 6], parts: [{ name: "Peach" }, { name: "Daisy" }, { name: "Yoshi" }] },
            { name: "Medium (3)", statValues: [6, 7, 8, 5, 7, 5, 7, 5, 7, 7, 5, 6], parts: [{ name: "Tanooki Mario" }, { name: "Inking Boy" }, { name: "Villager (M)" }] },
            { name: "Medium (4)", statValues: [7, 8, 9, 6, 6, 6, 7, 5, 7, 7, 5, 5], parts: [{ name: "Luigi" }, { name: "Iggy" }] },
            { name: "Medium (5)", statValues: [7, 8, 9, 6, 6, 6, 6, 4, 6, 6, 6, 5], parts: [{ name: "Mario" }, { name: "Ludwig" }, { name: "Mii (Medium)" }] },
            { name: "Heavy (1)", statValues: [8, 9, 10, 7, 5, 7, 5, 3, 5, 5, 7, 5], parts: [{ name: "Rosalina" }, { name: "King Boo" }, { name: "Link" }] },
            { name: "Heavy (2)", statValues: [10, 11, 12, 9, 5, 8, 4, 2, 4, 4, 4, 4], parts: [{ name: "Waluigi" }, { name: "Donkey Kong" }, { name: "Roy" }] },
            { name: "Heavy (3)", statValues: [11, 12, 13, 10, 4, 9, 3, 1, 3, 3, 5, 3], parts: [{ name: "Wario" }, { name: "Dry Bowser" }] },
            { name: "Heavy (4)", statValues: [9, 10, 11, 8, 5, 10, 5, 3, 5, 5, 5, 4], parts: [{ name: "Metal Mario" }, { name: "Pink Gold Peach" }] },
            { name: "Heavy (5)", statValues: [11, 12, 13, 10, 4, 10, 2, 0, 2, 2, 4, 3], parts: [{ name: "Bowser" }, { name: "Morton" }, { name: "Mii (Heavy)" }] }
        ]
    };
    var BodyStats = {
        statOffset: -1,
        groups: [
            { name: "Body Group 1", statValues: [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4], parts: [{ name: "Standard Kart" }, { name: "300 SL Roadster" }, { name: "The Duke" }] },
            { name: "Body Group 2", statValues: [2, 4, 2, 2, 6, 3, 6, 6, 3, 5, 5, 6], parts: [{ name: "Pipe Frame" }, { name: "Varmint" }, { name: "City Tripper" }] },
            { name: "Body Group 3", statValues: [4, 4, 5, 6, 3, 5, 3, 4, 3, 5, 5, 4], parts: [{ name: "Mach 8" }, { name: "Sports Coupe" }, { name: "Inkstriker" }] },
            { name: "Body Group 4", statValues: [5, 6, 1, 3, 1, 6, 2, 7, 2, 2, 4, 2], parts: [{ name: "Steel Driver" }, { name: "Tri-Speeder" }, { name: "Bone Rattler" }] },
            { name: "Body Group 5", statValues: [3, 3, 5, 4, 5, 4, 5, 4, 5, 4, 4, 5], parts: [{ name: "Cat Cruiser" }, { name: "Comet" }, { name: "Yoshi Bike" }, { name: "Teddy Buggy" }] },
            { name: "Body Group 6", statValues: [6, 2, 3, 5, 1, 5, 2, 3, 1, 3, 2, 1], parts: [{ name: "Circuit Special" }, { name: "B Dasher" }, { name: "P-Wing" }] },
            { name: "Body Group 7", statValues: [6, 3, 2, 4, 0, 6, 1, 3, 1, 2, 6, 0], parts: [{ name: "Badwagon" }, { name: "GLA" }, { name: "Standard ATV" }] },
            { name: "Body Group 8", statValues: [5, 4, 4, 4, 2, 3, 4, 5, 4, 3, 3, 3], parts: [{ name: "Prancer" }, { name: "Sport Bike" }, { name: "Jet Bike" }] },
            { name: "Body Group 9", statValues: [1, 2, 2, 3, 7, 2, 6, 6, 5, 6, 5, 7], parts: [{ name: "Biddybuggy" }, { name: "Mr. Scooty" }] },
            { name: "Body Group 10", statValues: [2, 6, 3, 1, 6, 2, 5, 7, 4, 3, 7, 6], parts: [{ name: "Landship" }] },
            { name: "Body Group 11", statValues: [5, 3, 4, 4, 2, 4, 4, 4, 3, 4, 1, 3], parts: [{ name: "Sneeker" }, { name: "Gold Standard" }, { name: "Master Cycle" }] },
            { name: "Body Group 12", statValues: [3, 3, 4, 5, 5, 3, 5, 5, 4, 5, 6, 5], parts: [{ name: "W 25 Silver Arrow" }, { name: "Standard Bike" }, { name: "Flame Rider" }, { name: "Wild Wiggler" }] },
            { name: "Body Group 13", statValues: [5, 3, 4, 5, 3, 2, 3, 5, 2, 6, 4, 3], parts: [{ name: "Blue Falcon" }, { name: "Splat Buggy" }] },
            { name: "Body Group 14", statValues: [3, 5, 4, 4, 2, 5, 5, 6, 4, 4, 8, 3], parts: [{ name: "Tanooki Kart" }, { name: "Koopa Clown" }] },
            { name: "Body Group 15", statValues: [2, 5, 3, 1, 6, 2, 5, 7, 4, 3, 7, 6], parts: [{ name: "Streetle" }] }
        ]
    };
    var TireStats = {
        statOffset: -1.25,
        groups: [
            { name: "Tires Group 1", statValues: [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], parts: [{ name: "Standard" }, { name: "Blue Standard" }, { name: "GLA Tires" }] },
            { name: "Tires Group 2", statValues: [5, 4, 3, 5, 3, 7, 2, 3, 3, 2, 7, 4], parts: [{ name: "Monster" }, { name: "Hot Monster" }] },
            { name: "Tires Group 3", statValues: [3, 5, 5, 3, 7, 3, 6, 6, 6, 6, 4, 8], parts: [{ name: "Roller" }, { name: "Azure Roller" }] },
            { name: "Tires Group 4", statValues: [6, 4, 4, 7, 3, 5, 6, 6, 6, 5, 1, 4], parts: [{ name: "Slim" }, { name: "Wood" }, { name: "Crimson Slim" }] },
            { name: "Tires Group 5", statValues: [7, 2, 2, 7, 2, 6, 4, 2, 3, 4, 0, 2], parts: [{ name: "Slick" }, { name: "Cyber Slick" }] },
            { name: "Tires Group 6", statValues: [7, 5, 4, 4, 1, 7, 4, 4, 2, 3, 2, 2], parts: [{ name: "Metal" }, { name: "Gold Tires" }] },
            { name: "Tires Group 7", statValues: [4, 4, 4, 5, 6, 3, 5, 5, 4, 6, 3, 7], parts: [{ name: "Button" }, { name: "Leaf Tires" }] },
            { name: "Tires Group 8", statValues: [6, 6, 3, 5, 4, 6, 3, 3, 3, 4, 6, 3], parts: [{ name: "Off-Road" }, { name: "Retro Off-Road" }, { name: "Triforce Tires" }] },
            { name: "Tires Group 9", statValues: [4, 3, 6, 4, 5, 4, 4, 3, 5, 5, 6, 6], parts: [{ name: "Sponge" }, { name: "Cushion" }] }
        ]
    };
    var GliderStats = {
        statOffset: -0.25,
        groups: [
            { name: "Glider Group 1", statValues: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], parts: [{ name: "Super Glider" }, { name: "Waddle Wing" }, { name: "Hylian Kite" }] },
            { name: "Glider Group 1", statValues: [0, 1, 0, 2, 2, 0, 1, 1, 2, 1, 1, 2], parts: [{ name: "Cloud Glider" }, { name: "Parachute" }, { name: "Flower Glider" }, { name: "Paper Glider" }] },
            { name: "Glider Group 1", statValues: [1, 0, 1, 2, 1, 2, 1, 2, 1, 0, 0, 1], parts: [{ name: "Wario Wing" }, { name: "Plane Glider" }, { name: "Gold Glider" }] },
            { name: "Glider Group 1", statValues: [0, 0, 0, 2, 2, 1, 1, 2, 2, 0, 0, 2], parts: [{ name: "Peach Parasol" }, { name: "Parafoil" }, { name: "Bowser Kite" }, { name: "MKTV Parafoil" }] }
        ]
    };
    Data.PartStats = {
        "Character": CharacterStats,
        "Body": BodyStats,
        "Tires": TireStats,
        "Glider": GliderStats
    };
})(Data || (Data = {}));
//# sourceMappingURL=data.js.map