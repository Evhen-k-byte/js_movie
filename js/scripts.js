

(function () {

   'use strict'

   const API_KEY = '9eb126d',
      OMDb_REQ = 'https://www.omdbapi.com/?apikey=',
      IMG_WAY = 'img/404_error.jpg';

   let showFilm = document.getElementById('showFilm'),
      filmType = document.getElementById('select').value,
      nameFilm = null,
      namesFilm = [],
      page = '1',
      isFirstStart = true,
      ul = document.getElementById('ul');



   showFilm.addEventListener('click', function () {
      nameFilm = document.getElementById('name-film').value;

      if (nameFilm) {

         getFilmInfo(nameFilm, page).then(function (obj) {

            if (obj.Response != "False") {
               namesFilm.push(obj);
               printFilms();
               getDetails(obj);
               if (isFirstStart) getPagination(+obj.totalResults);
               getCurrentPage();
            } else {
               cleaning();
               isFirstStart = true;
               ul.textContent = `"${nameFilm}" не найдено!`;
            }
         });

      } else {
         alert('Введите хотябы одно название фильма');
      }

   });

   async function getFilmInfo(film, page) {
      const response = await fetch(`${OMDb_REQ}${API_KEY}&s=${film}&type=${filmType}&page=${page}`);
      let answer = await response.json();
      return answer;
   }

   async function getFilmExtraInfo(film) {
      const response = await fetch(`${OMDb_REQ}${API_KEY}&t=${film}&type=${filmType}`);
      let answer = await response.json();
      return answer;
   }

   function printFilms() {
      ul.innerHTML = '';

      let textNode = '',
         filmArray = namesFilm[0].Search;

      for (let i = 0; i < filmArray.length; i++) {

         if (filmArray[i].Title != undefined) {
            textNode = `Название "${filmArray[i].Title}"`;

            let li = document.createElement('li'),
               img = document.createElement('img'),
               paragraf = document.createElement('p'),
               details = document.createElement('button');

            if (filmArray[i].Poster != 'N/A') img.src = filmArray[i].Poster;
            else img.src = IMG_WAY;

            paragraf.classList = 'film-title';
            paragraf.innerHTML = textNode;
            details.classList = 'btn-details';
            details.innerHTML = 'details';

            li.appendChild(img);
            li.appendChild(details);
            li.appendChild(paragraf);
            ul.append(li);

         }

      }

      namesFilm = [];
   }

   function getPagination(totalResults) {

      if (totalResults > 10) {

         let pageWrap = document.querySelector('.page-wrap'),
            result = totalResults / 10;

         if (result > Math.trunc(result)) result = result + 1;

         for (let i = 1; i < result; i++) {
            let pages = document.createElement('button');
            pages.classList = 'page';

            pages.innerHTML = i;
            pageWrap.append(pages);
         }

         isFirstStart = false;
      }
   }

   function getCurrentPage() {
      let numOfPage = document.querySelectorAll('.page');

      numOfPage.forEach((element, index) => {

         element.addEventListener('click', () => {
            page = index + 1;
            showFilm.click();
         });
      });

   }

   function cleaning() {
      document.querySelector('.page-wrap').innerHTML = '';
      ul.innerHTML = '';
   }

   function getDetails(val) {
      let detailsBtns = document.querySelectorAll('.btn-details'),
         detailsForFilm = document.querySelectorAll('.film-title');

      if (val) {
         detailsBtns.forEach((element, index) => {
            element.addEventListener('click', () => {

               getFilmExtraInfo(val.Search[index].Title).then(function (obj) {

                  let detail = document.createElement('p');

                  detail.innerHTML = `
                  Актеры: ${obj.Actors}<br>
                 Рейтинг: ${obj.imdbRating}<br>
                Страна: ${obj.Country}<br>
                 Режисер: ${obj.Director}<br>
                 Длительность: ${obj.Runtime}<br>
                 Награды и номинации: ${obj.Awards}<br>
                  Год: ${obj.Year} <br>
                  Тип: ${obj.Type} <br>`;
                  detailsForFilm[index].append(detail);

               });

            });
         });
      }

   }

})();