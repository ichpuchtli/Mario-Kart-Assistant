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
        const groups = Object.keys(Data.PartStats).map(type => Data.PartStats[type]);
        return cartesianProduct(groups).map(createBuild);
    }

    export function init() {
        const builds = genBuilds();
        console.log(builds);
    }
}

Program.init();