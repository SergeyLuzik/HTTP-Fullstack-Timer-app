// ---- Загружаем текущее состояние и последние записи (todo реализовать из db.json достаем посление 10 записей или меньше)

let timeCardsList = document.querySelector(".time-cards-list");

const weekDays = {
  0: "ВС",
  1: "ПН",
  2: "ВТ",
  3: "СР",
  4: "ЧТ",
  5: "ПТ",
  6: "СБ",
};

const monthsList = {
  0: "ЯНВ",
  1: "ФЕВ",
  2: "МАР",
  3: "АПР",
  4: "МАЙ",
  5: "ИЮН",
  6: "ИЮЛ",
  7: "АВГ",
  8: "СЕН",
  9: "ОКТ",
  10: "НОЯ",
  11: "ДЕК",
};

function getMinutes(date) {
  return date.getMinutes().toString().padStart(2, "0");
}

fetch("/app/state")
  .then((response) => {
    return response.json();
  })
  .then((state) => {
    document.querySelector(".time-balance__value").textContent =
      state.timeBalance; // из db.json достаем и выводим баланс времени

    document
      .querySelector(".control-panel__btn-start-pause")
      .classList.add(state.startPauseButtonClass); // ставим клас start или pause для кнопки

    if (state.timeForcast.length > 0) {
      document.querySelector(".control-panel__time-forcast-value").textContent =
        state.timeForcast; // из db.json достаем и выводим прогноз окончания дня
    }
  })
  .catch((err) => {
    console.log("Запрос не выполнен!" + err);
  });

fetch("/app/timeCardTemplate.html")
  .then((response) => response.text())
  .then((data) => {
    // Создаем замыкание для данных из первого запроса
    const cardTemplate = data;

    fetch("/app/timeCards")
      .then((response) => response.json())
      .then((timeCards) => {
        for (const timeCard of timeCards) {
          // let timeCardsList = document.querySelector(".time-cards-list");
          let filledTimeCard = cardTemplate.replace(
            /\{\{(\w+)\}\}/g,
            (_, prop) => {
              return timeCard[prop] || "";
            },
          );
          timeCardsList.insertAdjacentHTML("beforeend", filledTimeCard);

          if (timeCard.breaks.length > 0) {
            // todo спросить у GPT эффективный алгоритм вставки перерывов
            let breaksTable = document.querySelector(
              ".time-card:last-child tbody",
            ); // todo используется многократно
            for (let i = 0; i < timeCard.breaks.length; i++) {
              if (i % 2 === 0) {
                breaksTable.append(document.createElement("tr"));
              }
              const breakStartEndTime = document.createElement("td");
              breakStartEndTime.textContent = `${timeCard.breaks[i].breakStartTime} - ${timeCard.breaks[i].breakEndTime}`;
              const totalBreakTime = document.createElement("td");
              totalBreakTime.textContent = timeCard.breaks[i].breakTimeTotal;

              breaksTable
                .querySelector("tr:last-child")
                .append(breakStartEndTime, totalBreakTime);
            }
          }
        }
      })
      .catch((err) => {
        console.log("Запрос не выполнен!" + err);
      });
  })
  .catch((err) => {
    console.log("Запрос не выполнен!" + err);
  });
// ---- ОБРАБОТЧИКИ СОБЫТИЙ
const startPauseButton = document.querySelector(
  ".control-panel__btn-start-pause",
);
const stopButton = document.querySelector(".control-panel__btn-stop");

startPauseButton.addEventListener("click", function () {
  if (startPauseButton.classList.contains("btn_start")) {
    // клик по кнопке СТАРТ
    startPauseButton.classList.replace("btn_start", "btn_pause"); // меняем класс btn_start на btn-pause

    let timeForcastField = document.querySelector(
      ".control-panel__time-forcast-value",
    );
    if (timeForcastField.textContent === "") {
      // если в timeForcast пусто это СТАРТ НОВОГО ДНЯ:

      // вставить новую карточку с днем с классом current-day в конец списка time-cards
      fetch("/app/emptyTimeCard.html")
        .then((response) => {
          return response.text();
        })
        .then((emptyTimeCard) => {
          timeCardsList.insertAdjacentHTML("beforeend", emptyTimeCard);
          const currentDayCard = document.querySelector(
            ".time-card:last-child",
          );

          const currentDate = new Date();

          const monthDay = `${currentDate.getDate()} ${
            monthsList[currentDate.getMonth()]
          }`;
          const weekDay = weekDays[currentDate.getDay()];
          //const hours = currentDate.getHours();
          const minutes = getMinutes(currentDate);
          const dayStartTime = `${currentDate.getHours()}:${minutes}`;
          const timeForcast = `${currentDate.getHours() + 8}:${minutes}`;

          currentDayCard.querySelector(
            ".day-block__month-day-value",
          ).textContent = monthDay;

          currentDayCard.querySelector(
            ".day-block__week-day-value",
          ).textContent = weekDay;

          //TODO как вычислять прошедшее время, если времена текстовые в коде и на сервере? Использовать тег time?

          currentDayCard.querySelector(
            ".day-timeline__start-time-value",
          ).textContent = dayStartTime;
          timeForcastField.textContent = timeForcast;

          fetch("/app/timeCards", {
            method: "POST",
            body: JSON.stringify({
              monthDay: monthDay,
              weekDay: weekDay,
              dayStartTime: dayStartTime,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((json) => console.log(json));

          fetch("/app/state", {
            method: "PATCH",
            body: JSON.stringify({
              timeForcast: timeForcast,
              startPauseButtonClass: "btn_pause",
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((response) => response.json())
            .then((json) => console.log(json));
        })
        .catch((err) => {
          console.log("Запрос не выполнен!" + err);
        });
    } else {
      //  КОНЕЦ ПЕРЕРЫВА:
      startPauseButton.classList.replace("btn_start", "btn_pause");

      const currentDate = new Date();
      // добавить время конца перерыва
      // расчитать продолжительность прерыва
      // добавить продолжительность перерыва
      // пересчитать прогноз конца дня
      // поменять значение прогноза в ячейке
      // отправить  все на сервер
    }
  } else {
    // НАЖАТИЕ НА ПАУЗУ -- НАЧАЛО ПЕРЕРЫВА
    startPauseButton.classList.replace("btn_pause", "btn_start");

    //const breaksTableRow = breaksTable.querySelector("tr:last-child");
    /* if (breaksTableRow === "null") {
      breaksTable.insertRow();
      breaksTableRow = breaksTable.querySelector("tr:last-child");
    }
  
    const breaksTableRow =
      breaksTable.rows.length > 0
        ? breaksTable.querySelector("tr:last-child")
        : breaksTable.insertRow(); // указывает всегда на last tr

    if (breaksTableRow.cells.length > 2) {
    }
*/ const breaksTable = document.querySelector(".time-card:last-child tbody");
    const currentDate = new Date();
    const minutes = getMinutes(currentDate);
    const breakStartTime = `${currentDate.getHours()}:${minutes}`;
    if (
      breaksTable.rows.length === 0 ||
      breaksTable.querySelector("tr:last-child").cells.length > 2
    ) {
      breaksTable.insertRow().insertCell().textContent = breakStartTime;
    } else {
      breaksTable.querySelector("tr:last-child").insertCell().textContent =
        breakStartTime;
    }
    // отправка на сервер
    fetch("/app/timeCards/breaks", {
      method: "POST",
      body: JSON.stringify({
        breakStartTime: breakStartTime,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }
});

stopButton.addEventListener("click", function () {
  //КОНЕЦ ДНЯ:
  // удалить текст в окне прогноза окончания дня
  // поставить время окончания дня
  // расчитать отработанное время за день
  // обновить баланс времени
  // убрать класс current-day с карточки дня
});

// https://thecode.media/xhr/
// https://thecode.media/save-json/

/*
Get a resource

fetch('/posts/1')
  .then(response => response.json())
  .then(json => console.log(json))
  
Create a resource

fetch('/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => console.log(json))
  
  Update a resource

fetch('/posts/1', {
    method: 'PUT',
    body: JSON.stringify({
      id: 1,
      title: 'foo',
      body: 'bar',
      userId: 1
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => console.log(json))
  
  fetch('/posts/1', {
    method: 'PATCH',
    body: JSON.stringify({
      title: 'foo'
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(response => response.json())
  .then(json => console.log(json))
  
  Filtering resources

Basic filtering is supported through query parameters.

// Will return all the posts that belong to the first user
fetch('/posts?userId=1')
  .then(response => response.json())
  .then(json => console.log(json))


*/
