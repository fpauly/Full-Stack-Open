const CountryList = ({ countryList }) => {
  if (countryList.length === 1) {
    const data = countryList[0];
    return (
      <>
        <h1>{data.name.common}</h1>
        <p>Capital {data.capital}</p>
        <p>Area {data.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.entries(data.languages).map(([code, lang]) => (
            <li key={code}>{lang}</li>
          ))}
        </ul>
        <img src={data.flags.png} alt={`Flag of ${data.name.common}`}/>
      </>
    );
  }
  return (
    <>
      <ul>
        {countryList.map((p) => (
          <li key={p.cca3}>{p.name.common}</li>
        ))}
      </ul>
    </>
  );
};

export default CountryList;
