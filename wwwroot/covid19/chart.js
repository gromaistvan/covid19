(async function() {
    const response = await fetch('https://covid.ourworldindata.org/data/owid-covid-data.json');
    const json = await response.json();
    const ctx = document.getElementById('chart').getContext('2d');
    const data = [];
    for (const country of Object.keys(json)) {
        const item = json[country];
        const lastData = item.data[item.data.length - 1];
        if (! lastData) continue;
        const vaccinated = 100 * lastData.people_vaccinated / item.population;
        if (! vaccinated) continue;
        const fullyVaccinated = 100 * lastData.people_fully_vaccinated / item.population;
        if (! fullyVaccinated) continue;
        const name = item.continent ? `${item.location} (${item.continent})` : item.location;
        data.push({
            country: name,
            population: item.population,
            vaccinatedOnce: lastData.people_vaccinated,
            vaccinatedTwice: lastData.people_fully_vaccinated,
            vaccinated,
            fullyVaccinated,
            percent: vaccinated.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 }),
        });
    }
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [...data.sort((d1, d2) => d2.vaccinated - d1.vaccinated).map(d => d.country)],
            datasets: [
                {
                    label: 'People vaccinated (%)',
                    data,
                    parsing: {
                        xAxisKey: 'country',
                        yAxisKey: 'vaccinated'
                    },
                    backgroundColor: 'Indigo'
                },
                {
                    label: 'People fully vaccinated (%)',
                    data,
                    parsing: {
                        xAxisKey: 'country',
                        yAxisKey: 'fullyVaccinated'
                    },
                    backgroundColor: 'coral' /*function(context) {
                        switch (context.dataIndex % 3) {
                            case 0: return 'Coral';
                            case 1: return 'DarkSlateBlue';
                            case 2: return 'DarkKhaki';
                            case 3: return 'Indigo';
                            case 4: return 'LightSteelBlue';
                        }
                    }*/
                },
            ]
        },
        options: {
            responsive: true,
        }
    });
    return chart;
})();