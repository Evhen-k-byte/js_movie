

(function () {

   'use strict'

   const API_KEY = '9eb126d',
      OMDb_REQ = 'http://www.omdbapi.com/?apikey=',
      DEBUG = true;

   let showFilm = document.getElementById('showFilm'),
      nameFilm = null,
      films = [],
      filmType = document.getElementById('select').value,
      namesFilm = [];



   showFilm.addEventListener('click', function () {
      nameFilm = document.getElementById('name-film').value;


      if (nameFilm) {
         films = nameFilm.split(', ');


         films.forEach((element) => {
            getFilmInfo(element).then(function (obj) {
               namesFilm.push(obj);
               console.log(namesFilm);
               printFilms();
            })
         });

      } else {
         alert('Введите хотябы одно название фильма');
      }



   });

   async function getFilmInfo(film) {
      const response = await fetch(`${OMDb_REQ}${API_KEY}&t=${film}&type=${filmType}`);
      let answer = await response.json();
      return answer;
   }

   function printFilms() {

      let ul = document.getElementById('ul'),
         li = document.createElement('li'),
         textNode = '';

      for (let i = 0; i < namesFilm.length; i++) {

         if (namesFilm[i].Title != undefined) {
            textNode = 'Название "' + namesFilm[i].Title + '" год выпуска: '
               + namesFilm[i].Year;

         } else {

            textNode = 'Название "' + films[i + 1] + '" не найдено';
         }
         li.innerHTML = textNode;
         ul.append(li);
      }

      namesFilm = [];
   }
})();