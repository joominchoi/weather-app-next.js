import React from 'react'
import cities from '../../lib/city.list.json'
import Head from 'next/head';
import TodaysWeather from "../../components/TodaysWeather";

export async function getServerSideProps(context) {
  const city = getCity(context.params.city);

  if(!city) {
    return {
      notFound: true,
    };
  }

  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric&exclude=minutely`
  );

  const data = await res.json();

  if(!data) {
    return {
      notFound: true
    }
  }

  const hourlyWeather = getHourlyWeather(data.hourly);

  return {
    props: {
      city: city,
      currentWeather: data.current,
      dailyWeather: data.daily,
      hourlyWeather: hourlyWeather,
    },
  };
}

const getCity = param => {
  const cityParam = param.trim();
  //get the id of the city
  const splitCity = cityParam.split("-")
  const id = splitCity[splitCity.length - 1];

  if(!id) {
    return null;
  }

  const city = cities.find(city => city.id.toString() == id);

  if(city) {
    return city;
  } else {
    return null
  }
};

const getHourlyWeather = (hourlyData) => {
  const current = new Date();
  current.setHours(current.getHours(), 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // divide by 1000 get timestamps in seconds
  const currentTimeStamp = Math.floor(current.getTime() / 1000);
  const tomorrowTimeStamp = Math.floor(tomorrow.getTime() / 1000);
  
  const todaysData = hourlyData.filter(data => data.dt < tomorrowTimeStamp);

  return todaysData;
}

export default function City({ 
  currentWeather, 
  dailyWeather, 
  hourlyWeather, 
  city,
}) {
  return (
    <div>
      <Head>
        <title>{city.name} Weather - Next.js Weather App</title>
      </Head>

      <div className="page-wrapper">
        <div className="container">
          <TodaysWeather city={city} weather={dailyWeather[0]} />
        </div>
      </div>
    </div>
  )
}
