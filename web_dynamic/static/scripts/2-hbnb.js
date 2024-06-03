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
});
