import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState({ 
    isLoading: false,
    isError: false,
    errorMessage: null,
    locale_data: null,
    capitalize: (s) => {
      if (typeof s !== 'string') return;
      if (s.includes(" ")) {
        const words = s.split(" ");
        const capitalizeWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const category = capitalizeWords.join(" ");
        console.log(category)
        return category;
        //words.map(word => word.charAt(0).toUpperCase() + s.slice(1));
      };
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
   });

  const { isLoading, isError, errorMessage, locale_data, capitalize } = data;
  // const [isError, setIsError] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [errorMsg, setErrorMsg] = useState(null);
  
  // console.log('hi', data)

  useEffect(() => {
    const fetchWeather = async (city, f) => {
      // setData({ ...data, isError: !isError });
      // setData({ ...data, isLoading: !isLoading });
      setData(state => {
        const newState = { ...state };
        newState.isError = !isError;
        newState.isLoading = !isLoading;
        return { ...newState };
      });
      // setIsError(false);
      // setIsLoading(true);

      try {
        let locale_data;
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${f}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`,
          {
            mode: "cors",
          });

        // console.log(response)
        if (!response.ok) throw Error('City could not be found')
        
        const data = await response.json();
   
        locale_data = {
          city: data.name,
          country: data.sys.country,
          "feels like": data.main.feels_like,
          humidity: data.main.humidity,
          temperature: data.main.temp,
          "max temp": data.main.temp_max,
          "min temp": data.main.temp_min,
          description: data.weather[0].description,
          wind: data.wind.speed,
          sunrise: data.sys.sunrise,
          sunset: data.sys.sunset,
          "icon id": data.weather[0].id,
          "icon name": data.weather[0].icon,
          "locale time": data.dt,
          timezone: data.timezone
        }

        setData(state => {
          const newState = { ...state };
          newState.locale_data = locale_data;
          return { ...newState };
        });
    } catch (err) {
      // setIsError(true);
      // console.log("Error")
      // console.log(data.status);
      // setData({ ...data, errorMessage: err.message, isError: !isError });
      setData(state => {
        const newState = { ...state };
        newState.errorMessage = err.message;
        newState.isError = !isError;
        return { ...newState };
      });
    }
    // setData({ ...data, isLoading: !isLoading })
    setData(state => {
      const newState = { ...state };
      newState.isLoading = false;
      return { ...newState };
    });
    // setIsLoading(false);
  }

  fetchWeather("los angeles", "imperial");



  }, []);
  
  // if (!locale_data) {

  // }

  return (
    <div className="App">
      <div>{ isError && <div id="error-message">{errorMessage}</div> }</div>
      <div>{ isLoading && <div id="loading-message">Loading...</div> }</div> {/* Swirl Logo */}
      {locale_data && <WeatherPane locale_data={locale_data} capitalize={capitalize} />}
    </div>
  );
  
}

const WeatherPane = ({ locale_data, capitalize }) => {
  
  console.log("weather pane", { locale_data })
  return (<div>
        <div>
        {Object.keys(locale_data).map((x, i) => <p key={i}>{capitalize(x)} : </p>)}
        {/* {Object.keys(locale_data).map((x, i) => <p key={i}>{capitalize(x)} : </p>)} */}
        </div>
        {/* <div>{Object.entries(locale_data).map((x, i) => <p key={i}>{x}</p>)}</div> */}
      </div>)
}

export default App;
