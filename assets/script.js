$(document).ready(function () {

    console.log("Five Day Forecast");

    let apiKey = "f47243749ce7ae2a156aab05280e5983";

    let userInput = $('#input').val();



    // Sets current date for current weather block
    // $('#currentDay').text(dayjs().format('MMMM D, YYYY'));

    // testing to see if keypress event works when pressing enter
    $(document).keypress(function (event) {
        if (event.which == '13') {
            $('#currentDay').text(dayjs().format('MMMM D, YYYY'))
            getAPI();
        }
    });

    function getAPI() {

        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                console.log(data);
                $('#currentCity').text(data.name);
            })

        // fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&units=imperial&appid=${apiKey}`)
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(function (data2) {
        //         console.log(data2)
        //     });
    };
});
