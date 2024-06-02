$(document).ready(function () {
    /**
     * if the checkbox is checked, must store the (Amenity, state, city) ID in a variable (dictionary or list)
     * if the checkbox is unchecked, must remove the (Amenity, state, city) ID from the variable
     * update the h4 tag inside the div (Amenity, state, city) with the list of Amenities checked
     */
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
        if (Object.keys(mergedObj).length === 0) {
            $('.locations h4').html(`&nbsp;`);
        }

    });

    // to show that the api status is OK
    $.getJSON("http://localhost:5001/api/v1/status/", function (response) {

        const status = response.status;
        if (status === 'OK') {
            $('#api_status').addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    });

    // When the button tag is clicked,
    // a new POST request to places_search should be made
    // with the list of Amenities, Cities and States checked
    $("button[type=button]").click(function () {
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
                    <div class="amenities2">
                    <h2>Amenities <span><button type="button">Show</button></span></h2>
                    <ul class="amenitielist", data-id=${place.id}></ul>
                    <div class="reviews">
                        <h2>3 Reviews <span><button type="button">Show</button></span></h2>
                        <ul class="reviewlist">
                            <li>
                                <h3>From Kamie Nean the 6th September 2017</h3>
                                <p>I felt like a Queen during my stay!</p>
                            </li>
                            <li>
                                <h3>From Heman the 5th October 2017</h3>
                                <p>Beautiful Place.</p>
                            </li>
                            <li>
                                <h3>From Numa the 15th August 2017</h3>
                                <p>Great view and service!</p>
                            </li>
                        </ul>
                    </div>
                </div>
                </article >
                    `;

                    $(".places").append(articleContent);
                });

                // all of them should be hidden as a default
                $('.reviewlist').hide();
                $('.amenitielist').hide();

                // This button should work like a toggle to fetch/display and hide reviews
                $(".reviews button[type=button]").click(function () {
                    const button = $(this);
                    const value = button.text();
                    const reviewsContainer = button.closest('.reviews');
                    const reviewlist = reviewsContainer.find('.reviewlist')
                    if (value === 'Show') {
                        button.text('Hide');
                        console.log(value);
                        reviewlist.show();
                    } else {
                        button.text('Show');
                        reviewlist.hide();
                    }
                });

                // This button should work like a toggle to fetch/display and hide Amenities
                $(".amenities2 button[type=button]").click(function () {
                    const button = $(this);
                    const value = button.text();
                    const amenitiesContainer = button.closest('.amenities2');
                    const amenityList = amenitiesContainer.find('.amenitielist');

                    if (value === 'Show') {
                        button.text('Hide');
                        const placeId = amenityList.get(0).dataset.id
                        $.getJSON(`http://localhost:5001/api/v1/places/${placeId}/amenities`, function (data) {
                            $.each(data, function (index, amenity) {
                                $('<li>').text(amenity.name).appendTo(amenityList);
                            });
                        });
                        amenityList.show();
                    } else {
                        button.text('Show');
                        amenityList.empty();
                        amenityList.hide();
                    }
                });
            }
        });
    });

});
