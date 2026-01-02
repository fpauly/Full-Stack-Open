import Weather from "./Weather";
import { useEffect, useState } from "react";

const CountryList = ({ countryList, onClick }) => {
  const [weather, setWeather] = useState(null);
  const data = countryList.length === 1 ? countryList[0] : null;
  const capital = data?.capital?.[0];

  useEffect(() => {
    if (!capital) return;

    Weather.weatherByName(capital).then(setWeather);
  }, [capital]);

  if (countryList.length === 1) {
    return (
      <>
        <h1>{data.name.common}</h1>
        <p>Capital {capital}</p>
        <p>Area {data.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.entries(data.languages).map(([code, lang]) => (
            <li key={code}>{lang}</li>
          ))}
        </ul>
        <img src={data.flags.png} alt={`Flag of ${data.name.common}`} />

        <h2>Weather in {capital}</h2>
        {weather ? (
          <>
            <div>temperature {weather.main.temp} °C</div>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <div>wind {weather.wind.speed} m/s</div>
          </>
        ) : (
          <div>Weather</div>
        )}
      </>
    );
  }
  return (
    <>
      <ul>
        {countryList.map((p) => (
          <li key={p.cca3}>
            {p.name.common} <button onClick={() => onClick(p)}>Show</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CountryList;
