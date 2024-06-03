$(document).ready(function () {
  const amenities = {};
  $('li input[type=checkbox]').change(function () {
    if (this.checked) {
      amenities[this.dataset.id] = this.dataset.name;
    } else {
      delete amenities[this.dataset.id];
    }
    $('.amenities h4').text(Object.values(amenities).sort().join(', '));

    if (Object.keys(amenities).length === 0) {
      $('.amenities h4').html('&nbsp;');
    }
  });

  $.getJSON('http://0.0.0.0:5001/api/v1/status/', function (response) {
    const status = response.status;
    if (status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    data: JSON.stringify({}),
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
    }
  });
});
