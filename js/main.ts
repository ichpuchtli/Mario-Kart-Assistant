namespace Util {
    export function clamp(num: number, min: number, max: number): number {
        return Math.min(Math.max(num, min), max);
    }

    export function cartesianProduct<T>(arr: T[][]): T[][] {
        return arr.reduce((a, b) =>
            a.map(x => b.map(y => x.concat(y)))
                .reduce((a, b) => a.concat(b), []), [[]] as T[][]);
    }

    /**
     * Takes an array and a function that maps each of it's elements to a key, value pair, then turns that key value pair into an object
     * @param arr array being mapped to object
     * @param mapFunc function which maps elements of arr to key, value pair
     */
    export function constructObject<A, K extends string, V>(arr: A[], mapFunc: (elem: A, index: number) => [K, V]): {[key in K]: V} {
        return arr.map(mapFunc).reduce((obj, entry) => {
            obj[entry[0]] = entry[1];
            return obj;
        }, {} as {[key in K]: V});
    }
}

namespace Calculator {
    type Build = {
        readonly partGroups: Data.PartGroup[],
        readonly stats: {[key in Data.Statistic]: number}
    }

    function createBuild(partGroups: Data.PartGroup[]): Build {
        const stats = Util.constructObject(Data.Statistics, (stat, i) => {
            const statValue = partGroups.reduce((a, b) => a + b.statValues[i], 0);
            return [stat, Util.clamp(statValue, 0.75, 5.75)];
        });
        return { partGroups, stats };
    }

    function genBuilds(): Build[] {
        const groups = Object.keys(Data.PartStats).map((type: Data.PartType) => Data.PartStats[type]);
        return Util.cartesianProduct(groups).map(createBuild);
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

    export const allBuilds: Build[] = genBuilds();
    export const allParts: PartInfo[] = genParts();

    type ScoredBuild = {
        score: number,
        build: Build
    }

    export type Weights = {[key in Data.Statistic]: number};

    function normaliseWeights(weights: Weights): Weights {
        const sum = Data.Statistics.reduce((total, stat) => total + weights[stat], 0);
        return Util.constructObject(Data.Statistics, stat => [stat, weights[stat]/sum]);
    }

    /**
     * Gets the Weighted Product Model ratio of the two builds https://en.wikipedia.org/wiki/Weighted_product_model
     */
    function getBuildRatio(a: Build, b: Build, normWeights: Weights) {
        return Data.Statistics.reduce((r, stat) => r * Math.pow(a.stats[stat] / b.stats[stat], normWeights[stat]), 1);
    }

    function findBestBuild(normWeights: Weights): Build {
        return allBuilds.reduce((a, b) => getBuildRatio(a, b, normWeights) > 1 ? a : b, allBuilds[0]);
    }

    export function scoreBuilds(weights: Weights): ScoredBuild[] {
        const normWeights = normaliseWeights(weights);
        const bestBuild = findBestBuild(normWeights);
        const scoredBuilds: ScoredBuild[] = allBuilds.map(build => ({
            score: getBuildRatio(build, bestBuild, normWeights),
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
            rangeInput.defaultValue = "5";
            rangeInput.max = "10";
            rangeInput.min = "0";
            sliderDiv.appendChild(rangeInput);
            sliderDiv.appendChild(document.createTextNode(String(stat)));
            elements.slidersDiv.appendChild(sliderDiv);
        });
        elements.calculateButton.onclick = () => recalculateResults(elements.resultsDiv);
    }

    function getWeights(): Calculator.Weights {
        return Util.constructObject(Data.Statistics, stat => {
            const rangeInput = document.getElementById(getStatisticSliderId(stat)) as HTMLInputElement;
            return [stat, parseInt(rangeInput.value)];
        });
    }

    export function recalculateResults(resultsDiv: HTMLDivElement) {
        resultsDiv.innerHTML = "";
        const scores = Calculator.scoreBuilds(getWeights()).slice(0, 10);
        scores.forEach(score => {
            const resultDiv = document.createElement("div");
            resultDiv.appendChild(document.createTextNode("Score: " + (score.score*100).toFixed(2) + "%"));
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