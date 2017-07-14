namespace Data {
    type PartType = "Character" | "Kart/Bike" | "Tires" | "Glider"

    /**
     * STATISTICS
     */
    export const StatisticNames = [
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

    type Statistics = number[]

    // Data comes from https://www.mariowiki.com/Mario_Kart_8_Deluxe#Renewed_statistics

    const CharacterStats: Statistics[] = [

    ]

    const KartBikeStats: Statistics[] = [

    ]

    const TireStats: Statistics[] = [

    ]

    const GliderStats: Statistics[] = [

    ]

    export const PartStats: [PartType, Statistics[]][] = [
        ["Character", CharacterStats],
        ["Kart/Bike", KartBikeStats],
        ["Tires", TireStats],
        ["Glider", GliderStats]
    ]

    /**
     * PARTS
     */

    type Part = {
        tier: number,
        name: string
    }

    const Characters: Part[] = [

    ]

    const KartBikes: Part[] = [

    ]

    const Tires: Part[] = [

    ]

    const Gliders: Part[] = [

    ]

    export const Parts: [PartType, Part[]][] = [
        ["Character", Characters],
        ["Kart/Bike", KartBikes],
        ["Tires", Tires],
        ["Glider", Gliders]
    ]
}