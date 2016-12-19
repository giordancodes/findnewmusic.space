var musicApp = {};

var $randoGenresSpan = $('.randoGenres');

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

musicApp.apiKey = 'BQB523xdiiQSBHYoRVuMsKKfid5KZ_5H-U6yLV2kL59OtY25lQrjyaYpurKHlwHNhS2FQqoc9VCWfICn6-HafW6hI_rNwuXaGsZQhRumbiCuTFk_Ipvb10elzByZCaPXRV1eVR6f';
musicApp.genreQuantity = 0;
musicApp.genreList = '';
musicApp.allGenres = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
musicApp.findSimilarDescription = 'http://developer.echonest.com/api/v4/genre/similar?api_key=7YUKSZXJZSPU0KXPU&bucket=description&name=';
musicApp.genreNames = [];
musicApp.autoFill = [];
musicApp.userInput = '';
musicApp.findArtists = 'http://developer.echonest.com/api/v4/genre/artists?api_key=7YUKSZXJZSPU0KXPU&format=json&results=14&bucket=hotttnesss&name=';
musicApp.findArtistsDiscover = 'http://developer.echonest.com/api/v4/genre/artists?api_key=7YUKSZXJZSPU0KXPU&format=json&results=14&bucket=discovery_rank&name=';
// musicApp.findSimilarArtists = 'http://developer.echonest.com/api/v4/artist/similar?api_key=7YUKSZXJZSPU0KXPU&format=json&results=30&start=0&name=';
musicApp.last = 'http://www.last.fm/music/';

musicApp.genreCount = function(){
	$.ajax({
				url: musicApp.allGenres,
				type: 'GET',
				dataType: 'json',
				beforeSend: function(xhr, settings) { xhr.setRequestHeader('Authorization','Bearer ' + musicApp.apiKey); }
			})
	.then(function(res) {
		
//counts the number of genres in API, and pass the total number to musicApp.genreQuantity		
		$('.genreCount span').text(res.genres.length);
		musicApp.genreQuantity = res.genres.length;
		
//adds the entire list of genres to musicApp.genreList, first converting from array to object	
		musicApp.genreList = res.genres;
		// console.log(musicApp.genreList);
		for (var x = 0; x < musicApp.genreList.length; x++) {
			musicApp.genreNames.push( musicApp.genreList[x] );
		}
		
//		fill random genres on page
			musicApp.sampleGenres();

//		add all genres to autoFill
			musicApp.autoFill = musicApp.genreNames;
			$('#searchInput').autocomplete({
				source: musicApp.genreNames,
				select: function(event, ui){
					$(event.target).val(ui.item.value);
					$('#searchInput').submit();
					return false;
				},
				minLength: 1
			});
		});
};

//populate some random genres on page, allowing user to click on any one and find similar genres. user will also be able to input their own genres for showing results

musicApp.sampleGenres = function(){

	var randSeed = musicApp.genreList.length - 4;
	$randoGenresSpan.text('');
			
	for (var i = 0; i < 4; i++){
		var randoGenre = random(randSeed,1);
		
		if (i === 3) {
			$randoGenresSpan.append( ' and ' + musicApp.genreNames[randoGenre] );
		} else {
			$randoGenresSpan.append( musicApp.genreNames[randoGenre] + ', ' );	
		}

		musicApp.genreList.slice[randSeed];

	}
};

//submit form searching from genre

musicApp.formSubmitGenre = function(){
	$('#searchGenre').on('submit', function(e){
		e.preventDefault();
		$('#resultContainer').empty();
		$('#similar').empty();
		var genreName = $('#searchInput').val().toLowerCase();
		
//		make sure search isn't empty
		if (genreName === ''){
			$( '#errors' ).html( '<h4 class="error"> Please enter a genre! </h4>' )
		} else {
			$('#searchInput').val('');
			
//	remove spaces for search string
		
	musicApp.userInput = genreName.split(' ').join('+');
	musicApp.query( musicApp.findSimilarDescription, musicApp.userInput );}
	});
	
};

//submit form searching from artist


musicApp.findArtistID = function(){

	$('#searchArtist').on('submit', function(e){
		e.preventDefault();
		$('#resultContainer').empty();
		$('#similar').empty();
		musicApp.userQuery = $('#searchInputArtist').val();
		var artistName = $('#searchInputArtist').val().toLowerCase();
			
	//		make sure search isn't empty
		if (artistName === ''){
			$( '#errors' ).html( '<h4 class="error"> Please enter an artist! </h4>' )
		} else {
			$('#searchInputArtist').val('');
		}
		$.ajax({
			url: 'https://api.spotify.com/v1/search?q=' + artistName + '&type=artist',
			method: 'GET',
			dataType: 'json'
		  })
		.then(function(res) {
			musicApp.artistID = res.artists.items[0].id;
			musicApp.queryArtists( musicApp.artistID );
			})
		.catch(function(err) {
			$( '#errors' ).html( '<h4 class="error"> Sorry, ' + musicApp.userQuery + ' returned no results.</h4>' )
			console.log("error: " + err);
		});
	})

		// musicApp.queryArtists( musicApp.findSimilarArtists, musicApp.artistID );
		

};

musicApp.formSubmitArtist = function(){
	$('#searchArtist').on('submit', function(e){
		e.preventDefault();
		$('#resultContainer').empty();
		$('#similar').empty();
		var artistName = $('#searchInputArtist').val().toLowerCase();
		
//		make sure serach isn't empty
		if (artistName === ''){
			$( '#errors' ).html( '<h4 class="error"> Please enter an artist! </h4>' )
		} else {
			$('#searchInputArtist').val('');		
//	remove spaces for search string
		// musicApp.userInput = artistName.split(' ').join('+');
		}
	});
};

//queries the api, returns specified results from artist(similar artists)

musicApp.queryArtists = function(queryType, artist){
	$.ajax({
		url: "https://api.spotify.com/v1/artists/" + musicApp.artistID + "/related-artists",
		method: 'GET',
		dataType: 'json'
		}).then(function(res) {
//		verify input is an artist in the api
		musicApp.displayResultsFromArtists(res.artists);
			// if(res.response.status.message === 'The Identifier specified does not exist: ' + artist){
			// 	$('#resultContainer').html("<h3>sorry, " + artist + " doesn't show in the database!<h3/>");
			// } else {
			// 	musicApp.displayResultsFromArtists(res.artists);
			// }
	});
};

//queries the api, returns specified results from genre(similar genres & artists)

musicApp.query = function(queryType, genre){
	$.ajax({
		url: queryType+genre,
		method: 'GET',
		dataType: 'json'
		}).then(function(res) {
			musicApp.displayResults(res.response.genres);
		
//		check if results are 0, apologize! also remove any '+' from search string
		
		if (res.response.total === 0){
			$('#resultContainer').html("<h3>sorry, there's nothing quite like " + genre.split('+').join(' ') + "!<h3/>");
		}
	});
};


//query hottttttt artists bases on genre

musicApp.queryArtistsFromGenres = function(queryType, genre){
	$.ajax({
		url: queryType+genre,
		method: 'GET',
		dataType: 'json'
		}).then(function(res) {
			musicApp.artistList = res.response.artists;
//		append artists as li's in artistList ul
		
		$.each(res.response.artists, function(i, value) {
			
//			create url for each artist
			
			var artistLink = musicApp.last + value.name.split(' ').join('+');
			var artistList = $('<li>').append('<a target="_blank" href=' + artistLink + '>' + value.name + '</a>');
			$('ul[data-genre="' + genre.split(' ').join('+') + '"]').append(artistList);
		});

	});
};

//display all genre-searched results
//first genre with descriptions, then related artists with clickable links to last.fm page

musicApp.displayResults = function(genres){
	$('#similar').text( 'similar to ' + musicApp.userInput.split('+').join(' ') + '...');
	

	$.each(genres, function(i, value){
		var icon = $( '<img src="/assets/heart.svg">' );
		var genre = $('<h3>').addClass('genreResult').text( value.name );
		var genreDescription = $('<p>').addClass('genreDescription').text( value.description );
		var artistsBelow = $('<p>').addClass('artistsBelow').text('artists:');
		var artistUL = $('<ul>').addClass('artistUL').attr('data-genre', value.name.split(' ').join('+'));
//		pass each genre to the queryArtist function and return results
		
		musicApp.queryArtistsFromGenres( musicApp.findArtists, value.name);
		

//		check if description of genre is empty, say sorry!
		
		if (value.description === ''){
			genreDescription = $('<p>').addClass('genreDescription').text( 'Sorry! There is no description on the server.' );
		};
		var resultCombo = $('<div>').addClass('result').append(icon, genre, genreDescription);
		var resultParent = $( '<div>' ).addClass('resultParent').append(resultCombo).append(artistsBelow).append(artistUL);
	
//		show results, clear potential error msgs, scroll to results
		$( '#resultContainer' ).append(resultParent);
		$( '#errors' ).empty();	
	});
	
//	scroll to results
		$( '.similarDiv' ).focus();
		$('body,html').animate({scrollTop: $( '.similarDiv' ).offset().top});
		$( '#searchAgain' ).removeClass('hide');

};

//display all artist-searched results

musicApp.displayResultsFromArtists = function(artist){
	$('#similar').text( 'similar to ' + musicApp.userQuery + '...');

	$.each(artist, function(i, value){
		var artist = $('<h3>').addClass('artistResult').html("<img src='/assets/heart.svg' alt='heart icon'><a target='_blank' href='" + musicApp.last + value.name + "'>" + value.name + "</a>");
		var artistUL = $('<ul>').addClass('artistUL').attr('data-artist', value.name.split(' ').join('+'));
//		pass each genre to the queryArtist function and return results

//		check if description of genre is empty, say sorry!
		
		if (value.description === ''){
			artistDescription = $('<p>').addClass('artistDescription').text( 'Sorry! There is no description on the server.' );
		};
		var resultCombo = $('<div>').addClass('resultFromArtist').append(artist);
		
		//		show results, clear potential error msgs

		$( '#resultContainer' ).append(resultCombo);
		$( '#errors' ).empty();
	});
	
//	scroll to results
	$( '.similarDiv' ).focus();
	$('body,html').animate({scrollTop: $( '.similarDiv' ).offset().top});
	$( '#searchAgain' ).removeClass('hide');
};

musicApp.go = function(){
	
	musicApp.findArtistID();
	musicApp.genreCount();
	musicApp.formSubmitGenre();
	musicApp.formSubmitArtist();
	
};


	$(document).ready(function() {
	
		musicApp.go();
});