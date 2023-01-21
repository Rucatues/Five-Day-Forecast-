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


            // getFiveDayForecast(userInput);
            // displayForecastData(userInput);
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
                $('#currentTemp').text('Temp: ' + data.main.temp);
                $('#currentHumidity').text('Humidity: ' + data.main.humidity);
                $('#currentWind').text('Wind speed: ' + data.wind.speed);
            })
    };

    function getCoordinates(cityName) {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data2) {
                console.log(data2)
                getFiveDayForecast(data2[0].lat, data2[0].lon)
            });
    };

    function getFiveDayForecast(lat, lon) {
        fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
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

            let cardCol = document.createElement("div")
            cardCol.classList.add('forecast', 'col-2');
            let cardBody = document.createElement("div")
            cardBody.classList.add('card-body');
            let cardHeader = document.createElement("h5")
            cardHeader.classList.add('card-title', 'fiveDate')
            let cardIcon = document.createElement("img");
            cardIcon.classList.add('card-title', 'fiveIcon');
            let cardTemp = document.createElement("p");
            cardTemp.classList.add('card-title', 'fiveTemp');
            let cardHumidity = document.createElement("p");
            cardHumidity.classList.add('card-title', 'fiveHumidity');
            let cardWind = document.createElement("p");
            cardWind.classList.add('card-title', 'fiveWind');


            let date = data2[i].dt_txt.split(" ")[0];
            console.log(date)
            cardHeader.innerHTML = data2[i].dt_txt.split(" ")[0];

            // how to get icons? 

            let temp = Math.floor(data2[i].main.temp);
            console.log(temp)
            cardTemp.innerHTML = 'Temp=' + temp + '&#xB0;' + 'F';

            let humidity = data2[i].main.humidity;
            console.log(humidity);
            cardHumidity.innerHTML = 'Humidity=' + humidity;

            let wind = data2[i].wind.speed;
            console.log(wind);
            cardWind.innerHTML = 'Wind speed=' + wind;

        }
    }
});
