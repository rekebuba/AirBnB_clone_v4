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
        delete amenities[this.dataset.id];
      }
    } else if ($(this).closest('.locations').length) {
      if ($(this).closest('#cityCheckbox').length) {
        if (this.checked) {
          city[this.dataset.id] = this.dataset.name;
        } else {
          delete city[this.dataset.id];
        }
      } else if ($(this).closest('#stateCheckbox')) {
        if (this.checked) {
          state[this.dataset.id] = this.dataset.name;
        } else {
          delete state[this.dataset.id];
        }
      }
    }

    $('.amenities h4').text(Object.values(amenities).sort().join(', '));

    const mergedObj = Object.assign({}, state, city);
    $('.locations h4').text(Object.values(mergedObj).sort().join(', '));

    if (Object.keys(amenities).length === 0) {
      $('.amenities h4').html('&nbsp;');
    }
    if (Object.keys(mergedObj).length === 0) {
      $('.locations h4').html('&nbsp;');
    }
  });

  // to show that the api status is OK
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (response) {
    const status = response.status;
    if (status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  // When the button tag is clicked,
  // a new POST request to places_search should be made
  // with the list of Amenities, Cities and States checked
  $('button[type=button]').click(function () {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      data: JSON.stringify({
        amenities: Object.keys(amenities),
        states: Object.keys(state),
        cities: Object.keys(city)
      }),
      contentType: 'application/json',
      success: function (response) {
        $('.places').empty();
        response.sort((a, b) => a.name.localeCompare(b.name));

        $.each(response, function (index, place) {
          const articleContent = `
                    <article>
                        <div class="title_box">
                            <h2>${place.name}</h2>
                            <div class="price_by_night">$${place.price_by_night}</div>
                        </div>
                        <div class="information">
                            <div class="max_guest">${place.max_guest} Guest${place.max_guest > 1 ? 's' : ''}</div>
                            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms > 1 ? 's' : ''}</div>
                            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms > 1 ? 's' : ''}</div>
                        </div>
                        <div class="user"><b>Owner:</b> Adrienne</div>
                        <div class="description">${place.description}</div>
                        <div class="amenities2">
                            <h2 data-type="amenities">Amenities <span><button type="button">Show</button></span></h2>
                            <ul class="amenitielist" data-id=${place.id}></ul>
                        </div>
                        <div class="reviews">
                            <h2 data-type="reviews">Reviews <span><button type="button">Show</button></span></h2>
                            <ul class="reviewlist" data-id=${place.id}></ul>
                        </div>
                    </article>
                    `;

          $('.places').append(articleContent);
        });

        // all list should be hidden as a default
        $('.amenitielist, .reviewlist').hide();

        // This button should work like a toggle to fetch/display and hide reviews
        $('.reviews button[type=button]').click(function () {
          const button = $(this);
          const value = button.text();
          const reviewsContainer = button.closest('.reviews');
          const reviewList = reviewsContainer.find('.reviewlist');
          const reviewNum = reviewsContainer.find('h2');
          if (value === 'Show') {
            button.text('Hide');
            const placeId = reviewList.get(0).dataset.id;
            $.getJSON(
              `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`,
              function (reviews) {
                $(reviewNum).each(function () {
                  $(this)
                    .contents()
                    .filter(function () {
                      return this.nodeType === 3; // Node type 3 is a text node
                    })
                    .first()
                    .replaceWith(`${reviews.length} Reviews `);
                });
                $.each(reviews, function (index, review) {
                  $.getJSON(
                    `http://0.0.0.0:5001/api/v1/users/${review.user_id}`,
                    function (user) {
                      const li = $('<li>');
                      const h3 = $('<h3>').text(
                        'From ' +
                          user.first_name +
                          ' in ' +
                          user.updated_at.substring(0, 10)
                      );
                      const p = $('<p>').html(review.text);
                      li.append(h3);
                      li.append(p);
                      reviewList.append(li);
                    }
                  );
                });
              }
            );
            reviewList.show();
          } else {
            button.text('Show');
            reviewList.empty();
            reviewList.hide();
          }
        });

        // This button should work like a toggle to fetch/display and hide Amenities
        $('.amenities2 button[type=button]').click(function () {
          const button = $(this);
          const value = button.text();
          const amenitiesContainer = button.closest('.amenities2');
          const amenityList = amenitiesContainer.find('.amenitielist');
          const amenityNum = amenitiesContainer.find('h2');

          if (value === 'Show') {
            button.text('Hide');
            const placeId = amenityList.get(0).dataset.id;
            $.getJSON(
              `http://0.0.0.0:5001/api/v1/places/${placeId}/amenities`,
              function (amenities) {
                $(amenityNum).each(function () {
                  $(this)
                    .contents()
                    .filter(function () {
                      return this.nodeType === 3; // Node type 3 is a text node
                    })
                    .first()
                    .replaceWith(`${amenities.length} Amenities `);
                });
                $.each(amenities, function (index, amenity) {
                  $(`<li class=${amenity.name.replace(/\s/g, "_")}>`).text(amenity.name).appendTo(amenityList);
                });
              }
            );
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
