const { log } = require("console");
const http = require("http");
const fs = require("fs").promises;

//create a server object:
http
  .createServer(function (req, res) {
    /*TODO добавить везде try{} catch(err){console.log("Ошибка!" + err);
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.write("Ошибка!" + err);
              res.end();}*/
    if (req.method === "GET") {
      switch (req.url) {
        case "/":
          try {
            fs.readFile(__dirname + "/app/app.html").then((contents) => {
              res.writeHead(200, { "Content-Type": "text/html" });
              res.write(contents);
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/styles.css":
          try {
            fs.readFile(__dirname + "/app/styles.css").then((contents) => {
              res.writeHead(200, { "Content-Type": "text/css" });
              res.write(contents);
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/app.js":
          try {
            fs.readFile(__dirname + "/app/app.js").then((contents) => {
              res.write(contents);
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/svg/play.svg":
          try {
            fs.readFile(__dirname + "/app/svg/play.svg").then((contents) => {
              res.write(contents);
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/svg/pause.svg":
          try {
            fs.readFile(__dirname + "/app/svg/pause.svg").then((contents) => {
              res.write(contents);
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/favicon.ico":
          try {
            fs.readFile(__dirname + "/app/favicon.ico").then((contents) => {
              res.write(contents);
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/state":
          try {
            fs.readFile(__dirname + "/db.json").then((contents) => {
              const dbData = JSON.parse(contents);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(JSON.stringify(dbData.state));
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/timeCardTemplate.html":
          try {
            fs.readFile(__dirname + "/app/timeCardTemplate.html").then(
              (contents) => {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(contents);
                res.end();
              },
            );
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/emptyTimeCard.html":
          try {
            fs.readFile(__dirname + "/app/emptyTimeCard.html").then(
              (contents) => {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(contents);
                res.end();
              },
            );
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/timeCards":
          try {
            fs.readFile(__dirname + "/db.json").then((contents) => {
              const dbData = JSON.parse(contents);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(JSON.stringify(dbData.timeCards));
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;
      }
    } else if (req.method === "POST") {
      if (req.url === "/app/timeCards") {
        try {
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
        } catch (err) {
          console.log("Ошибка!" + err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.write("Ошибка!" + err);
          res.end();
        }
      } else if (req.url === "/app/timeCards/breaks") {
        try {
          let body = "";
          req
            .on("data", (chunk) => (body += chunk.toString()))
            .on("end", () => {
              fs.readFile(__dirname + "/db.json").then((contents) => {
                const dbData = JSON.parse(contents);

                let lastTimeCard =
                  dbData.timeCards[dbData.timeCards.length - 1];
                console.log(JSON.parse(body));
                console.log("перед расчетом перерыва ");
                console.log(lastTimeCard);
                if (lastTimeCard.breaks === undefined) {
                  lastTimeCard.breaks = [JSON.parse(body)];
                } else {
                  if (
                    Object.keys(
                      lastTimeCard.breaks[lastTimeCard.breaks.length - 1],
                    ).length > 1
                  ) {
                    lastTimeCard.breaks.push(JSON.parse(body));
                  } else {
                    Object.assign(
                      lastTimeCard.breaks[lastTimeCard.breaks.length - 1],
                      JSON.parse(body),
                    );
                  }
                }
                console.log("после перерыва ");
                console.log(lastTimeCard);
                console.log("массив перерывов ");
                console.log(lastTimeCard.breaks);
                fs.writeFile(__dirname + "/db.json", JSON.stringify(dbData));

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(dbData));
                res.end();
              });
            });
        } catch (err) {
          console.log("Ошибка!" + err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.write("Ошибка!" + err);
          res.end();
        }
      }
    } else if (req.method === "PATCH") {
      if (req.url === "/app/state") {
        try {
          let body = "";
          req
            .on("data", (chunk) => (body += chunk.toString()))
            .on("end", () => {
              try {
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
              } catch (err) {
                console.log("Ошибка!" + err);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write("Ошибка!" + err);
                res.end();
              }
            });
        } catch (err) {
          console.log("Ошибка!" + err);
          res.writeHead(500, { "Content-Type": "text/plain" });
          res.write("Ошибка!" + err);
          res.end();
        }
      }
    }
  })
  .listen(8080); //the server object listens on port 8080
