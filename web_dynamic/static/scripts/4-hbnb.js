$(document).ready(function () {

    const amenities = {};
    $('li input[type=checkbox]').change(function () {
        if (this.checked) {
            amenities[this.dataset.id] = this.dataset.name;
        } else {
            delete amenities[this.dataset.id]
        }
        $('.amenities h4').text(Object.values(amenities).sort().join(", "));

        if (Object.keys(amenities).length === 0) {
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
    });


    $("button[type=button]").click(function () {
        $.ajax({
            type: "POST",
            url: "http://localhost:5001/api/v1/places_search/",
            data: JSON.stringify({ amenities: Object.keys(amenities) }),
            contentType: "application/json",
            success: function (response) {
                $(".places").empty();
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
