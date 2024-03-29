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

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#myTextarea').html("Invalid Coordintes");
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
            $('#myTextarea').html("");

            if (result.status.name == "ok") {
                $('#myTextarea').html(textedJson);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(errorThrown)
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
            $('#myTextarea').html("");

            if (result.status.name == "ok") {
                $('#myTextarea').html(textedJson);

            }
        
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus)
        }
    }); 
});