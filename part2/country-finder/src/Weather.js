import axios from "axios";
const apiKey = import.meta.env.VITE_MY_KEY;

const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";


const weatherByName = async (name) => {
  const { data } = await axios.get(`${weatherUrl}`, {
    params: {
      q: name,
      units: "metric",
      appid: apiKey,
    },
  });
  return data;
};

export default {
  weatherByName,
};
