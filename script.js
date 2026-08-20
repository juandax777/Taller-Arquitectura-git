const airports = [
  { code: 'BOG', name: 'Bogotá - El Dorado', lat: 4.70159, lon: -74.1469 },
  { code: 'MDE', name: 'Medellín - José María Córdova', lat: 6.1644, lon: -75.4231 },
  { code: 'CTG', name: 'Cartagena - Rafael Núñez', lat: 10.4425, lon: -75.5131 },
  { code: 'CLO', name: 'Cali - Alfonso Bonilla Aragón', lat: 3.5411, lon: -76.3816 },
  { code: 'BAQ', name: 'Barranquilla - Ernesto Cortissoz', lat: 10.8896, lon: -74.7808 },
  { code: 'PEI', name: 'Pereira - Matecaña', lat: 4.8127, lon: -75.7409 },
  { code: 'BGA', name: 'Bucaramanga - Palonegro', lat: 7.1265, lon: -73.1844 },
  { code: 'ADZ', name: 'San Andrés - Gustavo Rojas Pinilla', lat: 12.5833, lon: -81.7081 }
];

const departureAirport = document.getElementById('departureAirport');
const arrivalAirport = document.getElementById('arrivalAirport');
const hourlyIntensity = document.getElementById('hourlyIntensity');
const intensityValue = document.getElementById('intensityValue');

function populateAirportOptions() {
  airports.forEach((airport) => {
    const departureOption = document.createElement('option');
    departureOption.value = airport.code;
    departureOption.textContent = `${airport.code} - ${airport.name}`;
    departureAirport.appendChild(departureOption);

    const arrivalOption = document.createElement('option');
    arrivalOption.value = airport.code;
    arrivalOption.textContent = `${airport.code} - ${airport.name}`;
    arrivalAirport.appendChild(arrivalOption);
  });
}

function getAirportByCode(code) {
  return airports.find((airport) => airport.code === code) || null;
}

function renderMap() {
  const departure = getAirportByCode(departureAirport.value);
  const arrival = getAirportByCode(arrivalAirport.value);
  const intensity = Number(hourlyIntensity.value);
  intensityValue.textContent = `${intensity}%`;

  const baseLat = airports.map((airport) => airport.lat);
  const baseLon = airports.map((airport) => airport.lon);
  const labels = airports.map((airport) => airport.code);

  const traces = [
    {
      type: 'scattergeo',
      mode: 'markers+text',
      lat: baseLat,
      lon: baseLon,
      text: labels,
      textposition: 'top center',
      marker: {
        size: 12,
        color: '#0d6efd',
        line: { width: 1, color: '#ffffff' }
      },
      hoverinfo: 'text'
    }
  ];

  if (departure && arrival) {
    traces.push({
      type: 'scattergeo',
      mode: 'lines',
      lat: [departure.lat, arrival.lat],
      lon: [departure.lon, arrival.lon],
      line: {
        color: '#ff6b35',
        width: 3 + intensity / 25
      },
      hoverinfo: 'skip'
    });
  }

  const layout = {
    margin: { l: 0, r: 0, t: 0, b: 0 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    geo: {
      scope: 'south america',
      projection: { type: 'mercator' },
      showland: true,
      landcolor: '#e9f9ec',
      showcountries: true,
      countrycolor: '#556b6b',
      countrywidth: 1,
      showcoastlines: false,
      showframe: false,
      bgcolor: '#f8fbff',
      center: { lat: 4.5, lon: -74.1 },
      lataxis: { range: [-5, 14] },
      lonaxis: { range: [-82, -66] }
    }
  };

  Plotly.newPlot('colombiaMap', traces, layout, {
    responsive: true,
    displaylogo: false,
    scrollZoom: false
  });
}

populateAirportOptions();
departureAirport.value = 'BOG';
arrivalAirport.value = 'MDE';
hourlyIntensity.addEventListener('input', renderMap);
departureAirport.addEventListener('change', renderMap);
arrivalAirport.addEventListener('change', renderMap);

document.getElementById('itineraryForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const departure = getAirportByCode(departureAirport.value);
  const arrival = getAirportByCode(arrivalAirport.value);
  const intensity = Number(hourlyIntensity.value);

  const message = departure && arrival
    ? `Itinerario creado: ${departure.code} → ${arrival.code} con intensidad horaria ${intensity}%.`
    : 'Selecciona un aeropuerto de salida y llegada para crear el itinerario.';

  alert(message);
});

renderMap();
window.addEventListener('resize', () => Plotly.Plots.resize('colombiaMap'));
