// Auto Selected SearchTerm Field
window.onload = function () {
    $('#searchTerm').focus();
}

// Pressing enter equals clicking the Submit Button
$("#searchTerm").keyup(function (event) {
    if (event.keyCode == 13) {
        $("#btnSearch").click();
    }
});

// Doing the REST Request after clicking on the Button
document.getElementById('btnSearch').onclick = function () {
    var search = document.getElementById('searchTerm').value;
    var searchEncoded = encodeURIComponent(search);
    getSearchResults(searchEncoded);
}

// Getting a Random Wikipedia Article after clicking on the Button
    document.getElementById('btnRandom').onclick = function () {
    var requestURL = "https://en.wikipedia.org/w/api.php?action=query&list=random&rnlimit=1&format=json&rnnamespace=0";

    $.ajax({
        url: requestURL,
        data: String,
        dataType: 'jsonp',
        type: 'GET',
        contentType: "application/json; charset=UTF-8",
        headers: {
            'Api-User-Agent': 'MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) BasedOnSuperLib/1.4'
        },
        success: function (data) {
            handleRandomPage(data);
        }
    });

    function handleRandomPage(data) {
        console.log(data);
        if (data.query && data.query.random) {
            var id = data.query.random[0].id;
            var pageURL = "https://en.wikipedia.org/?curid=" + id;
            window.location = pageURL;
        }
    }
}

function getSearchResults(searchTerm) {
    var parameters = "&limit=10&namespace=0&format=json";
    var requestURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + searchTerm + parameters;

    $.ajax({
        url: requestURL,
        data: String,
        dataType: 'jsonp',
        type: 'GET',
        contentType: "application/json; charset=UTF-8",
        headers: {
            'Api-User-Agent': 'MyCoolTool/1.1 (https://example.org/MyCoolTool/; MyCoolTool@example.org) BasedOnSuperLib/1.4'
        },
        success: function (data) {
            handleSearchResults(data);
        }
    });

    function handleSearchResults(data) {
        var searchHTML = "";

        if (data.length === 4) {
            var titles = data[1];
            var descriptions = data[2];
            var urls = data[3];

            titles.forEach(function (element, index) {
                searchHTML += "<a href='" + urls[index] + "'>";
                searchHTML += "<div class='resultBox'>";
                searchHTML += "<h2 class='title'>";
                searchHTML += element;
                searchHTML += "</h2>";
                searchHTML += "<div class='description'>";
                searchHTML += descriptions[index];
                searchHTML += "</a>";
                searchHTML += "</div>";
                searchHTML += "</div>";
            });
        }

        $('#searchResults').html(searchHTML);

    }
}

$(document).ajaxError(function (event, request, settings) {
    $("#msg").append("<li>Error requesting page " + settings.url + "</li>");
});