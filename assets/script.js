$(document).ready(function () {

    console.log("Five Day Forecast");

    let apiKey = "f47243749ce7ae2a156aab05280e5983";



    // Sets current date for current weather block
    // $('#currentDay').text(dayjs().format('MMMM D, YYYY'));

    // testing to see if keypress event works when pressing enter
    $(document).keypress(function (event) {
        console.log("clicked")
        if (event.which == '13') {
            let userInput = $('#input').val();
            $('#currentDay').text(dayjs().format('MMMM D, YYYY'))
            getAPI(userInput);
            getCoordinates(userInput);

            $('.currentContainer').removeClass('hide');
            $('.forecastRow').removeClass('hide');
            $('.popup').removeClass('hide')

        }
    });

    function getAPI(cityName) {

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                console.log(data);
                $('#currentCity').text(data.name);
                let iconURL = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
                $('#currentIcon').attr('src', iconURL);
                $('#currentTemp').text('Temp: ' + data.main.temp);
                $('#currentHumidity').text('Humidity: ' + data.main.humidity);
                $('#currentWind').text('Wind speed: ' + data.wind.speed)
            })
    };
    function getCoordinates(cityName) {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}&units=imperial`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data2) {
                console.log(data2)
                getFiveDayForecast(data2[0].lat, data2[0].lon)
            });
    };

    function getFiveDayForecast(lat, lon) {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data2) {
                console.log(data2);
                displayForecastData(data2.list);
            });
    };

    function displayForecastData(data2) {
        for (let i = 4; i < data2.length; i = i + 8) {
            console.log(data2[i]);

            // creating each card in the loop and appending
            let cardCol = document.createElement("div")
            cardCol.classList.add('forecast', 'col-2');
            document.querySelector('.forecastRow').appendChild(cardCol);

            let cardBody = document.createElement("div")
            cardBody.classList.add('card-body');
            cardCol.appendChild(cardBody);

            let cardHeader = document.createElement("h5")
            cardHeader.classList.add('card-title');
            cardHeader.classList.add('fiveDate');
            cardBody.appendChild(cardHeader);

            let cardIcon = document.createElement("img");
            cardIcon.classList.add('card-title');
            cardIcon.classList.add('fiveIcon');
            cardBody.appendChild(cardIcon);

            let cardTemp = document.createElement("p");
            cardTemp.classList.add('card-title', 'fiveTemp');
            cardBody.appendChild(cardTemp);

            let cardHumidity = document.createElement("p");
            cardHumidity.classList.add('card-title', 'fiveHumidity');
            cardBody.appendChild(cardHumidity);

            let cardWind = document.createElement("p");
            cardWind.classList.add('card-title', 'fiveWind');
            cardBody.appendChild(cardWind);

            // grabbing data and inserting into elements
            let date = data2[i].dt_txt.split(" ")[0];
            console.log(date)
            cardHeader.innerHTML = date;

            console.log(data2[i].weather[0].icon)
            let iconURL = 'http://openweathermap.org/img/wn/' + data2[i].weather[0].icon + '@2x.png'
            $('.fiveIcon').attr('src', iconURL);

            let temp = Math.floor(data2[i].main.temp);
            console.log(temp)
            cardTemp.innerHTML = 'Temp:' + temp + '&#xB0;' + 'F';

            let humidity = data2[i].main.humidity;
            console.log(humidity);
            cardHumidity.innerHTML = 'Humidity:' + humidity;

            let wind = data2[i].wind.speed;
            console.log(wind);
            cardWind.innerHTML = 'Wind speed:' + wind;

        }
    }
});
