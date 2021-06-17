window.onload = ()=> {
  const btn = document.querySelector('.submit');
  const input = document.querySelector('.search');
  const form = document.querySelector('form');
  const changeBtn = document.querySelector('.change');
  const main = document.querySelector('.container');

  form.addEventListener('submit', (e)=> { e.preventDefault() });
  changeBtn.addEventListener('click', changeTemp);

  function changeTemp(e) {
    const temp = document.querySelector('.temp');
    const temps = [temp, ...document.querySelectorAll('.small-text')];
    temps.forEach((temp)=> {
      const length = temp.textContent.length;
      let value = temp.textContent.substr(0, length - 2);
      let unit = temp.textContent.substr(length - 2);
      if(unit === '°C') value = Math.round((value * 9/5) + 32);
      else value = Math.round((value - 32) * 5/9);
      unit = (unit === '°C')? '°F': '°C';
      temp.textContent = value + unit;
    });
    e.target.textContent = (e.target.textContent === 'F°')? 'C°': 'F°';
  }

  btn.addEventListener('click', async()=> {
    const str = input.value;
    const loading = document.querySelector('.loading');
    try {
      loading.classList.remove('disabled');
      const data = await getData(str);
      changeBtn.textContent = 'F°';
      removeContent();
      putContent(data);
      loading.classList.add('disabled');
    } catch(err) {
      console.log(err);
      loading.classList.add('disabled');
    }

  });


  function putContent(data) {
    const card = createCard(data);
    const side = createRightContent(data);
    main.appendChild(card);
    main.appendChild(side);
  }

  function removeContent() {
    const children = [...main.children];
    children.forEach((child)=> {main.removeChild(child)});
  }

  async function getData(location = 'Rio de Janeiro') {
    const result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=0ac8d52bbe1ff4bd962edaad0dfc8ec6`,
    {
      mode: 'cors',
    });
    const data = await result.json();
    return data;
  }

  function createTempElement(text, value) {
    const smallBox = document.createElement('div');
    const p = document.createElement('p');
    const temp = document.createElement('p');
    
    smallBox.classList.add('small-box');
    p.classList.add('medium-text');
    temp.classList.add('small-text');

    p.textContent = text;
    temp.textContent = Math.round(value - 273.15) + '°C';

    smallBox.appendChild(p);
    smallBox.appendChild(temp);

    return smallBox
  }

  function createMainTemp(value, icon) {
    const smallBox = document.createElement('div');
    const temp = document.createElement('h3');
    const img = document.createElement('img');

    temp.classList.add('temp');
    smallBox.classList.add('small-box');
    
    img.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    temp.textContent = Math.round(value - 273.15) + '°C';

    smallBox.appendChild(temp);
    smallBox.appendChild(img);

    return smallBox;
  }

  function createRightContent(data) {
    const {main, wind, weather} = data;
    const side = document.createElement('div');
    const windSpeed = document.createElement('h3');
    const humidity = document.createElement('p');
    const desc = document.createElement('h4');

    side.classList.add('side');
    windSpeed.classList.add('wind');
    humidity.classList.add('humidity');
    desc.classList.add('desc');

    desc.textContent = 'Today: ' + weather[0].description + '.';
    windSpeed.textContent = 'Wind Speed: ' + wind.speed + ' m/s';
    humidity.textContent = 'Humidity: ' + main.humidity + '%';

    side.appendChild(desc);
    side.appendChild(windSpeed);
    side.appendChild(humidity);

    return side;
  }

  function createCard(data) {
    const {main, name, weather} = data;
    const icon = weather[0].icon;
    const card = document.createElement('div');
    const h2 = document.createElement('h2');
    const day = document.createElement('h3');
    const tempBox = document.createElement('div');

    card.classList.add('card');

    h2.classList.add('name');
    day.classList.add('day');
    tempBox.classList.add('temp-box');

    h2.textContent = name;
    day.textContent = weather[0].main;

    const temp = createMainTemp(main.temp, icon);
    const max = createTempElement('max', main.temp_max);
    const min = createTempElement('min', main.temp_min);
    const feels = createTempElement('feels like', main.feels_like);
    tempBox.appendChild(max);
    tempBox.appendChild(feels);
    tempBox.appendChild(min);

    card.appendChild(h2);
    card.appendChild(day);
    card.appendChild(temp);
    // card.appendChild(desc);
    card.appendChild(tempBox);

    return card;
  }

  async function init() {
    const data = await getData();
    putContent(data);
  }

  init();
}
