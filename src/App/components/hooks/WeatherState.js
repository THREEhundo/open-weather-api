import React, { createContext, useContext, useReducer } from "react";
import reducer from "../reducer";
import weatherTemplate from "../../weatherTemplate";

// CREATE CONTEXT
const WeatherStateContext = createContext();
const { Provider } = WeatherStateContext;

// USE CONTEXT
export function useWeatherState() {
	return useContext(WeatherStateContext)
}

// PROVIDE CONTEXT
export function WeatherState({ children }) {
	const [state, dispatch] = useReducer(reducer, weatherTemplate);

	return <Provider value={{ state, dispatch }}>{ children}</Provider>;
}