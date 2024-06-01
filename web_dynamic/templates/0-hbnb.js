document.addEventListener('DOMContentLoaded', function() {
    const queryString = "?hello"
    const links = document.getElementsByTagName('link');
    for (let link of links) {
        const herf = link.getAttribute('herf');
        if (herf && !herf.includes(queryStrings)) {
            link.setAttribute("href", herf + queryString);
        }
    }
});
