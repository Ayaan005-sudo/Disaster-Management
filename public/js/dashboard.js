
        document.addEventListener("DOMContentLoaded", function () {


  const map = L.map('map').setView([20, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map); 
 // Step 1: ReliefWeb se country names fetch karo
 async function getAffectedCountries() {
    let Disasters=[];
    const res = await fetch("https://api.reliefweb.int/v1/reports?appname=ayaan-disasterdashboard-b7k9&limit=10&sort[]=date:desc&fields[include][]=disaster&fields[include][]=country&fields[include][]=date&fields[include][]=url&fields[include][]=title");
    const data = await res.json();
    console.log(data);
    console.log(data.data);
     Disasters=data.data.filter(r=>r.fields.disaster&&r.fields.disaster.length>0);
      console.log(Disasters);
  
    const affectedSet = new Set();

    Disasters.forEach(report => {
      report.fields.country.forEach(c => {
        const rawNames = c.name.split(/,\s*/);
        rawNames.forEach(name => {
          const cleaned = name
            .replace(/\(.*?\)/g, '')
            .replace(/Republic.*$/, '')
            .replace(/,.*$/, '')
            .trim();
          if (cleaned.toLowerCase() !== 'world' && cleaned.length > 1) {
            affectedSet.add(cleaned);
          }
                  });
      });
    });
 console.log("Affected country count:", affectedSet.size);
    return [...affectedSet];
  }

  // Step 2: Geocode country name to lat/lng
  async function getLatLngFromCountry(country) {
   

    try {
      const res = await fetch(`/home/dashboard/data/${country}`);
      const data = await res.json();
      const { lat, lng } = data.results[0].geometry;
      return [lat, lng];
    } catch (err) {
      console.warn("Geocode failed for:", country);
      return null;
    }
  }

  // Step 3: Loop and draw on Leaflet map
  async function plotDisastersOnMap() {
    const countries = await getAffectedCountries();
 document.getElementById("country-count-box").textContent = countries.length;
    for (const country of countries) {
      const coords = await getLatLngFromCountry(country);
      if (coords) {
        L.circle(coords, {
          color: 'red',
          fillColor: 'red',
          fillOpacity: 0.5,
          radius: 50000
        }).addTo(map);
      }
    }
  }

  plotDisastersOnMap();



   const ctx = document.getElementById('disasterDonutChart').getContext('2d');

  const data = {
    labels: ['Flood', 'Storm', 'Epidemic', 'Earthquake','Massmovement'], // Disaster types
    datasets: [{
      label: 'Disaster Type Distribution',
      data: [5012, 3585, 1265, 935,634], // Counts
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0','#4BC0C0'
      ],
      borderWidth: 1
    }]
  };

  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Disaster Type Distribution'
        }
        
      }
    }
  };
  new Chart(ctx, config);

        });
  
  document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('countryLineChart').getContext('2d');

    const countries = ['USA', 'CHN', 'IND', 'PHL', 'IDN', 'BGD'];
    const disasterCounts = [881, 835, 532, 500, 481, 243];

    const data = {
      labels: countries,
      datasets: [{
        label: 'Disaster Events per Country',
        data: disasterCounts,
        fill: false,
        borderColor: '#36A2EB',
        backgroundColor: '#36A2EB',
        tension: 0.3
      }]
    };

    const config = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Top 6 Countries by Disaster Count'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Disaster Count'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Country'
            }
          }
        }
      }
    };

    new Chart(ctx, config);
  });



        




        
   
 