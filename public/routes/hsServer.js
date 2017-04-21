
var hsServer = [],
	nextId = 0;

exports.all = function(request, response) {
	console.log('bahahahha');

	response.writeHead(200, {'content-type': 'application/json'});
	response.end(JSON.stringify(hsServer));
};

exports.add = function(request, response) {
	console.log('add new person called');
	console.log('Name: ' + request.query.score);

	hsServer.push( {
		id : nextId,
		score : request.query.score
	});
	nextId++;

	response.writeHead(200);
	response.end();
};

exports.clear = function(request, response){
	hsServer.length = 0;
}
