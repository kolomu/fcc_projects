$(document).ready(function () {
    var quote = {
        "Text": "",
        "Author": ""
    };

    getQuote();

    $("#getQuote").on("click", function () {
        getQuote();
    });

    $("#tweet").on("click", function () {
        var re = / /gi;
        var str = quote.Text + ' - ' + quote.Author;
        var twitterStr = str.replace(re, "%20");
        var link = "https://twitter.com/intent/tweet?text=";
        link += twitterStr;
        link += "&hashtags=quotes";
        $('#tweet').attr('href', link);
    });

    function getQuote() {
        $.getJSON("http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?")
            .done(handleQuote)
            .fail(handleErr);
    }

    function handleErr(jqxhr, textStatus, err) {
        console.log("Request Failed: " + textStatus + ", " + err);
    }

    function handleQuote(response) {
        quote.Text = response.quoteText;
        quote.Author = response.quoteAuthor;

        var html = "";
        html += "<div class='quote'>";
        html += "<blockquote><p>"
        html += response.quoteText;
        html += "</p><footer>";
        html += response.quoteAuthor;
        html += "</footer></blockquote>";
        html += "</div>";

        $('#quote').html(html);
    }
});