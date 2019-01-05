

// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto

var paesiSupportati = ["it", "en"];

$(document).ready(function () {

  $('.button_search').click(function () {

    var ricercaFilm = $('.ricerca_film').val();

    if (ricercaFilm != '') {
      $.ajax({

        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
          api_key: '62b91fb525e60e8dff31c3635e14ed75',
          query: ricercaFilm,
        },
        success: function(apiResponse) {

          for (var i = 0; i < apiResponse.results.length; i++) {
            produciHtmlPer(apiResponse.results[i]);
          }

          $.ajax({

            url: 'https://api.themoviedb.org/3/search/tv',
            method: 'GET',
            data: {
              api_key: '62b91fb525e60e8dff31c3635e14ed75',
              language: 'it',
              query: ricercaFilm,
            },
            success: function(apiResponse) {

              for (var i = 0; i < apiResponse.results.length; i++) {
                console.log(apiResponse.results[i]);
                var contenutoCorrente = apiResponse.results[i];
                contenutoCorrente.title = contenutoCorrente.name;
                contenutoCorrente.original_title = contenutoCorrente.original_name;
                produciHtmlPer(apiResponse.results[i]);
              }

            },
            error: function(error) {
              console.log(error);
            }
          });

        },
        error: function(error) {
          console.log(error);
        }
      });
    }


  });

});

function produciHtmlPer(contenuto) {

  var voto = Math.ceil(contenuto.vote_average / 2);

  var source   = $('#risultatoTemplate').html();
  var template = Handlebars.compile(source);
  var urlPoster = 'https://image.tmdb.org/t/p/w185/' + contenuto.poster_path;
  var data = {
    titolo: contenuto.title,
    titoloOriginale: contenuto.original_title,
    lingua: gestisciLingua(contenuto.original_language),
    descrizione: contenuto.overview,
    voto: gestisciVoto(voto),
    poster: urlPoster
  };

  var html = template(data);

  $('#risultati').append(html);
}

function gestisciLingua(lingua) {
    var htmlOutput = '';

    if (paesiSupportati.includes(lingua)) {
      console.log(lingua + ' lingua supportata');
      htmlOutput = "<img class='bandiera' src='" + lingua + ".png' />";
    } else {
      htmlOutput = lingua + ' non supportata';
    }

    return htmlOutput;

}

function gestisciVoto(voto) {
  var htmlOutput = '';

  for (var i = 1; i <= 5; i++) {
    if (i <= voto){
      htmlOutput += "<i class='fas fa-star'></i>";
    } else {
      htmlOutput += "<i class='far fa-star'></i>";
    }
  }

  return htmlOutput;
}
