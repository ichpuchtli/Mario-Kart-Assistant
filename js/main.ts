namespace Calculator {
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
                    ({ type, partGroup, partNum }))), [] as PartInfo[])), [] as PartInfo[])
    }

    const allBuilds: Build[] = genBuilds();
    export const allParts: PartInfo[] = genParts();

    type ScoredBuild = {
        score: number,
        build: Build
    }

    export function scoreBuilds(weights: {[key in Data.Statistic]: number}): ScoredBuild[] {
        const scoredBuilds: ScoredBuild[] = allBuilds.map(build => ({
            score: Data.Statistics.reduce((sum, stat) => sum + build.stats[stat] * weights[stat], 0),
            build
        }));
        return scoredBuilds.sort((a, b) => b.score - a.score);
    }
}

namespace UI {
    type UIElements = {
        slidersDiv: HTMLDivElement,
        calculateButton: HTMLButtonElement,
        resultsDiv: HTMLDivElement
    }

    function getStatisticSliderId(stat: Data.Statistic) {
        return "slider-" + String(stat).replace(" ", "_");
    }

    export function init(elements: UIElements) {
        elements.slidersDiv.innerHTML = "";
        elements.resultsDiv.innerHTML = "";
        Data.Statistics.forEach(stat => {
            const sliderDiv = document.createElement("div");
            const rangeInput = document.createElement("input");
            rangeInput.id = getStatisticSliderId(stat);
            rangeInput.type = "range";
            rangeInput.defaultValue = "50";
            sliderDiv.appendChild(rangeInput);
            sliderDiv.appendChild(document.createTextNode(String(stat)));
            elements.slidersDiv.appendChild(sliderDiv);
        });
        elements.calculateButton.onclick = () => recalculateResults(elements.resultsDiv);
    }

    function getWeights(): {[key in Data.Statistic]: number} {
        let weights: {[key in Data.Statistic]?: number} = {};
        Data.Statistics.forEach(stat => {
            const rangeInput = document.getElementById(getStatisticSliderId(stat)) as HTMLInputElement;
            weights[stat] = parseInt(rangeInput.value);
        });
        return weights as {[key in Data.Statistic]: number};
    }

    export function recalculateResults(resultsDiv: HTMLDivElement) {
        resultsDiv.innerHTML = "";
        const scores = Calculator.scoreBuilds(getWeights()).slice(0, 10);
        scores.forEach(score => {
            const resultDiv = document.createElement("div");
            resultDiv.appendChild(document.createTextNode("Score: " + score.score));
            resultDiv.appendChild(document.createElement("br"));
            resultDiv.appendChild(document.createTextNode("Build: " + score.build.partGroups.map(g => "[" + g.parts.map(p => p.name).join(", ") + "]").join(", ")));
            resultDiv.appendChild(document.createElement("br"));
            resultDiv.appendChild(document.createTextNode("Stats: " + Data.Statistics.map((s: Data.Statistic) => String(s) + ": " + score.build.stats[s]).join(", ")));
            resultDiv.appendChild(document.createElement("br"));
            resultDiv.appendChild(document.createElement("br"));
            resultsDiv.appendChild(resultDiv);
        })
    }
}

UI.init({
    slidersDiv: document.getElementById("sliders") as HTMLDivElement,
    calculateButton: document.getElementById("calculate") as HTMLButtonElement,
    resultsDiv: document.getElementById("results") as HTMLDivElement
})