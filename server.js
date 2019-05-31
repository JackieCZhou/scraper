var express = require("express")
var mongoose = require("mongoose")
var cheerio = require("cheerio")
var axios = require("axios")
var logger = require("morgan");
var path = require("path");



var db = require("./models");


var PORT = process.env.PORT || 3000;


var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function (req, res) {

    axios.get("http://time.com/section/world/").then(function (response) {
      var $ = cheerio.load(response.data);
      $("article.partial.tile.media").each(function(i, element) {
        // Save an empty result object
        var result = {};
        // Then, we load that into cheerio and save it to $ for a shorthand selector



        // Now, we grab every h2 within an article tag, and do the following:
        result.title = $(this).children("div.media-body").children("h3.headline").text();
        result.summary = $(this).children("div.media-body").children("div.article-info-extended").children("div.summary").text();
        result.link = "http://www.time.com/" + $(this).children("div.media-body").children("h3.headline").find("a").attr("href");

        console.log(result)

        db.Article.create(result)
            .then(function (dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            });
    });
    res.send("Scrape Complete");
});
});
// getting all saved articles, populating on main pg
// app.get("/articles/saved", function(req, res) {
//     db.Article.find({saved: "true"})
//       .then(function(dbArticle) {
//         res.json(dbArticle);
//         console.log(dbArticle)
//       })
//       .catch(function(err) {
//         res.json(err);
//         console.log
//       })
//   });

// getting saved articles from database
  app.get("/api/saved", function(req, res) {
    db.Article.find({saved: "true"})
      .then(function(dbArticle) {
        res.json(dbArticle);
        console.log(dbArticle)
      })
      .catch(function(err) {
        res.json(err);
        console.log
      })
  });

// serving saved.html
  app.get("/saved", function(req, res){
    res.sendFile(path.join(__dirname, "./public/saved.html"));
  })


// 

// grabbing id of article, populating
  app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  // updating id of saved article's true false, status to true
  app.put("/articles/saved/:id", function(req, res){
    console.log(req.params.id);
    db.Article.findOneAndUpdate({_id: req.params.id}, {saved: true})
    .then(function(dbArticle){
      res.json(dbArticle);
      console.log(dbArticle)
    })


  })
  // posting selected articles note
  app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
      .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

  app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
      res.json(dbArticle);
      
    })
    .catch(function(err){
    console.log(err)})
  })

  app.delete("/api/saved/:id", function(req, res){
    console.log(req.params.id);
    db.Article.findOneAndUpdate({_id: req.params.id}, {saved: false})
    .then(function(dbArticle){
      res.json(dbArticle);
      console.log(dbArticle)
    })
  })

  app.delete("/api/saved/", function(req, res){
    console.log(req.params.id);
    db.Article.deleteMany()
    .then(function(dbArticle){
      res.json(dbArticle);
      console.log(dbArticle)
    })
  });

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  