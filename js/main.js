const API__KEY = `5c99d5db686e3e394aae68917e6d7b16`;

const Input = document.querySelector("[Input]");
const Search__Btn = document.querySelector("[Search__Btn]");
const Result__Wrapper = document.querySelector("[Result__Wrapper]");

const Converting__Letters = {
  ა: "a",
  ბ: "b",
  გ: "g",
  დ: "d",
  ე: "e",
  ვ: "v",
  ზ: "z",
  თ: "t",
  ი: "i",
  კ: "k",
  ლ: "l",
  მ: "m",
  ნ: "n",
  ო: "o",
  პ: "p",
  ჟ: "zh",
  რ: "r",
  ს: "s",
  ტ: "t",
  უ: "u",
  ფ: "p",
  ქ: "k",
  ღ: "gh",
  ყ: "k",
  შ: "sh",
  ჩ: "ch",
  ც: "ts",
  ძ: "dz",
  წ: "ts",
  ჭ: "ch",
  ხ: "kh",
  ჯ: "j",
  ჰ: "h",
};

let Get__Weather = () => {
  let City__Name = Input.value;

  let Letters = "";

  for (const i of City__Name) {
    if (Object.keys(Converting__Letters).includes(i)) {
      Letters += Converting__Letters[i];
    } else {
      Letters = City__Name;
    }
  }

  if (City__Name.trim() == "") {
    Result__Wrapper.innerHTML = `<h3 class="Massage">Please enter a city name</h3>`;
  } else {
    const API__Link = `https://api.openweathermap.org/data/2.5/weather?q=${Letters}&appid=${API__KEY}&units=metric`;
    Input.value = "";

    fetch(API__Link)
      .then((Response) => Response.json())
      .then((Data) => {

        document.body.style.backgroundImage = `url(./Image/${Data.weather[0].main}.gif)`;
        document.querySelector("title").textContent = `Weather | ${Data.name}`;

        Result__Wrapper.innerHTML = `
        <h2>${Data.name}</h2>
        <h4 class="weather">${Data.weather[0].main}</h4>
        <h4 class="desc">${Data.weather[0].description}</h4>
        <h1>${Data.main.temp}℃</h1>
        <div class="Temp__Container">
            <div>
                <h4 class="Title">min</h4>
                <h4 class="Temp">${Data.main.temp_min}℃</h4>
            </div>
            <div>
                <h4 class="Title">max</h4>
                <h4 class="Temp">${Data.main.temp_max}℃</h4>
            </div>
        </div>
        `;
      }).catch(() => {
        Result__Wrapper.innerHTML = `<h3 class="Massage">City not found</h3>`;
      });
  }
};

Search__Btn.addEventListener("click", Get__Weather);
window.addEventListener("load", Get__Weather);