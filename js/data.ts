namespace Data {
    type PartType = "Character" | "Kart/Bike" | "Tires" | "Glider"

    /**
     * STATISTICS
     */
    export const StatisticNames = [
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

    type PartTypeStatList = {
        type: PartType,
        stats: Statistics[],
    }

    export const PartStats: PartTypeStatList[] = [
        { type: "Character", stats: CharacterStats },
        { type: "Kart/Bike", stats: KartBikeStats },
        { type: "Tires", stats: TireStats },
        { type: "Glider", stats: GliderStats }
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

    type PartTypePartList = {
        type: PartType,
        parts: Part[]
    }

    export const Parts: PartTypePartList[] = [
        { type: "Character", parts: Characters },
        { type: "Kart/Bike", parts: KartBikes },
        { type: "Tires", parts: Tires },
        { type: "Glider", parts: Gliders }
    ]
}