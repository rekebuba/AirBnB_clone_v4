$.getJSON("http://localhost:5001/api/v1/status/", function (response) {
        const status = response.status;
        if (status === 'OK') {
            $('#api_status').addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    }
);
