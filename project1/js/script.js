
$(window).load(function(){
    // FIXME:
    // Added a pre-loader
    $('#spinner').fadeOut();
});


$(document).ready(function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else { 
        alert("Geolocation is not supported by this browser");
    }
    let currencyRates = [];
    let currencyInfo = [];
    function showError(error) {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
          case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
          case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
          case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
        }
      }
    function showPosition(position) {

        let streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
            }
        );
        let satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
            attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            }
        );
        let defa = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
        );

        // Icons
        const cityIcon = L.ExtraMarkers.icon({
            prefix: "fa",
            icon: "fa-city",
            markerColor: "cyan",
            iconColor: 'white',
            shape: "circle"
        });
        const airportIcon = L.ExtraMarkers.icon({
            prefix: "fa",
            icon: "fa-plane",
            iconColor: "white",
            markerColor: "black",
            shape: "square"
        });

        const basemaps = {
            "Streets": streets,
            "Satellite": satellite,
            "Default": defa,
          };
          
          // overlays
          
          var airports = L.markerClusterGroup({
            polygonOptions: {
              fillColor: "#000",
              color: "teal",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.35
            }
          });
          
          var cities = L.markerClusterGroup({
            polygonOptions: {
                fillColor: "#000",
                color: "red",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.35
            }
          });
          
          var overlays = {
            Airports: airports,
            Cities: cities
          };
          

        let map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            layers: [streets],
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)          
        
        let infoBtn = L.easyButton("fa-book-atlas", function (btn, map) {
            $("#newsModal").modal("show");
          });
        let infoBtn1 = L.easyButton("fa-globe", function (btn, map) {
            $("#geoModal").modal("show");
          });
        let infoBtn2 = L.easyButton("fa-cloud", function (btn, map) {
            $("#weatherModal").modal("show");
          });
        let infoBtn3 = L.easyButton("fa-info", function (btn, map) {
            $("#demoModal").modal("show");
          });
        let infoBtn4 = L.easyButton("fa-money-bill-trend-up", function (btn, map) {
            $("#exchangeModal").modal("show");
          });

        L.control.layers(basemaps, overlays).addTo(map);

        // airports.addTo(map);
        // cities.addTo(map);

        $.ajax({
            url: "php/GetExchangeRate.php",
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                if(result.status.code === "200"){
                    currencyRates = result.data.rates;
                }
                else{
                    alert("Exchange rates not found.")
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown)
            }
        });    

        const numberWithCommas = (num) => {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        const RemoveAllMarkers = () =>{
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layer.remove();
                }
            });
        }

        let layer = null;

        const CreatePolygon = (country) =>{
            $.ajax({
                url: "php/GetCountriesGeoJSON.php",
                type: 'POST',
                dataType: 'json',
                data:{
                    iso2: country.iso_a2 || country.iso2
                },
                success: function(result) {
                    if(result.status.code === "200"){
                        removeOutline();
                        let style = {
                            fillColor: "#000",
                            color: "#000",
                            weight: 2,
                            opacity: 1,
                            fillOpacity: 0.15
                        }
                        layer = L.geoJSON(result.data, {style}).addTo(map);
                        // TODO:
                        // Added dynamic zoom level
                        map.fitBounds(layer.getBounds()); 
                    }
                    else{
                        alert("Geo JSON data not found")
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown)
                }
            }); 

        }

        const removeOutline = () =>{
            if(layer){
                map.removeLayer(layer);
            }
        }

        const showBtns = () => {
            infoBtn.addTo(map);
            infoBtn1.addTo(map);
            infoBtn2.addTo(map);
            infoBtn3.addTo(map);
            infoBtn4.addTo(map);
        }

        const removeBtns = () => {
            infoBtn.remove(map);
            infoBtn1.remove(map);
            infoBtn2.remove(map);
            infoBtn3.remove(map);
            infoBtn4.remove(map);
        }

        const clearModels = () =>{
            $("#news-table").empty()
            $("#section-2-WEA").empty()
            $("#section-3-WEA").empty()
            $("p").remove(".remove");
            cities.clearLayers();
            airports.clearLayers();

            
        }

        const RequestWeatherData = (city) =>{
            $.ajax({
                url: "php/GetCountryWeather.php",
                type: 'GET',
                dataType: 'json',
                data: {
                    city: city
                },
                beforeSend: function() {
                    $(".spinner-weather").show()
                    $("#weather-info").hide()
                    $("#weather-error").hide()
                    $('#weatherModalLabel').html("Weather");
                 },
                 complete: function(){
                    $(".spinner-weather").hide()
                 },
                success: function(result) {
                    if(result.data){
                        $("#weather-error").hide()
                        $("#weather-info").show()
                        var d = result.data;
                        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                        const date1 = new Date(d.forecast.forecastday[1].date)
                        const date2 = new Date(d.forecast.forecastday[2].date)

                        $('#weatherModalLabel').html(d.location.name + ", " + d.location.country);
                        $('#todayConditions').html(d.current.condition.text);
                        $('#todayIcon').attr("src", d.current.condition.icon);
                        $('#todayMaxTemp').html(Math.round(d.forecast.forecastday[0].day.mintemp_c));
                        $('#todayMinTemp').html(Math.round(d.forecast.forecastday[0].day.maxtemp_c));
                        $('#day1Date').text(weekday[date1.getDay()] +" "+date1.getDate());
                        $('#day1Icon').attr("src", d.forecast.forecastday[1].day.condition.icon);
                        $('#day1MinTemp').text(Math.round(d.forecast.forecastday[1].day.mintemp_c));
                        $('#day1MaxTemp').text(Math.round(d.forecast.forecastday[1].day.maxtemp_c));
                        $('#day2Date').text(weekday[date2.getDay()] +" "+date2.getDate());
                        $('#day2Icon').attr("src", d.forecast.forecastday[2].day.condition.icon);
                        $('#day2MinTemp').text(Math.round(d.forecast.forecastday[2].day.mintemp_c));
                        $('#day2MaxTemp').text(Math.round(d.forecast.forecastday[2].day.maxtemp_c));
                        $('#lastUpdated').text(d.current.last_updated);
                    }
                    else{
                        $("#weather-info").hide()
                        $("#weather-error").show()
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown)
                }
            }); 
        }
        
        const GetDemographicData = (country) =>{
            $.ajax({
                url: "php/GetCountryDemographic.php",
                type: 'GET',
                dataType: 'json',
                data:{
                    country: country.name,
                },
                beforeSend: function() {
                    $(".spinner-demo").show()
                    $("#demo-error").hide()
                    $("#demo-table").hide()
                 },
                 complete: function(){
                    $(".spinner-demo").hide()
                 },
                success: function(result) {
                    if(result.status.code === "200"){
                        if(result.data[0]){
                            const {
                                gdp, 
                                unemployment,
                                life_expectancy_female,
                                life_expectancy_male,
                                imports,
                                exports,
                                sex_ratio,
                                co2_emissions
                            } = result.data[0]
                            
                            $("#gdp").html(gdp ? numberWithCommas(Math.round(gdp)) : "N/A")
                            $("#unemployment-rate").html(unemployment ? numberWithCommas(Math.round(unemployment)) : "N/A")
                            $("#life-expectancy-female").html(life_expectancy_female ? numberWithCommas(Math.round(life_expectancy_female)) : "N/A")
                            $("#life-expectancy-male").html(life_expectancy_male ? numberWithCommas(Math.round(life_expectancy_male)) : "N/A")
                            $("#co2-emissions").html(co2_emissions ? numberWithCommas(Math.round(co2_emissions)) : "N/A")
                            $("#exports").html(exports ? numberWithCommas(Math.round(exports)) : "N/A")
                            $("#imports").html(imports ? numberWithCommas(Math.round(imports)) : "N/A")
                            $("#gender-ratio").html(sex_ratio ? numberWithCommas(Math.round(sex_ratio)) : "N/A")
                            $("#demo-table").show()
                        }
                        else{
                            $("#demo-error").show()
                        }
                    }
                    else{
                        $("#demo-error").show()
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    $("#demo-error").html(errorThrown)
                    $("#demo-error").show()
                }
            }); 
        }

        const GetGeographicData = (country) =>{
            $.ajax({
                url: "php/GetCountryDemographic.php",
                type: 'GET',
                dataType: 'json',
                data:{
                    country: country.name,
                },
                beforeSend: function() {
                    $(".spinner-geo").show()
                    $("#geo-table").hide()
                    $("#geo-error").hide()
                 },
                 complete: function(){
                    $(".spinner-geo").hide()
                    $("#geo-table").show()
                 },
                success: function(result) {
                    if(result.status.code === "200"){
                        if(result.data[0]){

                            $("#region").html(result.data[0].region)
                            $("#capitalCity").html(result.data[0].capital)
                            $("#ISO").html(result.data[0].iso2)
                            $("#currency-code").html(result.data[0].currency.code)
                            $("#currency-name").html(result.data[0].currency.name)
                            $("#tourists").html(result.data[0].tourists ? numberWithCommas(result.data[0].tourists) : "N/A")
                            $("#population").html(result.data[0].population ? numberWithCommas(result.data[0].population) : "N/A")
                            $("#area").html(result.data[0].surface_area ? numberWithCommas(result.data[0].surface_area) : "N/A")

                            RequestWeatherData(result.data[0].capital)
                            GetExchangeRate(result.data[0].currency)
                            GetCurrencyInfo(result.data[0].currency)
                        }
                        else{
                            $("#geo-error").show()
                        }
                    }
                    else{
                        $("#geo-error").show()
                        alert("Geographic data not found")
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR)
                }
            }); 
        }

        const GetPopularCities = (country) =>{
            $.ajax({
                url: "php/GetPopularCities.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    countryISO: country.iso2 || country.iso_a2
                },
                success: function(result) {
                    if(result.status.code === "200"){
                        result.data.geonames.forEach(function (item) {
                            L.marker([item.lat, item.lng], { icon: cityIcon })
                              .bindTooltip(item.name, { direction: "top", sticky: true })
                              .addTo(cities);
                          });
                    }
                    else{
                        alert("Cities not found")
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown)
                }
            })
        }
        
        const GetAirPorts = (country) =>{
            $.ajax({
                url: "php/GetAirportsAPI.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    countryISO:country.iso2 || country.iso_a2
                },
                success: function(result) {
                    if(result.status.code === "200"){
                        result.data.geonames.forEach(function (item) {
                            L.marker([item.lat, item.lng], { icon: airportIcon })
                              .bindTooltip(item.name, { direction: "top", sticky: true })
                              .addTo(airports);
                          });
                    }
                    else{
                        alert("Airports not found")
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown)
                }
            })

        }

        const GetExchangeRate = () =>{
            $.ajax({
                url: "php/GetCurrencyArray.php",
                type: 'GET',
                dataType: 'json',
                beforeSend: function(){
                    $("#currency-con").hide()
                    $("#exchange-table").hide()
                    $("#no-currency-found").hide()
                    $(".spinner-exchange").show()
                },
                complete: function(){
                    $(".spinner-exchange").hide()
                },
                success: function(result) {
                    if(result.status.code === "200"){
                        $("#no-currency-found").hide()
                        $("#exchange-table").show()
                        $("#currency-con").show()
                        currencyInfo = result.data.data;
                        // CONVERTS OBJECT TO ARRAY
                        var myData = Object.keys(currencyInfo).map(key => {
                            return currencyInfo[key];
                        })
                        currencyInfo = myData
                    }
                    else{
                        $("#no-currency-found").show()
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown)
                }
            }); 
        }

        const GetCurrencyInfo = (currency) =>{
            $("#currencyInput").val("1")
            currencyInfo.forEach(item =>{
                if(item.code === currency.code){
                    $("#currency-con").show()
                    $("#exchange-table").show()
                    $("#no-currency-found").hide()
                    
                    $("#ex-name").html(item.name)
                    $("#ex-symbol").html(item.symbol)
                    $("#ex-code").html(item.code)

                    $("#dis-currency-label").html(`To ${item.code}`)
                    $("#dis-currency").attr("placeholder",currencyRates[item.code])
                    $("#currencyInput").on("input", function(){
                        if(Number($(this).val())){
                            let value = Number($(this).val()) * currencyRates[item.code];
                            $("#dis-currency").attr("placeholder",value.toFixed(2))
                        }
                        else{
                            $("#dis-currency").attr("placeholder","...")
                        }
                    })
                }
                else{
                    $("#currency-con").hide()
                    $("#exchange-table").hide()
                    $("#no-currency-found").show()
                }
            })
        }
        
        const GetNews = (country) =>{
             $.ajax({
                url: "php/GetNewsAPI.php",
                type: 'GET',
                dataType: 'json',
                data:{
                    iso:country.iso_a2
                },
                beforeSend:function(){
                    $("#news-error").hide()
                    $("#news-table").hide()
                    $(".spinner-news").show()
                },
                complete: function(){
                    $(".spinner-news").hide()
                },
                success: function(result) {
                    if(result.status.code === "200"){
                        if(result.data.articles && result.data.articles.length > 0){
                            $("#news-table").show()
                            result.data.articles.forEach(news =>{
                                $("#news-table").append(`
                                <tr class="border-bottom text-secondary">
                                    <td >
                                        <img src="https://ichef.bbci.co.uk/images/ic/1200x675/p0gdcnjt.jpg" class="border rounded p-0 " width="200px" >
                                    </td>
                                    <td class ="pt-2 pb-2">
                                        <div class="row">
                                            <div>
                                            <a href="${news.url}" target="_blank" class = "text-dark" >${news.title.slice(0,70)}...</a>
                                            </div>
                                        </div>
                                    <p class="fw-light fs-6 p-2 m-0 text-secondary">${news.author ? news.author : "Unknown"}</p>
                                    </td>
                                </tr>
                                `)
                            })
                        }
                        else{
                            $("#news-error").show()
                        }
                    }
                    else{
                        alert("News Not Found")
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown)
                }
            })
        }
        
        const GeoReverseCode = (lat,lng) =>{
            $.ajax({
                url: "php/GetReverseGeocode.php",
                type: 'GET',
                dataType: 'json',
                data:{
                    lat:lat,
                    lng:lng,
                },
                success: function(res) {
                    if(res.status.code === "200"){
                        countryObj = {
                            iso2 :res.data.results[0].components["ISO_3166-1_alpha-2"],
                            lat :lat,
                            long: lng,
                            name :res.data.results[0].components.country,
                        }
                        $('#dropdown-menu').val(`${countryObj.iso2}`).change()
                        CreatePolygon(countryObj)
                        // GetPopularCities(countryObj)
                        showBtns()
                    }
                    else{
                        alert("Country could not be located")
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert(errorThrown)
                }
            }); 
        }

        GeoReverseCode(position.coords.latitude, position.coords.longitude)

        $.ajax({
            url: "php/GetCountriesAPI.php",
            type: 'GET',
            dataType: 'json',
            success: function(result) {

                if(result.status.code === "200"){
                    let index = 0
                    result.data.forEach(country => {
                        $("#dropdown-menu").append(`<option class="dropdown-item" value="${country.iso_a2}" id="${index}" >${country.name}</option>`)
                        index = index+1
                    });

                    GetExchangeRate()
    
                    $("#weather-info").hide()
                    $("#dropdown-menu").change(function(){
                        let id = $('#dropdown-menu').find(":selected").attr("id");
                        const country = result.data[id]
                        $(".select").html($(this).val())

                        RemoveAllMarkers()
                        clearModels()
    
                        // CREATE COUNTRY BORDER
                        CreatePolygon(country)
    
                        //Request data about country and append to UI 

                        GetDemographicData(country)
                        GetGeographicData(country)
                        GetAirPorts(country)
                        GetPopularCities(country)
                        GetNews(country)

                        // Add information buttons
                        removeBtns()
                        showBtns()
                    })
                }
                else{
                    alert("Error Retriving Countries")
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert(errorThrown)
            }
        });         
    }
});


