const { log } = require("console");
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
            const dbData = JSON.parse(contents);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(dbData.state));
            res.end();
          });
          break;

        case "/app/timeCardTemplate.html":
          fs.readFile(__dirname + "/app/timeCardTemplate.html").then(
            (contents) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(contents);
              res.end();
            },
          );
          break;

        case "/app/emptyTimeCard.html":
          fs.readFile(__dirname + "/app/emptyTimeCard.html").then(
            (contents) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(contents);
              res.end();
            },
          );
          break;

        case "/app/timeCards":
          fs.readFile(__dirname + "/db.json").then((contents) => {
            const dbData = JSON.parse(contents);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify(dbData.timeCards));
            res.end();
          });
          break;
      }
    } else if (req.method === "POST") {
      if (req.url === "/app/timeCards") {
        let body = "";
        req
          .on("data", (chunk) => (body += chunk.toString()))
          .on("end", () => {
            // const data = ;
            fs.readFile(__dirname + "/db.json").then((contents) => {
              const dbData = JSON.parse(contents);
              dbData.timeCards.push(JSON.parse(body));
              //console.log(dbData);
              fs.writeFile(__dirname + "/db.json", JSON.stringify(dbData));

              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(JSON.stringify(dbData));
              res.end();
            });
          });
      } else if (req.url === "/app/timeCards/breaks") {
        let body = "";
        req
          .on("data", (chunk) => (body += chunk.toString()))
          .on("end", () => {
            // const data = ;
            fs.readFile(__dirname + "/db.json").then((contents) => {
              const dbData = JSON.parse(contents);
              const lastTimeCard = dbData.timeCards[timeCards.length - 1]; //.breaks.push(JSON.parse(body));
              /* if (
                lastTimeCard.breaks === undefined ||
                lastTimeCard.breaks[lastTimeCard.length - 1].length > 1
              ) {
                
              }*/
              if (lastTimeCard.breaks === undefined) {
                lastTimeCard.breaks = []; //Создаем массив перерывов
                lastTimeCard.breaks.push(JSON.parse(body)); //Пишем в него
              } else {
                const lastBreak = lastTimeCard.breaks[breaks.length - 1];
                if (lastBreak.length > 1) {
                  //Создаем новый объект в массиве
                  //	Пишем в него
                } else {
                  //Пишем после нее
                }
              }

              //console.log(dbData);
              fs.writeFile(__dirname + "/db.json", JSON.stringify(dbData));

              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(JSON.stringify(dbData));
              res.end();
            });
          });
      }
    } else if (req.method === "PATCH") {
      if (req.url === "/app/state") {
        let body = "";
        req
          .on("data", (chunk) => (body += chunk.toString()))
          .on("end", () => {
            fs.readFile(__dirname + "/db.json").then((contents) => {
              const dbData = JSON.parse(contents);
              const bodyObj = JSON.parse(body);

              for (const key in bodyObj) {
                dbData.state[key] = bodyObj[key];
              }

              fs.writeFile(__dirname + "/db.json", JSON.stringify(dbData));

              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(JSON.stringify(dbData.state));
              res.end();
            });
          });
      }
    }
  })
  .listen(8080); //the server object listens on port 8080
