$.getJSON("/articles", function(data) {

  console.log(data)
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
      // added save button on each article
      $("#articles").append("<button id= 'saved' data-id="+ data[i]._id + "> save </button>");
      
    }
  });
  
  // scraping all articles
  $(document).on("click", "#scrape", function(){
    $.ajax({
        method: "GET",
        url: "/scrape" 
    })
    .then(function(data){
    location.reload();

    })
    console.log("Scrape button clicked");
  })


// on save, taking id, putting in saved category 
  $(document).on("click", "#saved", function(){
      $.ajax({
          method: "PUT",
          url: "/articles/saved/"+ $(this).attr("data-id")
      })
      .then(function(data){
        $(this).attr("data-id") 
      })
      console.log("save button clicked");
      console.log ($(this).attr("data-id"));
  })


  