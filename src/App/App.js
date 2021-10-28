import React, { useEffect, useState } from 'react';
import './App.css';

// const withWeatherPaneNull = (Component) => ({ locale_data, ...props}) => !locale_data
// 	? null
// 	: <Component { ...props } />;

const withError = (Component) => ({ isError, errorMessage, ...props}) => isError
	? <div>{errorMessage}</div>
	: <Component { ...props } />;

const withLoading = (Component) => ({ isLoading, ...props}) => isLoading
	? <div>Loading...</div>
	: <Component { ...props } />;

const WeatherPane = ({ locale_data, capitalize }) => {
  const shown = {
    display: "flex",
    flexFlow: "column",
  } 
  const rows = {
    display: "flex",
    flexFlow: "row",
  }
  console.log(locale_data)
  return (
  <div style={shown}>
    {Object.entries(locale_data).map((category, i) => {
      const [key, value] = category;
      return (
        <div key={i} style={rows}>
          <div>{capitalize(key)} : </div>
          <div>{capitalize(value)}</div>
        </div>
      )
            })}
  </div>)
}

// const WeatherDataCheckOne = withWeatherPaneNull(WeatherPane);
// const WeatherDataCheckTwo = withError(WeatherDataCheckOne);
// const WeatherDataCheckThree = withLoading(WeatherDataCheckTwo);
const WeatherDataCheckOne = withError(WeatherPane);
const WeatherDataCheckTwo = withLoading(WeatherDataCheckOne);

function App() {
  const [data, setData] = useState({ 
    isLoading: false,
    isError: false,
    errorMessage: null,
    locale_data: null,
    capitalize: (s) => {
      if (typeof s !== 'string') return s;
      if (s.includes(" ")) {
        const words = s.split(" ");
        const capitalizeWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const category = capitalizeWords.join(" ");
        return category;
      };
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
   });

  const { isLoading, isError, errorMessage, locale_data, capitalize } = data;

  useEffect(() => {
    const fetchWeather = async (city, f) => {
      setData(state => {
        const newState = { ...state };
        newState.isError = !isError;
        newState.isLoading = !isLoading;
        return { ...newState };
      });

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
      setData(state => {
        const newState = { ...state };
        newState.errorMessage = err.message;
        newState.isError = !isError;
        return { ...newState };
      });
    }
    setData(state => {
      const newState = { ...state };
      newState.isLoading = false;
      return { ...newState };
    });
  }

  fetchWeather("los angeles", "imperial");
  }, []);

  return (
    <div className="App">
      <WeatherDataCheckTwo 
        isLoading={isLoading}
        isError={isError}
        errorMessage={errorMessage}
        locale_data={locale_data}
        capitalize={capitalize}
         />
    </div>
  );
  
}


export default App;

// function App() {
//   const [data, setData] = useState({ 
//     isLoading: false,
//     isError: false,
//     errorMessage: null,
//     locale_data: null,
//     capitalize: (s) => {
//       if (typeof s !== 'string') return s;
//       if (s.includes(" ")) {
//         const words = s.split(" ");
//         const capitalizeWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
//         const category = capitalizeWords.join(" ");
//         return category;
//         //words.map(word => word.charAt(0).toUpperCase() + s.slice(1));
//       };
//       return s.charAt(0).toUpperCase() + s.slice(1);
//     },
//    });

//   const { isLoading, isError, errorMessage, locale_data, capitalize } = data;
//   // const [isError, setIsError] = useState(false);
//   // const [isLoading, setIsLoading] = useState(false);
//   // const [errorMsg, setErrorMsg] = useState(null);
  
//   // console.log('hi', data)

//   useEffect(() => {
//     const fetchWeather = async (city, f) => {
//       // setData({ ...data, isError: !isError });
//       // setData({ ...data, isLoading: !isLoading });
//       setData(state => {
//         const newState = { ...state };
//         newState.isError = !isError;
//         newState.isLoading = !isLoading;
//         return { ...newState };
//       });
//       // setIsError(false);
//       // setIsLoading(true);

//       try {
//         let locale_data;
//         const response = await fetch(
//           `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${f}&appid=${process.env.REACT_APP_OPEN_WEATHER_API_KEY}`,
//           {
//             mode: "cors",
//           });

//         // console.log(response)
//         if (!response.ok) throw Error('City could not be found')
        
//         const data = await response.json();
   
//         locale_data = {
//           city: data.name,
//           country: data.sys.country,
//           "feels like": data.main.feels_like,
//           humidity: data.main.humidity,
//           temperature: data.main.temp,
//           "max temp": data.main.temp_max,
//           "min temp": data.main.temp_min,
//           description: data.weather[0].description,
//           wind: data.wind.speed,
//           sunrise: data.sys.sunrise,
//           sunset: data.sys.sunset,
//           "icon id": data.weather[0].id,
//           "icon name": data.weather[0].icon,
//           "locale time": data.dt,
//           timezone: data.timezone
//         }

//         setData(state => {
//           const newState = { ...state };
//           newState.locale_data = locale_data;
//           return { ...newState };
//         });
//     } catch (err) {
//       // setIsError(true);
//       // console.log("Error")
//       // console.log(data.status);
//       // setData({ ...data, errorMessage: err.message, isError: !isError });
//       setData(state => {
//         const newState = { ...state };
//         newState.errorMessage = err.message;
//         newState.isError = !isError;
//         return { ...newState };
//       });
//     }
//     // setData({ ...data, isLoading: !isLoading })
//     setData(state => {
//       const newState = { ...state };
//       newState.isLoading = false;
//       return { ...newState };
//     });
//     // setIsLoading(false);
//   }

//   fetchWeather("los angeles", "imperial");



//   }, []);

//   return (
//     <div className="App">
//       <div>{ isError && !isLoading && <div id="error-message">{errorMessage}</div> }</div>
//       <div>{ isLoading && <div id="loading-message">Loading...</div> }</div> {/* Swirl Logo */}
//       {locale_data && <WeatherPane locale_data={locale_data} capitalize={capitalize} />}
//     </div>
//   );
  
// }

// const WeatherPane = ({ locale_data, capitalize }) => {
//   const shown = {
//     display: "flex",
//     flexFlow: "row",
//  } 
//   // const columns = {
//   //   display: "flex",
//   //   flexFlow: "column",
//   // }
//   const rows = {
//     display: "flex",
//     flexFlow: "row",
//   }
//   console.log("weather pane", { locale_data })
//   return (<div style={shown}>
//         <div>
//           {/* {Object.keys(locale_data).map((x, i) => <p key={i}>{capitalize(x)} : </p>)} */}
//         {/* {Object.keys(locale_data).map((x, i) => <p key={i}>{capitalize(x)} : </p>)} */}
//         </div>
//         <div>
//           {Object.entries(locale_data).map((category, i) => {
//             const [key, value] = category;
//             return (
//               <div key={i} style={rows}>
//                 <div>{capitalize(key)} : </div>
//                 <div>{capitalize(value)}</div>
//               </div>
//               )//<p key={i}>{category}</p>
//             })
//             }
//         </div> 
//         {/* <div>{Object.entries(locale_data).map((x, i) => <p key={i}>{x}</p>)}</div> */}
//       </div>)
// }

// export default App;
/**
 * 
 * Conditional Rendering
 * i.     if
 *    - Most basic conditional rendering logic
 *    - Vanilla JS if statement to return earlier (Guard Pattern)
 *    - can't be used in return statement & JSX
 *    - Can be conditions based on props, hooks, and state.
 * 
 * ii.    if else
 *    - Verbose, use rarely
 *    
 * iii.   ternary
 *    - Can be used within JSX and return statement
 * 
 * iv.    &&  
 *    - use it when one side of the ternary operation would return null
 * 
 * 
 * v.     switch case
 *    - Verbose
 * 
 * vi.    Enums
 *    - Object with key value pairs for mapping
 *    - use it for conditional renderings based on multiple states.
 *    - Perfect to map more than one condition
 *    - Switch case statements on steroids, because they can used within the JSX.
 * 
 * vii.  conditional rendering with HOC
 *    - 
 * 
 * ix.    if else components
 * 
 * Fetching Data
 *  -Can be repetitive when using it in multiple modules.
 *  -Component has 2 responsibilities
 * 
 *  -Component mounts >  
 *    -fetch data 
 *    -show conditional loading & errors.
 * 
 * Higher Order Components
 *  -A pure function with no side effects.
 * 
 *  -A function that takes a component and optional arguments as input and returns a enhanced component.
 * 
 *  -Can abstract the fetched data out of any given component into the HOC.
 * 
 *  -HOC combines the exact data needed and the incoming component.
 * 
 * Render Prop Components
 * 
 * Ideas
 *  -Create a default query to replace useEffect call on app startup.
 * 
 */