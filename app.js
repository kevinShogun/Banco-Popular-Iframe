function sample() {

    // fetch the data from the server with fecth api without react
    fetch(
        "https://banco-popular-geolocalizacion-api.onrender.com/api/v1/propiedades"
    )
        .then((response) => response.json())
        .then((data) =>{
            let dataApi = data.data;
            
            let loc = { lat:  9.9333300, lng: -84.0833300 };
            let loc2 = { lat: 9.9333300, lng: -85.0833300 };
            let m1 = new google.maps.Map(
              document.getElementById('m'), { zoom: 8, center: loc });
            
              for (let i = 0; i < dataApi.length; i++) {
                const infowindow = new google.maps.InfoWindow();
                let marker = new google.maps.Marker({
                  position: {
                    lat: dataApi[i].coordLatidud,
                    lng: dataApi[i].coordLongitud
                  },
                  map: m1,
                  title: dataApi[i].distrito + ", " + dataApi[i].canton + ", " + dataApi[i].provincia,
                  animation: google.maps.Animation.DROP
                });

                google.maps.event.addListener(marker, "click", function () {
                    infowindow.setContent(createInfoWindowContent(dataApi[i]));
                    m1.setCenter(marker.getPosition());
                    infowindow.open(m1, marker);
               
                    if (document.querySelector(".location.active")) {
                      document
                        .querySelector(".location.active")
                        .classList.remove(activeClass);
                    }
                    scroll({
                      top: targetLocation.offsetTop,
                      behavior: "smooth"
                    });
                  });
              }

        });


  }

  function createMarkers(map) {
    const infowindow = new google.maps.InfoWindow();
    const markerIcon = {
      url: "img/pin.svg",
      scaledSize: new google.maps.Size(40, 40)
    };
   
    for (let i = 0; i < pins.length; i++) {
      const marker = new google.maps.Marker({
        position: {
          lat: pins[i].lat,
          lng: pins[i].long
        },
        map,
        icon: markerIcon,
        animation: google.maps.Animation.DROP
      });
   
      markers.push(marker);
      google.maps.event.addListener(marker, "click", function () {
          infowindow.setContent(createInfoWindowContent(pins[i]));
          map.setCenter(marker.getPosition());
          infowindow.open(map, marker);
          const targetLocation = document.querySelector(`[data-index="${i}"]`);
     
          if (document.querySelector(".location.active")) {
            document
              .querySelector(".location.active")
              .classList.remove(activeClass);
          }
          targetLocation.classList.add(activeClass);
          scroll({
            top: targetLocation.offsetTop,
            behavior: "smooth"
          });
        });
    }

  }

  function createInfoWindowContent(pin) {
    let phoneString = "";
    let faxString = "";
    let latLongString = "";
    let addressString = "";
   
    if (pin.tel) {
      phoneString = `
        <p class="d-flex align-items-center">
          <img class="me-2" width="24" height="24" src="img/modal-tel.svg" alt="">
          ${pin.tel}
        </p>
      `;
    }
   
    if (pin.fax) {
      faxString = `
        <p class="d-flex align-items-center">
          <img class="me-2" width="24" height="24" src="img/modal-fax.svg" alt="">
          ${pin.fax}
        </p>
      `;
    }
   
    if (pin.lat && pin.long) {
      latLongString = `
        <p class="d-flex align-items-center">
          <img class="me-2" width="24" height="24" src="img/modal-lat-long.svg" alt="">
          ${pin.lat}, ${pin.long}
        </p>
      `;
    }
   
    if (pin.address) {
      addressString = `
        <div class="d-flex">
          <img class="me-2" width="24" height="24" src="img/modal-pin.svg" alt="">
          ${pin.address}
        </div>
      `;
    }
   
    const contentString = `
      <h3 class="fs-4 text">${pin.name}</h3>
      <hr>
      ${phoneString}
      ${faxString}
      ${latLongString}
      ${addressString}
    `;
       
    return contentString;
    console.log(pin);
  }