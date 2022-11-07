(function (f, b) {
	if (!b.__SV) {
		var e, g, i, h;
		window.mixpanel = b;
		b._i = [];
		b.init = function (e, f, c) {
			function g(a, d) {
				var b = d.split(".");
				2 == b.length && ((a = a[b[0]]), (d = b[1]));
				a[d] = function () {
					a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
				};
			}
			var a = b;
			"undefined" !== typeof c ? (a = b[c] = []) : (c = "mixpanel");
			a.people = a.people || [];
			a.toString = function (a) {
				var d = "mixpanel";
				"mixpanel" !== c && (d += "." + c);
				a || (d += " (stub)");
				return d;
			};
			a.people.toString = function () {
				return a.toString(1) + ".people (stub)";
			};
			i =
				"disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(
					" "
				);
			for (h = 0; h < i.length; h++) g(a, i[h]);
			var j = "set set_once union unset remove delete".split(" ");
			a.get_group = function () {
				function b(c) {
					d[c] = function () {
						call2_args = arguments;
						call2 = [c].concat(Array.prototype.slice.call(call2_args, 0));
						a.push([e, call2]);
					};
				}
				for (
					var d = {},
						e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0)),
						c = 0;
					c < j.length;
					c++
				)
					b(j[c]);
				return d;
			};
			b._i.push([e, f, c]);
		};
		b.__SV = 1.2;
		e = f.createElement("script");
		e.type = "text/javascript";
		e.async = !0;
		e.src =
			"undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL
				? MIXPANEL_CUSTOM_LIB_URL
				: "file:" === f.location.protocol &&
				  "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)
				? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"
				: "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
		g = f.getElementsByTagName("script")[0];
		g.parentNode.insertBefore(e, g);
	}
})(document, window.mixpanel || []);

// Enabling the debug mode flag is useful during implementation,
// but it's recommended you remove it for production
mixpanel.init("0245f709604cb2d2f98a60496f474611", { debug: true });
mixpanel.track("Sign up");

function sample() {
	// fetch the data from the server with fecth api without react
	console.log(mixpanel);
	fetch("https://banco-popular-geolocalizacion.onrender.com/api/v1/propiedades")
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

					mixpanel.track("CLICK_TO_MAP", {
						source: "map",
						property: dataApi[i].id,
						category: dataApi[i].categoria.categoria,
						price: dataApi[i].precio,
					});

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
	
        <div class="flex flex-col items-center w-[300px] bg-white p-2 z-50 relative ${
					pin.descuento > 0 ? " mt-8 " : "mt-8"
				} rounded-2xl">
          <img class="w-full rounded-2xl h-[120px] object-cover " src=${
						pin.fotos[0].url
					} alt=${pin.provincia}>
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
                <button
                  class="mx-1"
				  onclick="(
					() => {
						mixpanel.track('CLICK_TO_EMAIL', {
							property: ${pin.id},
							category: '${pin.categoria.categoria}',
							agentID: '${pin.agente.id}',
							agent: '${pin.agente.nombre}',
		
						  });
						  window.open('mailto:${pin.agente.email}?Subject=Contacto%20de%20interes%20para%20una%20propiedad', '_blank');
					}

				  )();"
					>
                  <img class="h-6 w-6" src="https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/Menssage.svg" alt="whatsapp">
                </button>

                <button
                href="tel:${pin.agente.telefono}"
                target="_blank"
                rel="noreferrer"
                class="mx-1"
				onclick="(
					() =>{
						mixpanel.track('CLICK_TO_PHONE', {
							property: ${pin.id},
							category: '${pin.categoria.categoria}',
							agentID: '${pin.agente.id}',
							agent: '${pin.agente.nombre}',
						});
						window.open('tel:${pin.agente.telefono}');
					}
				)()"
				>

                <img class="h-6 w-6" src="https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/phone.svg" alt="telefono">
                
                </button>

                <button
                  class="mx-1"
				  onclick="(
					() => {
						mixpanel.track('CLICK_TO_WHATSAPP', {
							property: ${pin.id},
							category: '${pin.categoria.categoria}',
							agentID: '${pin.agente.id}',
							agent: '${pin.agente.nombre}',
						});
					window.open('https://api.whatsapp.com/send?phone=+506-${pin.agente.celular}&text=Hola%20que%20tal,%20me%20gustaría%20más%20información%20de%20la%20propiedad%20en%20${pin.provincia},%20${pin.canton}', '_blank');
					}
				  )();"
                >
                  <img class="h-6 w-6" src="https://polpo-assets.s3.amazonaws.com/production/Congreso+de+Ortopedia/Portadas/Banco_popular_icons/IconWhatsaap.svg" alt="email">
                </button>
            </div>
            <button class="border-2 border-[#6A1886] text-[#6A1886] p-3 rounded-full"
			  target="_blank"
			  rel="noreferrer"
			  onclick="(
				() => {
					mixpanel.track('CLICK_TO_CATALOGUE ', {
						property: ${pin.id},
						category: '${pin.categoria.categoria}',
						agentID: '${pin.agente.id}',
						agent: '${pin.agente.nombre}',
					});
					window.open('https://www.bancopopular.fi.cr/venta-de-propiedades', '_blank');
				}
			  )();"
			>
            Ver catálogo
            </button>
          </div>
          <p class="font-bold mb-5" style="font-size: 14px">Lic. ${pin.agente.nombre} ${pin.agente.apellido}</p>
		  <br/>
        </div>
      `;

	if (pin.descuento > 0) {
		const { descuento } = pin;
		const str = descuento.toString();
		const res = str.replace(".", "");

		labelDescuento = `
		<div class="absolute top-0 right-0 text-center w-full bg-[#6A1886]  text-white font-bold text-lg pb-4 pt-1 mb-2">
			${res.replace("0", "")}% Descuento
		</div>
		`;
		textProperty = `
        <div class="mx-2 flex justify-between my-1" style="font-size: 13px">
        <p class="text-black font-bold">${pin.provincia}, ${pin.canton}</p>
        <p class="text-black font-bold line-through decoration-orange-400 ">₡ ${pin.avaluo}</p>
        </div>

        <p class="text-black font-bold text-lg text-right mr-1 ">₡ ${pin.precioVenta}</p>
      `;
	} else {
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
