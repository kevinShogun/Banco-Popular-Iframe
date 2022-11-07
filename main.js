const { useState, useEffect } = React;

const CardContainer = () => {
	// get data from api
	const [data, setData] = useState([]);
	const [propiedades, setpropiedades] = useState([]);
	const [slider, setSlider] = useState({
		min: 0,
		max: 0,
	});
	const [selectValue, setSelectValue] = useState("");
	useEffect(() => {
		if (selectValue === "") {
			fetch(
				"https://banco-popular-geolocalizacion.onrender.com/api/v1/propiedades"
			)
				.then((response) => response.json())
				.then((data) => setData(data.data));
		} else {
			fetch(
				`https://banco-popular-geolocalizacion.onrender.com/api/v1/propiedades?categoria=${selectValue}`
			)
				.then((response) => response.json())
				.then((data) => setData(data.data));
		}
	}, [selectValue]);

	useEffect(() => {
		if (data.length > 0) {
			if(window.innerWidth > 1024){
				console.log("desktop");
				setpropiedades(data.slice(0, 4));
				setSlider({
					min: 0,
					max: 4,
				})
			}
			if(window.innerWidth >= 682 && window.innerWidth < 1050){
				console.log("tablet");
				setpropiedades(data.slice(0, 3));
				setSlider({
					min: 0,
					max: 3,
				})
			}
			if(window.innerWidth < 700){
				console.log("mobile");
				setpropiedades(data.slice(0, 2));
				setSlider({
					min: 0,
					max: 2,
				})
			}
		}
	}, [data]);

	const chageSlide = () => {
		if (slider.max >= data.length) {
			return;
		}
		setSlider({
			min: slider.min + 1,
			max: slider.max + 1,
		});
		setpropiedades(data.slice(slider.min, slider.max));
		// set elements for the next slide
	};

	const changeSlidePrevious = () => {
		if (slider.min === 0) {
			return;
		}
		setSlider({
			min: slider.min - 1,
			max: slider.max - 1,
		});
		setpropiedades(data.slice(slider.min, slider.max));
	};

	/**
	 * {data.map((item, index) => (
				<Card key={index} {...item} />
			))}
	 */

	return (
		<div>
			<div>
				<select
					class="mx-5 bg-white fixed top-24 md:top-10 right-10 bg-white px-3 w-[200px] px-5 py-2 rounded-full outline-none"
					onChange={(e) => setSelectValue(e.target.value)}
				>
					<option value="" selected disabled hidden className="mt-5">
						Elige aquí
					</option>
					<option value="Apartamento">Apartamento</option>
					<option value="Parqueo">Parqueo</option>
					<option value="Finca">Finca</option>
					<option value="Lote">Lote</option>
					<option value="Casa">Casa</option>
					<option value="Local Comercial">Local comercial</option>
				</select>
			</div>

			<div className="flex mt-5 items-center justify-center">
				<button
					className="bg-zinc-50 rounded-full w-[50px] h-[50px] shadow-xl text-[#A4B3B7] font-bold text-3xl "
					onClick={changeSlidePrevious}
				>
					{"<"}
				</button>

				{propiedades.map((item, index) => (
					<Card key={index} {...item} />
				))}
				<button
					className="bg-zinc-50 rounded-full w-[50px] h-[50px] shadow-xl text-[#A4B3B7] font-bold text-3xl"
					onClick={chageSlide}
				>
					{">"}
				</button>
			</div>
		</div>
	);
};

const Card = (item) => {
	return (
		<div className="m-5 w-[250px] overflow-hidden p-2 bg-gray-100 shadow-xl rounded-3xl">
			<img
				src={item.fotos[0].url}
				alt="casa"
				className="w-[250px] rounded-2xl h-[100px] object-cover"
			/>
			<div className="text-black  font-bold mx-5 my-1 flex justify-between"
			style={{fontSize: ".6rem"}}
			>
				<p className="">
					{item.canton}, {item.provincia}
				</p>
				<p>₡{item.precioVenta}</p>
			</div>
		</div>
	);
};

const App = () => {
	return (
			<div
				className="absolute w-full bottom-0 flex flex-col justify-center items-center mt-5"
			>
				<CardContainer />
			</div>
	);
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
