$(document).ready(function () {
    const amenities = {};
    const state = {};
    const city = {};
    $('li input[type=checkbox]').change(function () {
        if ($(this).closest('.amenities').length) {
            if (this.checked) {
                amenities[this.dataset.id] = this.dataset.name;
            } else {
                delete amenities[this.dataset.id]
            }
        }
        else if ($(this).closest('.locations').length) {
            if ($(this).closest('#cityCheckbox').length) {
                if (this.checked) {
                    city[this.dataset.id] = this.dataset.name;
                } else {
                    delete city[this.dataset.id]
                }
            } else if ($(this).closest('#stateCheckbox')) {
                if (this.checked) {
                    state[this.dataset.id] = this.dataset.name;
                } else {
                    delete state[this.dataset.id]
                }
            }
        }

        $('.amenities h4').text(Object.values(amenities).sort().join(", "));

        const mergedObj = Object.assign({}, state, city)
        $('.locations h4').text(Object.values(mergedObj).sort().join(", "));

        if (Object.keys(amenities).length === 0) {
            $('.amenities h4').html(`&nbsp;`);
        }
        if (Object.keys(state).length === 0) {
            $('.locations h4').html(`&nbsp;`);
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
        console.log({
            amenities: Object.keys(amenities),
            states: Object.keys(state),
            cities: Object.keys(city)
        });
        $.ajax({
            type: "POST",
            url: "http://localhost:5001/api/v1/places_search/",
            data: JSON.stringify(
                {
                    amenities: Object.keys(amenities),
                    states: Object.keys(state),
                    cities: Object.keys(city)
                }),
            contentType: "application/json",
            success: function (response) {
                response.sort((a, b) => a.name.localeCompare(b.name));
                console.log(response);
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
