const http = require("http");
const fs = require("fs").promises;

//create a server object:
http
  .createServer(function (req, res) {
    if (req.method === "GET") {
      switch (req.url) {
        case "/":
          fs.readFile(__dirname + "/app/app.html").then((contents) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(contents);
            res.end();
          });
          break;

        case "/app/styles.css":
          fs.readFile(__dirname + "/app/styles.css").then((contents) => {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.write(contents);
            res.end();
          });
          break;

        case "/app/app.js":
          fs.readFile(__dirname + "/app/app.js").then((contents) => {
            res.write(contents);
            res.end();
          });
          break;

        case "/app/svg/play.svg":
          fs.readFile(__dirname + "/app/svg/play.svg").then((contents) => {
            res.write(contents);
            res.end();
          });
          break;

        case "/app/svg/pause.svg":
          fs.readFile(__dirname + "/app/svg/pause.svg").then((contents) => {
            res.write(contents);
            res.end();
          });
          break;

        case "/favicon.ico":
          fs.readFile(__dirname + "/app/favicon.ico").then((contents) => {
            res.write(contents);
            res.end();
          });
          break;

        case "/app/state":
          fs.readFile(__dirname + "/db.json").then((contents) => {
            const jsonData = JSON.parse(contents);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(jsonData.state));
            res.end();
          });
          break;

        case "/app/timeCardTemplate.html":
          fs.readFile(__dirname + "/app/timeCardTemplate.html").then(
            (contents) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(contents);
              res.end();
            }
          );
          break;

        case "/app/emptyTimeCard.html":
          fs.readFile(__dirname + "/app/emptyTimeCard.html").then(
            (contents) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(contents);
              res.end();
            }
          );
          break;

        case "/app/timeCards":
          fs.readFile(__dirname + "/db.json").then((contents) => {
            const jsonData = JSON.parse(contents);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(jsonData.timeCards));
            res.end();
          });
          break;
      }
    } else if (req.method === "POST") {
      if (req.url === "/app/timeCards") {
        const body = {};
        req.on("data", (chunk) => body.assign(chunk));
        console.log(body);
      }
    }
  })
  .listen(8080); //the server object listens on port 8080
