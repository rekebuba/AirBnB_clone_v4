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
        const amenities = {};
        $('li input[type=checkbox]').change(function () {
            if (this.checked) {
                amenities[this.dataset.name] = this.dataset.id;
            } else {
                delete amenities[this.dataset.name]
            }
            $('.amenities h4').text(Object.keys(amenities).sort().join(", "));

            if (Object.keys(amenities).length === 0) {
                $('.amenities h4').html(`&nbsp;`);
            }

        });

        const status = response.status;
        if (status === 'OK') {
            $('#api_status').addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    });


    $("button[type=button]").click(function () {
        $.ajax({
            type: "POST",
            url: "http://localhost:5001/api/v1/places_search/",
            data: JSON.stringify({ amenities: listOfAmenities }),
            contentType: "application/json",
            success: function (response) {
                response.sort((a, b) => a.name.localeCompare(b.name));
                $.each(response, function (index, place) {
                    var articleContent = `
                <article>
                    <div class="title_box">
                        <h2>${place.name}</h2>
                        <div class="price_by_night">$${place.price_by_night}</div>
                    </div>
                    <div class="information">
                        <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? "s" : ""
                        }</div>
                        <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? "s" : ""
                        }</div>
                        <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? "s" : ""
                        }</div>
                    </div>
                    <div class="user"></div>
                    <div class="description">
                        ${place.description}
                    </div>
                </article>
                `;

                    $(".places").append(articleContent);
                });
            }
        });
    });
});
