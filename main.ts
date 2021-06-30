interface CovidRecord {
    country: string;
    population: number;
    vaccinatedOnce: number;
    vaccinatedTwice: number;
    vaccinated: number;
    percent: string;
}

const data: Array<CovidRecord> = [];
const response = await fetch("https://covid.ourworldindata.org/data/owid-covid-data.json");
const json = await response.json();
for (const country of Object.keys(json)) {
    const item = json[country];
    const lastData = item.data[item.data.length - 1];
    const vaccinated = lastData.people_vaccinated / item.population;
    if (! vaccinated) continue;
    data.push({
        country: item.continent ? `${item.continent}|${item.location}` : item.location,
        population: item.population,
        vaccinatedOnce: lastData.people_vaccinated,
        vaccinatedTwice: lastData.people_fully_vaccinated,
        vaccinated: vaccinated,
        percent: vaccinated.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }),
    });
}

console.table(data.sort((a, b) => b.vaccinated - a.vaccinated), ["country", "percent"]);
