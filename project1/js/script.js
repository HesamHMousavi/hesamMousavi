


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

        // $("#card-body-1").hide()


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

        var cities = new L.MarkerClusterGroup();
        let basemaps = {
            "Streets": streets,
            "Satellite": satellite,
            "Default": defa,
          };

        var overlayMaps = {
            "Cities": cities
        };

        let map = L.map('map').setView([position.coords.latitude, position.coords.longitude], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            layers: [streets],
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map)          
        
        let infoBtn = L.easyButton("fa-info", function (btn, map) {
            $("#exampleModal").modal("show");
          });
        let infoBtn1 = L.easyButton("fa-globe", function (btn, map) {
            $("#exampleModal1").modal("show");
          });
        let infoBtn2 = L.easyButton("fa-cloud", function (btn, map) {
            $("#exampleModal2").modal("show");
          });
        let infoBtn3 = L.easyButton("fa-book-atlas", function (btn, map) {
            $("#exampleModal3").modal("show");
          });
        let infoBtn4 = L.easyButton("fa-money-bill-trend-up", function (btn, map) {
            $("#exampleModal4").modal("show");
          });

        layerControl = L.control.layers(basemaps,overlayMaps).addTo(map);

        $.ajax({
            url: "php/GetExchangeRate.php",
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                currencyRates = result.rates;
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText)
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
                    iso2: country.iso2
                },
                success: function(result) {
                    removeOutline();
                    layer = L.geoJSON(result.data).addTo(map);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR)
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
            $("#demo-table tbody").empty()
            $("#geo-table tbody").empty()
            $("#news-table").empty()
            $("#section-2-WEA").empty()
            $("#section-3-WEA").empty()
            $("p").remove(".remove");
            cities.clearLayers();
            
        }

        const populateTable = (arr, id) => {
            if(arr.length > 0){
                arr.forEach(att =>{
                    $(`#${id} tbody`).append(`
                     <tr>
                         <td class="text-center">
                            <i class="${att.icon}"></i>
                         </td>
                         <td>
                             ${att.key}
                         </td>  
                         <td class="text-end">
                             ${att.value ?  numberWithCommas(att.value) : "N/A"}
                         </td>
                    </tr>
                    `)
                })
            }else{
                $(`#${id} tbody`).append("<h5 class='text-center p-4 mt-3'>No data avaliable for this location</h5>")   
            }   
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
                 },
                 complete: function(){
                    $(".spinner-weather").hide()
                    // $("#weather-info").show()
                 },
                success: function(result) {
                    if(result){
                        $("#weather-info").show()
                        $("#city-name-WEA").html(result.location.name);
                        $("#local-time-WEA").html(result.location.localtime.split(" ")[1]);
                        $("#text-con-WEA").html(result.current.condition.text);
                        $("#temp-WEA").html(result.current.temp_c + "°C");
                        $("#wind-speed-WEA").html(result.current.gust_mph + " mph");
                        $("#hum-WEA").html(result.current.humidity + " %");
                        $("#uv-WEA").html(result.current.uv );
                        $("#icon-con-WEA").attr("src", result.current.condition.icon);
                        const days = ["Sun","Mon","Tue","Wed","Thur","Fir","Sat"]
                        result.forecast.forecastday[0].hour.forEach(item =>{
                            $("#section-2-WEA").append(`
                            <div class="flex-column m-3">
                            <p class="large"><strong>${item.temp_c}°C</strong></p>
                            <!-- <i class="fas fa-sun fa-2x mb-3" style="color: #868B94;"></i> -->
                            <img src="${item.condition.icon}" alt="">
                            <p class="mb-0">${item.condition.text}</p>
                            <p class="mb-0"><strong>${item.time.split(" ")[1]}</strong></p>
                          </div>`)
                        })
                        result.forecast.forecastday.forEach((item,index) =>{
                            if(index !== 0){
                                $("#section-3-WEA").append(`
                                <div class="flex-column">
                                <p class="small"><strong>${item.day.avgtemp_c}°C</strong></p>
                                <img src="${item.day.condition.icon}" alt="">
                                <p class="mb-0"><strong>${days[new Date(item.date).getDay()]}</strong></p>
                                <p class="mb-0">${item.day.condition.text}</p>
                                </div>`)
                            }
                        })
                    }
                    else{
                        $("#weather-info").hide()
                        $("#weather-table").append(`
                        <p class="d-flex justify-content-center align-items-center fs-5 text mt-5 mb-5 remove" id = "remove-me">
                        No Weather Information Found...
                      </p>`)
                    }


                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR)
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
                 },
                 complete: function(){
                    $(".spinner-demo").hide()
                 },
                success: function(result) {
                    if(result[0]){
                        const demoInfo = [
                            {key: "GDP", value: result[0].gdp , icon:"fa-solid fa-money-check-dollar"}, 
                            {key: "GDP Growth", value: result[0].gdp_growth, icon: "fa-solid fa-money-bill-trend-up"},
                            {key: "GDP Per Capita", value: result[0].gdp_per_capita ,icon: "fa-solid fa-money-bill-wheat"},
                            {key: "Unemploymen Rate", value: result[0].unemployment, icon: "fa-solid fa-user-doctor"},
                            {key: "Female Life Expectancy", value: result[0].life_expectancy_female, icon: "fa-solid fa-person-dress"},
                            {key: "Male Life Expectancy", value: result[0].life_expectancy_male, icon: "fa-solid fa-person"},
                            {key: "Population Growth", value: result[0].pop_growth, icon: "fa-solid fa-people-group"},
                            {key: "CO2 Emissions", value: result[0].co2_emissions, icon: "fa-solid fa-smog"},
                            {key: "Number of Exports", value: result[0].exports, icon: "fa-solid fa-truck-arrow-right"},
                            {key: "Number of Imports", value: result[0].imports, icon: "fa-solid fa-truck-ramp-box"},
                            {key: "Gender Ratio", value: result[0].sex_ratio, icon: "fa-solid fa-person-half-dress"}
                        ]
                        populateTable(demoInfo, "demo-table")
                    }
                    else{
                        $("#demo-table").append(`
                        <p class="d-flex justify-content-center align-items-center fs-5 text mt-5 mb-5 remove">
                        No Demographic Information Found...
                      </p>`)
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR)
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
                 },
                 complete: function(){
                    $(".spinner-geo").hide()
                 },
                success: function(result) {
                    if(result[0]){
                        const geoInfo = [
                            {key: "Capital City", value: result[0].capital , icon:"fa-solid fa-city"}, 
                            {key: "Population", value: result[0].population, icon: "fa-solid fa-people-group"},
                            {key: "Region", value: result[0].region ,icon: "fa-solid fa-map-location-dot"},
                            {key: "Surface Area (km²)", value: result[0].surface_area, icon: "fa-solid fa-chart-area"},
                            {key: "Currency Code", value: result[0].currency.code, icon: "fa-solid fa-yen-sign"},
                            {key: "Currency Name", value: result[0].currency.name, icon: "fa-solid fa-euro-sign"},
                            {key: "Forested Area", value: result[0].forested_area, icon: "fa-solid fa-tree"},
                            {key: "ISO", value: result[0].iso2, icon: "fa-solid fa-network-wired"},
                            {key: "Threatened Species", value: result[0].threatened_species, icon:"fa-solid fa-hippo"},
                            {key: "Tourists", value: result[0].tourists, icon: "fa-solid fa-person-walking-luggage"},
                        ]
                        RequestWeatherData(result[0].capital)
                        populateTable(geoInfo, "geo-table")
                        GetExchangeRate(result[0].currency)
                        GetCurrencyInfo(result[0].currency)
                    }
                    else{
                        $("#geo-table").append(`
                        <p class="d-flex justify-content-center align-items-center fs-5 text mt-5 mb-5 remove">
                        No Geographical Information Found...
                      </p>`)
                    }

                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR)
                }
            }); 
        }

        const GetPopularCities =  (country) =>{
            $.ajax({
                url: "php/GetPopularCities.php",
                type: 'POST',
                dataType: 'json',
                data: {
                    country: country.name
                },
                success: function(result) {
                    const popCities = []
                    const countryName = country.iso2 || item.country;
                    result.data.forEach(item =>{
                        popCities.push({city: item.city,country:countryName , population: item.populationCounts[0].value})
                        GetGeoCode(item.country, item.city,item.populationCounts[0].value)
                    })
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(jqXHR)
                }
            })
        }

        const GetExchangeRate = () =>{
            $.ajax({
                url: "php/GetCurrencyArray.php",
                type: 'GET',
                dataType: 'json',
                success: function(result) {
                    currencyInfo = result.data;
                    var myData = Object.keys(currencyInfo).map(key => {
                        return currencyInfo[key];
                    })
                    currencyInfo = myData
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            }); 
        }

        const GetCurrencyInfo = (currency) =>{
            let found = false;
            $("#currencyInput").val("1")
            $("#exchange-table").empty()
            currencyInfo.forEach(item =>{
                if(item.code === currency.code){
                    $("#currency-con").show()
                    $("#no-currency-found").hide()
                    for (const [key, value] of Object.entries(item)) {
                        found = true
                        $("#exchange-table").append(
                            `<tr>
                                <td>
                                ${key}
                                </td>
                                <td class="text-end">
                                ${value}
                                </td>
                            </tr>`
                        )
                    }
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
            })
            if(!found){
                $("#no-currency-found").show()
                $("#currency-con").hide()
            }
        }
        
        const GetNews = (country) =>{
             $.ajax({
                url: "php/GetNewsAPI.php",
                type: 'GET',
                dataType: 'json',
                data:{
                    iso:country.iso2
                },
                success: function(result) {
                    if(result.articles && result.articles.length > 0){
                        result.articles.forEach(news =>{
                            $("#news-table").append(`
                            <tr>
                                <td>
                                    <img src="https://ichef.bbci.co.uk/images/ic/1200x675/p0gdcnjt.jpg" width="100px" >
                                </td>
                                <td>
                                    <p class="text-dark" target="_blank">
                                        <a href="${news.url}">${news.title}</a>
                                </p>
                                </td>
                            </tr>
                            `)
                        })
                    }
                    else{
                        $("#news-table").append(`
                        <p class="d-flex justify-content-center align-items-center fs-5 text mt-5 mb-5">
                        No News Found...
                      </p>`)
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown)
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
                    countryObj = {
                        iso2 :res.results[0].components["ISO_3166-1_alpha-2"],
                        lat :lat,
                        long: lng,
                        name :res.results[0].components.country,
                    }
        
                    $(`#dropdown-menu option[value=${countryObj.iso2}]`).prop('selected', true); 
                    CreatePolygon(countryObj)
                    GetDemographicData(countryObj)
                    GetGeographicData(countryObj)
                    GetPopularCities(countryObj)
                    GetNews(countryObj)
                    showBtns()
                    map.setZoom(6);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            }); 
        }

        const GetGeoCode = (country, city, population) =>{
            var greenIcon = L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/190/190914.png',
                iconSize:[35, 35],
            });
            $.ajax({
                url: "php/GetGeocode.php",
                type: 'GET',
                dataType: 'json',
                data:{
                    country:country,
                    city:city,
                },
                success: function(res) {
                    if(res.length > 0){
                        res[0].lat = res[0].latitude
                        res[0].lon = res[0].longitude
                        let marker = L.marker([res[0].lat,res[0].lon],{icon:greenIcon})
                        marker.bindPopup(`
                        <div class="container">
                            <div class="d-flex row">
                                <h4>${city}</h4>
                                <h6>Population : ${numberWithCommas(population)}</h6>
                            </div>
                        </div>
                        `);
                        marker.on('mouseover', function(event){
                            marker.openPopup();
                        });
                        marker.on('mouseout', function(event){
                            marker.closePopup();
                          });
                        cities.addLayer(marker);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // console.log(jqXHR)
                }
            })
        }

        GeoReverseCode(position.coords.latitude, position.coords.longitude)

        $.ajax({
            url: "php/GetCountriesAPI.php",
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                let index = 0
                result.data.forEach(country => {
                    $("#dropdown-menu").append(`<option class="dropdown-item" value="${country.iso2}" id="${index}" >${country.name}</option>`)
                    index = index+1
                });

                GetExchangeRate()

                $("#weather-info").hide()
                $("#dropdown-menu").change(function(){
                    let id = $('#dropdown-menu').find(":selected").attr("id");
                    const country = result.data[id]
                    GetPopularCities(country)
                    $(".select").html($(this).val())

                    map.setView([country.lat, country.long], 7)
                    //REMOVE ALL OTHER MARKERS
                    RemoveAllMarkers()
                    // SET MARKER AND COUNTRY BORDER
                    // CLEAR MODELS DATA
                    clearModels()

                    // CREATE COUNTRY BORDER
                    CreatePolygon(country)

                    //Request data about country and append to UI 
                    GetDemographicData(country)
                    GetGeographicData(country)
                    GetNews(country)


                    // Add information buttons
                    removeBtns()
                    showBtns()
                   
                })
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(errorThrown)
            }
        });         
    }
});


