var express = require("express")
var express_handlebars = require("express-handlebars")
var mongoose = require("mongoose")
var cheerio = require("cheerio")
var axios = require("axios")



var db = require("./models");


var PORT = 3000;


var app = express();

// app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function (req, res) {

    axios.get("http://time.com/").then(function (response) {

    var result = {};
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        result.title = $(this).children("h3.headline").text();
        result.summary = $(this).children("div.article-info-extened").children("div.summary").text()
        result.link = $(this).children("h3.headline").attr("href");

        console.log(this.children);
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

app.get("/articles/saved", function(req, res) {
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








app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  