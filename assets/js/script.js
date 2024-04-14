const baseURL = 'https://api.openweathermap.org/data/2.5'
const apiKey = 'bd98084771b8dcd42b98f681798bc52d'



function getCurrentWeatherByCity(cityName) {
  const options = `/weather?q=${cityName}&appid=${apiKey}&units=imperial`
  const url = baseURL + options
  
  return $.get(url)
}

function outputCurrentWeather(currentData) {
  const temp = $('#current-temp')
  const wind = $('#wind-speed')
  const humidity = $('#humidity')
  const cityHeader = $('#cityHeader')
  
  cityHeader.text(`${currentData.name} (${dayjs(currentData.dt_txt).format('MM/DD/YYYY')})`)
  temp.text(`Temp: ${currentData.main.temp.toFixed(0)} °F`)
  wind.text(`Wind Speed: ${currentData.wind.speed} mph`)
  humidity.text(`Humidity: ${currentData.main.humidity}%`)
  
  return currentData.name
}




function getForecastWeather(cityName) {
  const options = `/forecast?q=${cityName}&appid=${apiKey}&units=imperial`
  const url = baseURL + options
  
  return $.get(url)
}

function outputForecastWeather(foreCastData) {
  const foreCastSection = $('#forecast-section')
  foreCastSection.empty()
  foreCastData.list.forEach(function (weatherObj) {

    if (weatherObj.dt_txt.includes("12:00:00")) {
      foreCastSection.append(`
      <div class="col-lg-2 col-md-2 my-2">
        <div class="bg-secondary text-white p-2">
          <p class="fw-bold">${dayjs(weatherObj.dt_txt).format('MMM D, YYYY')}</p>
          <img src="https://openweathermap.org/img/wn/${weatherObj.weather[0].icon}@2x.png">
          <p>Temp: ${weatherObj.main.temp.toFixed(0)} °<p>
          <p>Wind: ${weatherObj.wind.speed} mph</p>
          <p>Humidity: ${weatherObj.main.humidity}%</p>
        </div>
      </div>
      `)
    }
  })
  
}




$('#cityBtn').click(function (event) {
  event.preventDefault();
  const userInput = $('#cityName').val()
  console.log(userInput)

  const cityHistory = JSON.parse(localStorage.getItem('CityName')) || [];
  cityHistory.push(userInput);
  localStorage.setItem('CityName', JSON.stringify(cityHistory));

  // Update the city history 
  const historyList = $('#cityHistory');
  historyList.empty(); 

  // Append each city to the history list
  cityHistory.forEach(city => {
    historyList.append(`<ul style="background-color: #bababa" class="text-black p-2 text-center text-capitalize rounded fw-medium fs-6">${city}</ul>`);

  getCurrentWeatherByCity(userInput)
  .then(outputCurrentWeather)
  .then(getForecastWeather)
  .then(outputForecastWeather)

  })

})
 


