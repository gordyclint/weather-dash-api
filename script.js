
// Step 1: Create a column on the side of a div that has search bar and populated array of cities (col-md-4)

var cityList = ["Austin", "Chicago", "New York", "Orlando", "San Francisco", "Seattle", "Denver", "Atlanta"];

// weatherInfo  function re-renders the HTML to display the appropriate content
function weatherInfo(selector, cityName) {
    $("#weather-info").empty();

    var timeNow = moment().format("LL");

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=292e2030aa02770ca57caacfbf6ed982";

    // Creating an AJAX call for the specific movie button being clicked
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);

        // City name and time
        var weatherHead = $("<h2>").text(response.name + " (" + timeNow + ")");
        weatherHead.addClass("my-3");
        $("#weather-info").append(weatherHead);

        // Temperature
        var farTemp = ((((response.main.temp) - 273.15) * 1.8) + 32);
        var pOne = $("<p>").text("Temperature: " + farTemp.toFixed(2) + " \xB0F");
        $("#weather-info").append(pOne);

        // Humidity
        var humidity = response.main.humidity;
        var pTwo = $("<p>").text("Humidity: " + humidity + "%");
        $("#weather-info").append(pTwo);

        // Wind Speed
        var windSpeed = response.wind.speed;
        var pThree = $("<p>").text("Wind Speed: " + windSpeed + "MPH");
        $("#weather-info").append(pThree);

        uvIndex(response);

        // UV Index
        function uvIndex(response) {

            var lat = response.coord.lat;
            var long = response.coord.lon;
            var queryTwo = "https://api.openweathermap.org/data/2.5/uvi?appid=292e2030aa02770ca57caacfbf6ed982&lat=" + lat + "&lon=" + long;

            $.ajax({
                url: queryTwo,
                method: "GET"
            }).then(function (index) {

                var index = index.value;
                var pFour = $("<p>").text("UV Index: " + index);
                pFour.addClass("uv-index");
                $("#weather-info").append(pFour);
            })

            forecast(lat, long);

        }
    });

}


// Five day forecast function
function forecast(lat, long) {

    $("#forecast-div").empty();
    $(".forecast-head").empty();

    // Heading
    var heading = $("<h2>").text("5-Day Forecast");
    $(".forecast-head").append(heading);

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&APPID=292e2030aa02770ca57caacfbf6ed982";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (cast) {
        console.log(cast);

        for (let i = 0; i < 5; i++) {
            var timeNow = moment().format("ll");

            // Add 5-Day forecast div
            var fiveFore = $("<div class='forecasts'>");

            //Time
            var allTime = $("<h6>").text(cast.list[i].dt_txt);
            fiveFore.append(allTime);

            // Temp
            var foreTemp = ((((cast.list[i].main.temp) - 273.15) * 1.8) + 32);
            var allTemp = $("<p>").text("Temp: " + foreTemp.toFixed(2) + " \xB0F");
            fiveFore.append(allTemp);


            // Humidity
            var humidity = cast.list[i].main.humidity;
            var allHum = $("<p>").text("Humidity: " + humidity + "%");
            fiveFore.append(allHum);



            $("#forecast-div").append(fiveFore);

        }

    })

}


$(".go-btn").on("click", function () {
    var cityName = $("#add-city").val();
    weatherInfo(".go-btn", cityName);
    if (cityName.trim().length > 0 && cityList.indexOf(cityName) === -1) {
        cityList.push(cityName);
        renderButtons();
    }
})

// Function to render Buttons
function renderButtons() {
    $("#city-list").empty();
    for (let i = 0; i < cityList.length; i++) {
        var a = $("<button>");
        a.addClass("city-btn btn btn-outline-info mx-4 my-1 col-10");
        a.attr("data-name", cityList[i]);
        a.text(cityList[i]);
        $("#city-list").append(a);
    }
}




// Function that adds cities to button
// This is a dynamic button. It is stored within the "memory bank" of the document. 
$(document).on("click", ".city-btn", function (event) {
    event.preventDefault();
    var cityName = $(this).attr("data-name");
    // .city-btn selector 
    weatherInfo(this, cityName);
    var city = $("#add-city").val().trim();
    if (city.trim().length > 0 && cityList.indexOf(city) === -1) {
        cityList.push(city);
        renderButtons();
    }

});

renderButtons();


// Step 3: Create two rows within col-md-8 div. One will have blank space where current weather information will go (look at image for details). 

// Step 4: Create second row (inside first ajax call above) that pulls the 5 day forcast form the other API and places it below