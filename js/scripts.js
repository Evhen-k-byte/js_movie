

(function () {

   'use strict'

   const API_KEY = '9eb126d',
      OMDb_REQ = 'https://www.omdbapi.com/?apikey=',
      IMG_WAY = 'img/404_error.jpg';

   let showFilm = document.getElementById('showFilm'),
      filmType = null,
      nameFilm = null,
      namesFilm = [],
      page = '1',
      isFirstStart = true,
      ul = document.getElementById('ul'),
      favorite = document.getElementById('favorite'),
      storage = [];

   useInformFromLocStorage();

   showFilm.addEventListener('click', function () {
      nameFilm = document.getElementById('name-film').value;
      filmType = document.getElementById('select').value;

      if (nameFilm) {

         getFilmInfo(nameFilm.trim(), page).then(function (obj) {

            if (obj.Response != "False") {
               namesFilm.push(obj);
               printFilms(ul);
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

   async function getFilmExtraInfo(film, isFav) {
      let response = null;
      if (isFav) response = await fetch(`${OMDb_REQ}${API_KEY}&i=${film}`);
      else response = await fetch(`${OMDb_REQ}${API_KEY}&i=${film}`);
      // console.log(response);
      let answer = await response.json();
      return answer;
   }

   function printFilms(tag, isFavorite, favArr) {

      let filmArray = [],
         textNode = '';
      tag.innerHTML = '';

      if (isFavorite) filmArray = favArr;
      else filmArray = namesFilm[0].Search;

      for (let i = 0; i < filmArray.length; i++) {

         if (filmArray[i].Title != undefined) {
            textNode = `Название "${filmArray[i].Title}"`;

            let li = document.createElement('li'),
               img = document.createElement('img'),
               paragraf = document.createElement('p'),
               details = null;

            if (!isFavorite) details = document.createElement('button');

            if (filmArray[i].Poster != 'N/A') img.src = filmArray[i].Poster;
            else img.src = IMG_WAY;

            if (!isFavorite) paragraf.classList = 'film-title';
            paragraf.innerHTML = textNode;
            if (!isFavorite) details.classList = 'btn-details';
            if (!isFavorite) details.innerHTML = 'details';

            li.appendChild(img);
            if (!isFavorite) li.appendChild(details);
            li.appendChild(paragraf);
            tag.append(li);

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

               if (!detailsForFilm[index].querySelector('.details')) {
                  getFilmExtraInfo(val.Search[index].imdbID, false).then(function (obj) {

                     // console.log(obj);

                     let detail = document.createElement('p');
                     detail.classList = 'details';

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

                     setFavoriteMovies(obj.imdbID);
                  });
               }

            });
         });
      }

   }

   function setFavoriteMovies(name) {


      for (let i = 0; i < localStorage.length; i++) {
         storage[i] = localStorage[i];

      }


      let n = 10;

      if (storage.length < n + 1) {
         storage.unshift(name);
      } else if (storage.length > n) {
         storage.splice(0, 1);
         storage.unshift(name);
      }

      storage.forEach((el, i) => {
         if (localStorage.getItem(i) != el) {
            localStorage.setItem(el, el);
         }
      });

   }

   function useInformFromLocStorage() {
      let buffer = [],
         favWrap = document.querySelector('.fav-wrap');


      if (localStorage.length > 0) {
         favWrap.classList.add('block');



         for (let i = 0; i < localStorage.length; i++) {
            getFilmExtraInfo(localStorage.key(i), true).then(function (obj) {
               buffer.push(obj);
               printFilms(favorite, true, buffer);
            });

         }
      }
   }

})();


