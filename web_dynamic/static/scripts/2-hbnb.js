$(document).ready(function () {
    var listOfAmenities = [];
    $('li input[type=checkbox]').change(function () {
        if (this.checked) {
            listOfAmenities.push(this.dataset.id);
        } else {
            listOfAmenities.splice(this.dataset.id);
        }
        $('.amenities h4').text(listOfAmenities.sort().join(", "));

        if (listOfAmenities.length === 0) {
            $('.amenities h4').html(`&nbsp;`);
        }
    });

    $.getJSON("http://localhost:5001/api/v1/status/", function (response) {

        const status = response.status;
        if (status === 'OK') {
            $('#api_status').addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    }
    );

});
