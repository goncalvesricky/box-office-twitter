var main = function () {
    $.getJSON("/counts.json", function (response) {
        $("body").append("<p>movie:"+response.movie+"</p>");
    });
};

$(document).ready(main);
