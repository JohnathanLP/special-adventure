//------------------------------------------------------------------
//
// Make a request to the server to add a new person.
//
//------------------------------------------------------------------
function addScore(score) {
	//var name = $('#id-playerName').val();

	$.ajax({
		url: 'http://localhost:3000/v1/hsServer?score=' + score,
		type: 'POST',
		error: function() { alert('POST failed'); },
		success: function() {
			console.log('ADDING SUCCESS!');
			//showScores();
		}
	});
}

function clearScores(){
	$.ajax({
		url: 'http://localhost:3000/v1/hsServer',
		type: 'PUT',
		error: function() { alert('POST failed'); },
		success: function() {
			console.log('ADDING SUCCESS!');
			//showScores();
		}
	});
}


function showScores() {
	$.ajax({
		url: 'http://localhost:3000/v1/hsServer',
		cache: false,
		type: 'GET',
		error: function() { alert('GET failed'); },
		success: function(data) {
			var list = $('#id-people'),
				value,
				text;

			list.empty();
			for (value = 0; value < data.length; value++) {
				text = (data[value].score );
				list.append($('<li>', { text: text }));
			}
		}
	});
}
