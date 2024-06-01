$.ajax({
    type: "POST",
    url: "http://localhost:5001/api/v1/places_search/",
    data: JSON.stringify({}),
    contentType: "application/json",
    success: function (response) {
        $.each(response, function (index, place) {
            var articleContent = `
            <article>
				<div class="title_box">
					<h2>${place.name}</h2>
					<div class="price_by_night">$${place.price_by_night}</div>
				</div>
				<div class="information">
					<div class="max_guest">${place.max_guest} Guests</div>
					<div class="number_rooms">${place.number_rooms} Bedrooms</div>
					<div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
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
