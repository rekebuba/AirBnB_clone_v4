$(document).ready(function () {
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
});
