const { useState, useEffect } = React;

const CardContainer = () => {
	// get data from api
	const [data, setData] = useState([]);

	useEffect(() => {
		fetch(
			"https://banco-popular-geolocalizacion-api.onrender.com/api/v1/propiedades"
		)
			.then((response) => response.json())
			.then((data) => setData(data.data));
	}, []);

	// console.log(data);
	return (
		<div className="flex">
			{data.map((item, index) => (
				<Card key={index} {...item} />
			))}
		</div>
	);
};

const Card = (item) => {
	return (
		<div className="p-3 bg-gray-100 shadow-xl m-5 min-w-[300px] rounded-2xl">
			<img
				src={item.fotos[0].url}
				alt="casa"
				className="w-[300px] rounded-2xl h-[200px] object-cover"
			/>
			<p className="text-black font-bold">
				{item.canton}, {item.provincia} - ₡{item.precioVenta}
			</p>
		</div>
	);
};

const App = (props) => {
	return (
		<div>
			<CardContainer />
		</div>
	);
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
