// ---- Загружаем текущее состояние и последние записи (todo реализовать из db.json достаем посление 10 записей или меньше)

let timeCardsList = document.querySelector(".time-cards-list");

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
            }
          );
          timeCardsList.insertAdjacentHTML("beforeend", filledTimeCard);

          if (timeCard.breaks.length > 0) {
            // todo спросить у GPT эффективный алгоритм вставки перерывов
            let breaksTable = document.querySelector(
              ".time-card:last-child tbody"
            );
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

const startPauseButton = document.querySelector(
  ".control-panel__btn-start-pause"
);
const stopButton = document.querySelector(".control-panel__btn-stop");

startPauseButton.addEventListener("click", function () {
  if (startPauseButton.classList.contains("btn_start")) {
    // клик по кнопке СТАРТ
    startPauseButton.classList.replace("btn_start", "btn_pause"); // меняем класс btn_start на btn-pause
    let timeForcast = document.querySelector(
      ".control-panel__time-forcast-value"
    );
    if (timeForcast.textContent === "") {
      // если в timeForcast пусто
      // СТАРТ НОВОГО ДНЯ:
      //  let timeCardsList = document.querySelector(".time-cards-list"); // уже объявлена глобально в самом верху
      // вставить новую карточку с днем с классом current-day в конец списка time-cards
      timeCardsList.insertAdjacentHTML("beforeend", `тут должен быть шаблон`);

      //добавить время начала дня
      // расчитать прогноз времени конца дня
      document.querySelector(".control-panel__time-forcast-value").textContent =
        "16:00"; // установить прогноз в ячейку
      // отправить на сервер новую карточку с временем начала
      // обновить время прогноза
    } else {
      //  КОНЕЦ ПЕРЕРЫВА:
      // добавить время конца перерыва
      // расчитать продолжительность прерыва
      // добавить продолжительность перерыва
      // пересчитать прогноз конца дня
      // поменять значение прогноза в ячейке
    }
  } else {
    // НАЖАТИЕ НА ПАУЗУ -- НАЧАЛО ПЕРЕРЫВА
    startPauseButton.classList.replace("btn_pause", "btn_start"); // меняем класс btn_pause на btn-start
    // куда ставить данные? в левый или правый столбец таблицы, какой заполнен
    // залетаем в псоледний tr (т.к. следующий создаем только когда заполнен предыдущий)
    // если в tr уже есть 2 td, то один перерыв уже прошел (есть время перерыва)
    //
    // ставим начало паузы
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
