var musicApp = {};

var $randoGenresSpan = $('.randoGenres span');

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

musicApp.apiKey = '7YUKSZXJZSPU0KXPU';
musicApp.genreQuantity = 0;
musicApp.genreList = '';
musicApp.allGenres = 'http://developer.echonest.com/api/v4/genre/list?api_key=7YUKSZXJZSPU0KXPU&format=json&results=9999';
musicApp.findSimilarDescription = 'http://developer.echonest.com/api/v4/genre/similar?api_key=7YUKSZXJZSPU0KXPU&bucket=description&name=';
musicApp.genreNames = [];
musicApp.autoFill = [];
musicApp.userInput = '';
musicApp.findArtists = 'http://developer.echonest.com/api/v4/genre/artists?api_key=7YUKSZXJZSPU0KXPU&format=json&results=14&bucket=hotttnesss&name=';
musicApp.findArtistsDiscover = 'http://developer.echonest.com/api/v4/genre/artists?api_key=7YUKSZXJZSPU0KXPU&format=json&results=14&bucket=discovery_rank&name=';
musicApp.similarArtists = 'http://developer.echonest.com/api/v4/artist/similar?api_key=7YUKSZXJZSPU0KXPU&format=json&results=30&start=0&name=';
musicApp.last = 'http://www.last.fm/music/';


musicApp.genreCount = function(){
	$.ajax({
				url: musicApp.allGenres,
				type: 'GET',
				dataType: 'json'
			}).then(function(res) {
		
//counts the number of genres in API, and pass the total number to musicApp.genreQuantity		
		
				$('.genreCount span').text(res.response.total);
		musicApp.genreQuantity = res.response.total;
		
//adds the entire list of genres to musicApp.genreList, first converting from array to object
		
				musicApp.genreList = res.response.genres;
		
				for (var x = 0; x < musicApp.genreList.length; x++) {
					musicApp.genreNames.push( musicApp.genreList[x].name );
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
	
	$randoGenresSpan.text('');
			
	for (var i = 0; i < 6; i++){
		var randoGenre = random(1384,1);
		
		if (i === 5) {
			$randoGenresSpan.append( ' and ' + musicApp.genreNames[randoGenre] );
		} else {
		$randoGenresSpan.append( musicApp.genreNames[randoGenre] + ', ' );	
		}
	}
};

//submit form searching from genre

musicApp.formSubmitGenre = function(){
	$('#searchGenre').on('submit', function(e){
		e.preventDefault();
		$('#resultContainer').empty();
		$('#similar').empty();
		var genreName = $('#searchInput').val().toLowerCase();
		
//		make sure serach isn't empty
		if (genreName === ''){
			$( '#resultContainer' ).html( '<h3 class="error"> Please enter a genre! </h3>' )
		}else{
		$('#searchInput').val('');
			
//	remove spaces for search string
		
	musicApp.userInput = genreName.split(' ').join('+');
	musicApp.query( musicApp.findSimilarDescription, musicApp.userInput );}
	});
	
};

//submit form searching from artist

musicApp.formSubmitArtist = function(){
	$('#searchArtist').on('submit', function(e){
		e.preventDefault();
		$('#resultContainer').empty();
		$('#similar').empty();
		var artistName = $('#searchInputArtist').val().toLowerCase();
		
//		make sure serach isn't empty
		if (artistName === ''){
			$( '#resultContainer' ).html( '<h3 class="error"> Please enter an artist! </h3>' )
		}else{
		$('#searchInputArtist').val('');
			
//	remove spaces for search string
		musicApp.userInput = artistName.split(' ').join('+');
		musicApp.queryArtists( musicApp.findSimilarArtists, musicApp.userInput );
		console.log('artistquery');
		}
	});
	
};

//queries the api, returns specified results (similar genres, etc.)

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

//queries the api, returns specified results (similar genres, etc.)

musicApp.queryArtists = function(queryType, artist){
	$.ajax({
		url: queryType+artist,
		method: 'GET',
		dataType: 'json'
		}).then(function(res) {
			console.log(res);
			musicApp.displayResults(res.response.genres);
		
//		check if results are 0, apologize! also remove any '+' from search string
		
		if (res.response.total === 0){
			$('#resultContainer').html("<h3>sorry, there's nothing quite like " + genre.split('+').join(' ') + "!<h3/>");
			console.log('0');
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

//query similar artists bases on artist

musicApp.queryArtistsFromArtist = function(queryType, artist){
	$.ajax({
		url: queryType+artist,
		method: 'GET',
		dataType: 'json'
		}).then(function(res) {
		console.log(res);
			musicApp.artistList = res.response.artists.name;
		console.log('artistfromartist');
		
//		append artists as li's in artistList ul
		
		$.each(res.response.artists, function(i, value) {
			
//			create url for each artist
			
			var artistLink = musicApp.last + value.name.split(' ').join('+');
			var artistList = $('<li>').append('<a target="_blank" href=' + artistLink + '>' + value.name + '</a>');
			$('ul[data-artist="' + artist.split(' ').join('+') + '"]').append(artistList);
		});
		
	});
};

//display all genre-searched results
//first genre with descriptions, then related artists with clickable links to last.fm page

musicApp.displayResults = function(genres){
	$('#similar').text( 'similar to ' + musicApp.userInput.split('+').join(' ') + '...');
	

	$.each(genres, function(i, value){
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
		var resultCombo = $('<div>').addClass('result').append(genre, genreDescription);
		
		$('#resultContainer').append(resultCombo).append(artistsBelow).append(artistUL);
	});
};

//display all artist-searched results

musicApp.displayResultsFromArtists = function(artist){
	$('#similar').text( 'similar to ' + musicApp.userInput.split('+').join(' ') + '...');
	console.log('disp');

	$.each(genres, function(i, value){
		var artist = $('<h3>').addClass('genreResult').text( value.name );
		var artistDescription = $('<p>').addClass('genreDescription').text( value.description );
		var artistsBelow = $('<p>').addClass('artistsBelow').text('artists:');
		var artistUL = $('<ul>').addClass('artistUL').attr('data-genre', value.name.split(' ').join('+'));
//		pass each genre to the queryArtist function and return results
		
		musicApp.queryArtistsFromArtist( musicApp.similarArtists, value.name);
		

//		check if description of genre is empty, say sorry!
		
		if (value.description === ''){
			artistDescription = $('<p>').addClass('artistDescription').text( 'Sorry! There is no description on the server.' );
		};
		var resultCombo = $('<div>').addClass('result').append(artist, artistDescription);
		
		$('#resultContainer').append(resultCombo).append(artistsBelow).append(artistUL);
	});
};

musicApp.displayResultsArtists = function(artist){
	$('#similar').text( 'similar to ' + musicApp.userInput.split('+').join(' ') + '...');
	

	$.each(genres, function(i, value){
		var genre = $('<h3>').addClass('genreResult').text( value.name );
		var artistDescription = $('<p>').addClass('artistDescription').text( value.description );
		var artistsBelow = $('<p>').addClass('artistsBelow').text('artists:');
		var artistUL = $('<ul>').addClass('artistUL').attr('data-genre', value.name.split(' ').join('+'));
		
//		pass each genre to the queryArtist function and return results
		
		musicApp.queryArtistsFromGenres( musicApp.findArtists, value.name);
		

//		check if description of genre is empty, say sorry!
		
		if (value.description === ''){
			genreDescription = $('<p>').addClass('genreDescription').text( 'Sorry! There is no description on the server.' );
		};
		var resultCombo = $('<div>').addClass('result').append(genre, genreDescription);
		
		$('#resultContainer').append(resultCombo).append(artistsBelow).append(artistUL);
	});
};

musicApp.go = function(){

	musicApp.genreCount();
	musicApp.formSubmitGenre();
	musicApp.formSubmitArtist();

};


	$(document).ready(function() {
	
		musicApp.go();
});