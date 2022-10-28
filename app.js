function sample() {
	// fetch the data from the server with fecth api without react
	fetch(
		"https://banco-popular-geolocalizacion-api.onrender.com/api/v1/propiedades"
	)
		.then((response) => response.json())
		.then((data) => {
			let dataApi = data.data;

			let loc = { lat: 9.93333, lng: -84.08333 };
			let m1 = new google.maps.Map(document.getElementById("m"), {
				zoom: 9,
				center: loc,
			});

			for (let i = 0; i < dataApi.length; i++) {
				const infowindow = new google.maps.InfoWindow();
				let marker = new google.maps.Marker({
					position: {
						lat: dataApi[i].coordLatidud,
						lng: dataApi[i].coordLongitud,
					},
					map: m1,
					icon: setIcon(dataApi[i].categoria.categoria),
					title:
						dataApi[i].distrito +
						", " +
						dataApi[i].canton +
						", " +
						dataApi[i].provincia,
					animation: google.maps.Animation.DROP,
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
				});
			}
		});
}

// function createMarkers(map) {
//   const infowindow = new google.maps.InfoWindow();

//   const markerIcon = {
//     url: "https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/Marcador.svg",
//     scaledSize: new google.maps.Size(40, 40)
//   };

//   for (let i = 0; i < pins.length; i++) {
//     const marker = new google.maps.Marker({
//       position: {
//         lat: pins[i].lat,
//         lng: pins[i].long
//       },
//       map,
//       icon: markerIcon,
//       animation: google.maps.Animation.DROP
//     });

//     markers.push(marker);
//     google.maps.event.addListener(marker, "click", function () {
//         infowindow.setContent(createInfoWindowContent(pins[i]));
//         map.setCenter(marker.getPosition());
//         infowindow.open(map, marker);

//         if (document.querySelector(".location.active")) {
//           document
//             .querySelector(".location.active")
//             .classList.remove(activeClass);
//         }

//       });
//   }

// }

function createInfoWindowContent(pin) {
	let photoProperty = "";
	let textProperty = "";
	let infoProperty = "";
	let infoContacto = "";

	photoProperty = `
        <div class="flex flex-col items-center m-2">
          <img class="h-[200px] w-[271px]" src=${pin.fotos[0].url} alt=${pin.provincia}>
        </div>
      `;

	textProperty = `
        <div class="flex justify-between my-1" style="font-size: 14px">
        <p class="text-black font-bold">${pin.provincia}, ${pin.canton}</p>
        <p class="text-black font-bold">₡ ${pin.avaluo}</p>
        </div>
      `;

	infoProperty = `
        <div class="my-2">
          <p class="text-[#E68A24] text-sm font-black">${pin.categoria.categoria}</p>
          <p class="text-[#E68A24] text-xs font-black">${pin.area} m<sup>2</sup></p>
          <p class="text-black text-xs">Expediente ${pin.expediente} </p>
        </div>
      `;

	infoContacto = `
        <div class="my-1">
          <p class="text-[#E68A24] text-sm font-black"> + INFORMACIÓN</p>
          <div class="flex items-center justify-between my-2">
            <div class="flex">
                <a
                  href="mailto:${pin.agente.email}?Subject=Contacto%20de%20interes%20para%20una%20propiedad"
                  target="_blank"
                  rel="noreferrer"
                  class="mx-1"
                >
                  <img class="h-6 w-6" src="https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/Menssage.svg" alt="whatsapp">
                </a>

                <a
                href="tel:${pin.agente.telefono}"
                target="_blank"
                rel="noreferrer"
                class="mx-1"
                >
                <img class="h-6 w-6" src="https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/phone.svg" alt="telefono">
                
                </a>

                <a
                  href="https://api.whatsapp.com/send?phone=${pin.agente.celular}&text=Hola%20que%20tal,%20me%20gustaría%20más%20información%20de%20la%20propiedad%20en%20${pin.provincia},%20${pin.canton}"
                  target="_blank"
                  rel="noreferrer"
                  class="mx-1"
                >
                  <img class="h-6 w-6" src="https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/IconWhatsaap.svg" alt="email">
                </a>
            </div>
            <button class="border-2 border-[#6A1886] text-[#6A1886] p-3 rounded-full">
            Ver catalogo
            </button>
          </div>
          <p class="font-bold" style="font-size: 14px">Lic. ${pin.agente.nombre} ${pin.agente.apellido}</p>
        </div>
      `;

	const contentString = `
      ${photoProperty}
      ${textProperty}
      ${infoProperty}
      <hr class="h-1" />
      ${infoContacto}
    `;
	return contentString;
}

function setIcon(categoria) {
	switch (categoria) {
		case "Casa":
			return (markerIcon = {
				url: "https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/MarcadorCasa.svg",
				scaledSize: new google.maps.Size(40, 40),
			});

		case "Apartamento":
			return (markerIcon = {
				url: "https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/Marcador.svg",
				scaledSize: new google.maps.Size(40, 40),
			});
		case "Local Comercial":
			return (markerIcon = {
				url: "https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/Marcador.svg",
				scaledSize: new google.maps.Size(40, 40),
			});
		default:
			return (markerIcon = {
				url: "https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/MarcadorLote.svg",
				scaledSize: new google.maps.Size(40, 40),
			});
	}
}
