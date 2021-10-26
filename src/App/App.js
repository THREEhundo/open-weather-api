import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState()
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log(data)
  useEffect(() => {
    const fetchWeather = async (city, f) => {
      setIsError(false);
      setIsLoading(true);

      try {
        let weather;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${f}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`,
          {
            mode: "cors",
          });
        
          const data = await response.json();

        weather = {
          city: data.name,
          country: data.sys.country,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          temperature: data.main.temp,
          max_temp: data.main.temp_max,
          min_temp: data.main.temp_min,
          description: data.weather[0].description,
          wind: data.wind.speed,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          icon_id: data.weather[0].id,
          icon_name: data.weather[0].icon,
          locale_time: data.dt,
          timezone: data.timezone
        }

        setData(weather);
    } catch (error) {
      setIsError(true);
    }
    setIsLoading(false);
  }

  fetchWeather("zss", "imperial");



  }, []);

  return (
    <div className="App">
      <div>{isError && <div>Location Not Found</div>}</div>
   
    </div>
  );
}

const WeatherPane = ({ data }) => {

  return <div>
        {data.map((item, i) => <p key={i}>{item}</p>)}
      </div>
}

export default App;
