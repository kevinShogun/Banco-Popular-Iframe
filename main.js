const Card = () => {
	return (
		<div className="p-3 bg-gray-100 shadow-xl m-5 w-[300px] rounded-2xl">
			<img
				src="https://www.bbva.com/wp-content/uploads/2021/04/casas-ecolo%CC%81gicas_apertura-hogar-sostenibilidad-certificado-.jpg"
				alt="casa"
				className="w-[300px] rounded-2xl"
			/>
      <p className="text-black font-bold">Escazú, San Jose $20,000</p>
		</div>
	);
};


const App = () => (
	<div className="flex justify-center items-center">
		<Card />
		<Card />
		<Card />
	</div>
);
ReactDOM.render(<App />, document.querySelector("#root"));


map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: -34.397, lng: 150.644},
  zoom: 8,
  mapId: '4cb2ab46db061417'
  });
