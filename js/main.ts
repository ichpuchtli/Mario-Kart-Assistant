namespace Program {
    type Build = {
        readonly partGroups: Data.PartGroup[],
        readonly stats: {[key in Data.Statistic]: number}
    }

    function clamp(num: number, min: number, max: number): number {
        return Math.min(Math.max(num, min), max);
    }

    function createBuild(partGroups: Data.PartGroup[]): Build {
        let stats: {[key in Data.Statistic]?: number} = {};
        Data.Statistics.forEach((stat, i) => {
            const statValue = partGroups.reduce((a, b) => a + b.statValues[i], 0);
            stats[stat] = clamp(statValue, 0.75, 5.75);
        });
        return {
            partGroups: partGroups, 
            stats: stats as {[key in Data.Statistic]: number}
        }
    }

    function cartesianProduct<T>(arr: T[][]): T[][] {
        return arr.reduce((a, b) =>
            a.map(x => b.map(y => x.concat(y)))
                .reduce((a, b) => a.concat(b), []), [[]] as T[][]);
    }

    function genBuilds(): Build[] {
        const groups = Object.keys(Data.PartStats).map((type: Data.PartType) => Data.PartStats[type]);
        return cartesianProduct(groups).map(createBuild);
    }

    type PartInfo = {
        type: Data.PartType,
        partGroup: Data.PartGroup,
        partNum: number
    }

    function genParts(): PartInfo[] {
        return Object.keys(Data.PartStats).reduce((a, type: Data.PartType) => 
            a.concat(Data.PartStats[type].reduce((a, partGroup) => 
                a.concat(partGroup.parts.map((_, partNum) => 
                    ({type, partGroup, partNum}))), [] as PartInfo[])), [] as PartInfo[])
    }

    function getWeights(): {[key in Data.Statistic]: number} {
        let weights: {[key in Data.Statistic]?: number} = {};
        Data.Statistics.forEach(stat => {
            weights[stat] = 1; // TODO, get this from UI
        });
        return weights as {[key in Data.Statistic]: number};
    }

    export const allBuilds: Build[] = genBuilds();
    export const allParts: PartInfo[] = genParts();
    export function init() {
        console.log(allBuilds);
        console.log(allParts);
    }

    type ScoredBuild = {
        score: number,
        build: Build
    }

    export function scoreBuilds(): ScoredBuild[] {
        const weights = getWeights();
        const scoredBuilds: ScoredBuild[] = allBuilds.map(build => ({
            score: Data.Statistics.reduce((sum, stat) => sum + build.stats[stat] * weights[stat], 0),
            build
        }));
        return scoredBuilds.sort((a, b) => b.score - a.score);
    }
}

Program.init();
console.log(Program.scoreBuilds());