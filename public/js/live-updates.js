
async function getdis() {
  const res = await fetch("https://eonet.gsfc.nasa.gov/api/v3/events?limit=20&orderby=desc");
  const data = await res.json();

  const container = document.getElementById("cards-container");

  data.events.forEach(e => {
    
    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "18rem";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = e.title;

    const desc = document.createElement("h6");
    desc.className = "card-subtitle mb-2 text-body-secondary";
    desc.textContent = e.description || "No description";

    const coords = document.createElement("h6");
    coords.className = "card-subtitle mb-2 text-body-secondary";
    coords.textContent = `Coordinates: ${e.geometry[0].coordinates}`;


    async function getOont(){
   
  
      const[long,lat]=e.geometry[0].coordinates;
      console.log([long,lat]);
      const res1=await fetch(`/home/live-updates/data/${lat}/${long}`);
      const data1 = await res1.json();
console.log(data1.results[0].formatted);
  //     const country = data1.results[0].components.country;
  // console.log("Country:", country);
   const country=document.createElement("h6");
    country.className="card-subtitle mb-2 text-body-secondary";
    country.textContent=`Country:${data1.results[0].formatted}`
     body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(coords);
    body.appendChild(country);
    card.appendChild(body);

    container.appendChild(card);

    }
    getOont();

   

    // append
   
  });
}

getdis();



// async function getcountdis(){
//   let country="united states of america ";
//   const data1=await fetch(` https://api.opencagedata.com/geocode/v1/json?q=${country}&key=2b626bbd31ad40b69664c70d7d7fa57f`);
//   const res=await data1.json();
//   // console.log(res);
//   console.log(res.results[0].bounds);
//   minLat=res.results[0].bounds.southwest.lat;
//   minLon=res.results[0].bounds.southwest.lng;
//   maxLat=res.results[0].bounds.northeast.lat;
//    maxLon=res.results[0].bounds.northeast.lng;

//   // const{lat,long}=res.results[0].geometry;
 
//   const data = await fetch(`https://eonet.gsfc.nasa.gov/api/v3/events?limit=5&days=20&bbox=${minLon},${minLat},${maxLon},${maxLat}`);
//   const res1=await data.json();
//   console.log(res1);
// }
// getcountdis();

 