// on pg load getting saved articles from database
console.log("hello")

$.getJSON("/api/saved", function (data) {

    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        $("#articles").append("<button id= 'delete' data-id=" + data[i]._id + "> delete </button>");
        $("#articles").append("<button id= 'addnote' data-id=" + data[i]._id + "> add note </button>");
    }
    console.log(data);
})


// Whenever someone clicks a p tag
$(document).on("click", "#addnote", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {

            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append("<input id='titleinput' name='title' >");
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

// deleting selected article
$(document).on("click", "#delete", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "DELETE",
        url: "/api/saved/" + thisId,
    })
    .then(function(data){
        location.reload();
     
})
})


// clearing all articles
$(document).on("click", "#clear", function () {
    $.ajax({
        method: "DELETE",
        url: "/api/saved/"
    })
    .then(function(data){
        location.reload();
     
})
})

