const { log } = require("console");
const http = require("http");
const fs = require("fs").promises;

function getCurrentRuTime() {
  return new Date().toLocaleTimeString("ru-RU", {
    timeZone: "Europe/Moscow",
    hour12: false,
  });
}

function logFileChange(reqType, fileName, massage, data) {
  console.log(" ");
  console.log(getCurrentRuTime());
  console.log("-------------------------");
  console.log(`---- ${reqType} запрос`);
  console.log(`---- ${massage} ${fileName}`);
  console.log(data);
  console.log("-------------------------");
  console.log(" ");
}

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
            fs.readFile("./app/app.html").then((contents) => {
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
            fs.readFile("./app/styles.css").then((contents) => {
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
            fs.readFile("./app/app.js").then((contents) => {
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
            fs.readFile("./app/svg/play.svg").then((contents) => {
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
            fs.readFile("./app/svg/pause.svg").then((contents) => {
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
            fs.readFile("./app/favicon.ico").then((contents) => {
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

        case "/app/timeCardTemplate.html":
          try {
            fs.readFile("./app/timeCardTemplate.html").then((contents) => {
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

        case "/app/emptyTimeCard.html":
          try {
            fs.readFile("./app/emptyTimeCard.html").then((contents) => {
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

        // ---------- ОБРАБОТЧИКИ
        case "/app/state":
          try {
            fs.readFile("./state.json").then((contents) => {
              logFileChange(
                "GET",
                "state.json",
                "СОДЕРЖИМОЕ ФАЙЛА",
                contents.toString(),
              );
              //const stateData = JSON.parse(contents);

              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(contents /*JSON.stringify(stateData)*/);
              res.end();
            });
          } catch (err) {
            console.log("Ошибка!" + err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.write("Ошибка!" + err);
            res.end();
          }
          break;

        case "/app/timeCards":
          try {
            fs.readFile("./timeCards.json").then((contents) => {
              logFileChange(
                "GET",
                "timeCards.json",
                "СОДЕРЖИМОЕ ФАЙЛА",
                contents.toString(),
              );
              //const data = JSON.parse(contents);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.write(contents /*JSON.stringify(data.timeCards)*/);
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
              fs.readFile("./timeCards.json").then((contents) => {
                logFileChange(
                  "POST",
                  "timeCards.json",
                  "СОДЕРЖИМОЕ ФАЙЛА",
                  contents.toString(),
                );

                const data = JSON.parse(contents);
                data.timeCards.push(JSON.parse(body));
                logFileChange(
                  "POST",
                  "timeCards.json",
                  "ЗАПИСЬ В ФАЙЛ",
                  JSON.stringify(data),
                );

                fs.writeFile("./timeCards.json", JSON.stringify(data));

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
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
              fs.readFile("./timeCards.json").then((contents) => {
                logFileChange(
                  "POST",
                  "timeCards.json",
                  "СОДЕРЖИМОЕ ФАЙЛА",
                  contents.toString(),
                );
                const data = JSON.parse(contents);

                let lastTimeCard = data.timeCards[data.timeCards.length - 1];
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
                logFileChange(
                  "POST",
                  "timeCards.json",
                  "ЗАПИСЬ В ФАЙЛ",
                  JSON.stringify(data),
                );
                fs.writeFile("./timeCards.json", JSON.stringify(data));

                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify(data));
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
                fs.readFile("./state.json").then((contents) => {
                  logFileChange(
                    "PATCH",
                    "state.json",
                    "СОДЕРЖИМОЕ ФАЙЛА",
                    contents.toString(),
                  );
                  const stateData = JSON.parse(contents);
                  const bodyObj = JSON.parse(body);

                  for (const key in bodyObj) {
                    stateData[key] = bodyObj[key];
                  }

                  logFileChange(
                    "PATCH",
                    "state.json",
                    "ЗАПИСЬ В ФАЙЛ",
                    JSON.stringify(stateData),
                  );
                  fs.writeFile("./state.json", JSON.stringify(stateData));

                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.write(JSON.stringify(stateData));
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
