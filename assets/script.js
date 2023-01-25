$(document).ready(function () {

    console.log("Five Day Forecast");

    let apiKey = "f47243749ce7ae2a156aab05280e5983";

    let searchHistory = [];
    let parsedItem = localStorage.getItem('city')
    let storageArray = JSON.parse(parsedItem)
    if (searchHistory !== null) {
        searchHistory = storageArray;
    }

    console.log(parsedItem);
    console.log(searchHistory)
    console.log(storageArray);


    // this is what happens when you press enter on the page
    $(document).keypress(function (event) {
        if (event.which == '13') {
            let userInput = $('#input').val();
            $('#currentDay').text(dayjs().format('MMMM D, YYYY'));
            resetForecast();
            getAPI(userInput);
            getCoordinates(userInput);

        }
    });

    //calling the first API with user input of city name
    function getAPI(cityName) {

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                console.log(data);

                let code = data.cod
                if (code !== 200) {
                    window.alert('You must enter a valid city name. Do not include state.')
                } else {
                    $('#currentCity').text(data.name);
                    let iconURL = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png'
                    $('#currentIcon').attr('src', iconURL);
                    $('#currentTemp').text('Temp: ' + data.main.temp);
                    $('#currentHumidity').text('Humidity: ' + data.main.humidity);
                    $('#currentWind').text('Wind speed: ' + data.wind.speed)

                    $('.currentContainer').removeClass('hide');
                    $('.forecastRow').removeClass('hide');
                    $('.popup').removeClass('hide');

                    setLocalStorage();
                }
            })
    };

    //API call to use user's input of city name to get latitude and longitude 
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

    //this function creates each card for the 5 day forecast
    function displayForecastData(data2) {
        for (let i = 4; i < data2.length; i = i + 8) {
            console.log(data2[i]);

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
            let newDate = new Date(date);
            let newestDate = dayjs(newDate).format('MMM D, YYYY');
            cardHeader.textContent = newestDate;

            console.log(data2[i].weather[0].icon)
            let iconURL = 'http://openweathermap.org/img/wn/' + data2[i].weather[0].icon + '@2x.png'
            $('.fiveIcon').attr('src', iconURL);

            let temp = Math.floor(data2[i].main.temp);
            console.log(temp)
            cardTemp.innerHTML = 'Temp: ' + temp + '&#xB0;' + 'F';

            let humidity = data2[i].main.humidity;
            console.log(humidity);
            cardHumidity.innerHTML = 'Humidity: ' + humidity;

            let wind = data2[i].wind.speed;
            console.log(wind);
            cardWind.innerHTML = 'Wind speed: ' + wind;

        }
    }
    //creates an object with the city name and pushes it into an array called Search History, which we then set in local storage. 
    function setLocalStorage(data) {
        let userCity = $('#input').val();
        let userObj = {
            city: userCity
        }

        if (searchHistory == null) {
            searchHistory = [];
            searchHistory.push(userObj);
            localStorage.setItem('city', JSON.stringify(searchHistory));

        } else {
            for (i = 0; i < searchHistory.length; i++) {
                if (searchHistory[i].city == userCity) {
                    console.log('City already here');
                    displayResults();

                }
                else {
                    localStorage.setItem('city', JSON.stringify(searchHistory));
                    searchHistory.push(userObj);

                }
            }
        }
    }
    //displays results in search history section 
    function displayResults() {
        for (let i = 0; i < searchHistory.length; i++) {

            let popupMain = document.getElementById('popupMain')
            let listDiv = document.createElement('div');
            listDiv.classList.add('container', 'popup')
            popupMain.appendChild(listDiv);

            let listRow = document.createElement('div');
            listRow.classList.add('row');
            listDiv.appendChild(listRow);

            let listColumn = document.createElement('div');
            listColumn.classList.add('col-4', 'additionToList');
            listRow.appendChild(listColumn);

            let listHeader = document.createElement('h3');
            listColumn.appendChild(listHeader);
            listHeader.innerHTML = searchHistory[i].city.toUpperCase();
            listHeader.addEventListener('click', clickSearchHistory);
        }
    };

    //resets html to an empty string in forecast row so that it doesn't keep appending upon itself
    function resetForecast() {
        $('.forecastRow').html('');
    }

    //function runs when you click on a city you've previously searched for in search history
    function clickSearchHistory() {
        resetForecast();
        getAPI(this.innerHTML);
        getCoordinates(this.innerHTML);
    }

});
