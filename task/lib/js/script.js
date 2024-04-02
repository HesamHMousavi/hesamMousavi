$('#submit').click(function() {
    $.ajax({
        url: "lib/php/Api1.php",
        type: 'POST',
        dataType: 'json',
        data: {
            input1: $('#input1').val(),
            input2: $('#input2').val()
        },
        success: function(result) {
            let textedJson = JSON.stringify(result, undefined, 4);
            $('#myTextarea').html("");
            if (result.status.name == "ok") {
                $('#myTextarea').html(textedJson);

                $('#name').html("Name: "+result.data.name);
                $('#distance').html("Distance: "+result.data.distance);
                $('#geoid').html("Geoname Id: "+result.data.geonameId);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Invalid Coordintes")
        }
    }); 
});

$('#submit1').click(function() {
    $.ajax({
        url: "lib/php/Api2.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat: $('#lat').val(),
            in: $('#in').val()
        },
        success: function(result) {
            let textedJson = JSON.stringify(result, undefined, 4);

            if (result.status.name == "ok") {
                $('#name').html("Name: "+result.data[0].name);
                $('#distance').html("Distance: "+result.data[0].distance);
                $('#geoid').html("Geoname Id: "+result.data[0].geonameId);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Invalid Coordintes")
        }
    }); 
});

$('#sbt').click(function() {
    $.ajax({
        url: "lib/php/Api3.php",
        type: 'POST',
        dataType: 'json',
        data: {
            lat1: $('#lat1').val(),
            in1: $('#in1').val()
        },
        success: function(result) {
            let textedJson = JSON.stringify(result, undefined, 4);

            if (result.status.name == "ok") {
                $('#name').html("Name: "+result.data[0].name);
                $('#distance').html("Distance: "+result.data[0].distance);
                $('#geoid').html("Geoname Id: "+result.data[0].geonameId);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Invalid Coordintes")
        }
    }); 
});