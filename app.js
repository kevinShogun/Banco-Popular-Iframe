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

function createInfoWindowContent(pin) {
	let photoProperty = "";
	let textProperty = "";
	let infoProperty = "";
	let infoContacto = "";
	let labelDescuento = "";

	photoProperty = `
	
        <div class="flex flex-col items-center w-[300px] bg-white p-2 z-50 relative ${pin.descuento > 0 ? " mt-8 " : "mt-5"} rounded-2xl">
          <img class="w-full rounded-2xl h-[120px] object-cover " src=${pin.fotos[0].url} alt=${pin.provincia}>
        </div>
      `;

	

	infoProperty = `
        <div class="m-2 ">
          <p class="text-[#E68A24] text-sm font-black">${pin.categoria.categoria}</p>
          <p class="text-[#E68A24] text-xs font-black">${pin.area} m<sup>2</sup></p>
          <p class="text-black text-xs">Expediente ${pin.expediente} </p>
        </div>
      `;

	infoContacto = `
        <div class="my-1 mx-2">
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
                  href="https://api.whatsapp.com/send?phone=+506-${pin.agente.celular}&text=Hola%20que%20tal,%20me%20gustaría%20más%20información%20de%20la%20propiedad%20en%20${pin.provincia},%20${pin.canton}"
                  target="_blank"
                  rel="noreferrer"
                  class="mx-1"
                >
                  <img class="h-6 w-6" src="https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/IconWhatsaap.svg" alt="email">
                </a>
            </div>
            <button class="border-2 border-[#6A1886] text-[#6A1886] p-3 rounded-full"
			  onclick="window.open('https://www.bancopopular.fi.cr/venta-de-propiedades/')"
			>
            Ver catálogo
            </button>
          </div>
          <p class="font-bold mb-5" style="font-size: 14px">Lic. ${pin.agente.nombre} ${pin.agente.apellido}</p>
		  <br/>
        </div>
      `;

	  if(pin.descuento > 0){
		const {descuento} = pin;
		const str = descuento.toString();
		const res = str.replace(".", "");

		labelDescuento = `
		<div class="absolute top-0 right-0 text-center w-full bg-[#6A1886]  text-white font-bold text-lg pb-4 pt-1 mb-2">
			${res.replace("0", "")}% Descuento
		</div>
		`;
		textProperty = `
        <div class="mx-2 flex justify-between my-1" style="font-size: 12px">
        <p class="text-black font-bold">${pin.provincia}, ${pin.canton}</p>
        <p class="text-black font-bold ">₡ ${pin.avaluo}</p>
        </div>

        <p class="text-black font-bold text-right mr-1">₡ ${pin.precioVenta}</p>
      `;
	  }else{
		textProperty = `
        <div class="mx-2 flex justify-between my-1" style="font-size: 12px">
        <p class="text-black font-bold">${pin.provincia}, ${pin.canton}</p>
        <p class="text-black font-bold">₡ ${pin.avaluo}</p>
        </div>
      `;
	  }

	  

	const contentString = `
	  ${labelDescuento}
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
