

(function () {

   'use strict'

   let titleFilm = '';

   const API_KEY = '9eb126d',
      OMDb_REQ = 'http://www.omdbapi.com/?apikey=',
      G_TRANSLATER_STRT = 'http://translate.google.ru/translate_a/t?client=x&text=',
      G_TRANSLATER_ND = '&hl=en&sl=en&tl=ru',
      DEBUG = true;

   let showFilm = document.getElementById('showFilm'),
      nameFilm = '';

   showFilm.addEventListener('click', function () {
      nameFilm = document.getElementById('name-film').value;

      async function translate() {
         const response = await fetch(`${G_TRANSLATER_STRT}${nameFilm}${G_TRANSLATER_ND}`);
         const translated = await response.json();
         return translated;
      }

      async function getFilmInfo() {
         const response = await fetch(`${OMDb_REQ}${API_KEY}&t=${nameFilm}`);

         console.log(response);
         const filmInfo = await response.json();
         return filmInfo;
      }


      if (nameFilm) {
         translate();
         // .then(translated => console.log(translated));
      }

      if (DEBUG) {
         console.log(nameFilm);
      }
   });
})()