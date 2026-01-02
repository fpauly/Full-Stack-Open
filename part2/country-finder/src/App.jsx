import { useState } from "react";
import countryService from "./countryDB";
import Message from "./Message";
import CountryList from "./CountryList";


function App() {
  const [countryName, setCountryName] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [message, setMessage] = useState(null);

  const findCountry = (event) => {
    const value = event.target.value;

    setCountryName(value);
    if (value.trim() === "") {
      setMessage(null);
      setCountryList([]);
      return;
    }
    countryService.getAll().then((response) => {
      const filteredData = response.filter((p) =>
        p.name.common.toLowerCase().includes(value.toLowerCase())
      );
      if (filteredData.length > 10) {
        setMessage("Too many matches, specify another filter");
        setCountryList([]);
        return;
      }

      setMessage(null);
      setCountryList(filteredData);
    });
  };
  const onCountryShow = (country) => {
    setCountryName(country.name.common);
    setCountryList([country]);
    setMessage(null);
  };

  return (
    <>
      <h1>Country Finder</h1>
      <Message message={message} />
      <div>
        <label htmlFor="input_country">Find Countries</label>
        <input
          id="input_country"
          value={countryName}
          onChange={findCountry}
        ></input>
      </div>
      <CountryList countryList={countryList} onClick={onCountryShow} />
    </>
  );
}

export default App;
