

let standingTable = null;
let currentuser = "nouser";

async function init() {
	
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
    };
	
	const nextmatches = await fetch('/nextmatches', options);
	const nextmatches_json = await nextmatches.json();
	
	const pastmatches = await fetch('/pastmatches', options);
    const pastmatches_json = await pastmatches.json();
	
	console.log(pastmatches_json);
	
	return { "pastmatches" : pastmatches_json, "nextmatches" : nextmatches_json };

}



async function Risultati(e){
	const options = {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
    };

	//await fetch('/scriptInsertTable', options);
	const server_response = await fetch('/calcolagiornata', options);
    const classificajson = await server_response.json();
	
	console.log(classificajson);
	
	if(!standingTable) {
		standingTable = $("#standings").DataTable({
			data:classificajson.standings,
			columns: [
				{ "title": "Pos", "data": "pos" },
				{ "title": "Squadra", "data": "team" },
				{ "title": "Presidente", "data": "pres" },
				{ "title": "Punti", "data": "points" }
				],
			searching: false,
			paging: false,
			columnDefs: [ 
				{ sortable: false , "class": "index", targets: 0 },
				{ sortable: false, targets: 1 },
				{ sortable: false, targets: 2 }
				],
			order: [[ 3, 'desc' ]], //Ordinamento iniziale su colonna punti decrescente
			
		});
	
		standingTable.on( 'order.dt search.dt', function () {
			standingTable.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {cell.innerHTML =  i + 1} );

		}).draw();
	}
}

$(document).ready(function() {
	init() //mi pijo la lista dei match che mi manda Karl
	.then( return_matches => {
		let pastmatches = return_matches.pastmatches;
		let nextmatches = return_matches.nextmatches;
		
		console.log(pastmatches);
		
		document.getElementById("pastMatchesTableTitle").innerHTML = "<h3>Giornata " + pastmatches.round + "</h3>";
		document.getElementById("nextMatchesTableTitle").innerHTML = "<h3>Giornata " + nextmatches.round + "</h3>";
		
		
		document.getElementById("getStandings").addEventListener("click", e => Risultati(e));
		
		// Rendering tabella nextmatches
		var nextMatchesTable = $("#nextMatches");
		let matches = nextmatches.matches; //array di match
		
		for( let i = 0; i<matches.length; i++) {
			console.log(matches[i].match);
			var matchTemplate = "<tr><td>" + matches[i].match + "</td><td><input type=\"text\" id=\"" + matches[i].id + "h\"></td><td><input type=\"text\" id=\"" + matches[i].id + "a\"></td><td><input type=\"submit\" id=\"" + matches[i].id + "\"></td><td>" + matches[i].matchDate + "</td></tr>";
			nextMatchesTable.append(matchTemplate);
		
			//Per ogni match aggiungo il listener del bottone corrispondente
			
			document.getElementById(matches[i].id).addEventListener("click", e => {
				let idmatch = parseInt(e.target.id); //RESTITUISCE L'ID PAZZESCO
				console.log(idmatch);
				
				let homegoals = document.getElementById(idmatch + "h").value; //parseInt?
				let awaygoals = document.getElementById(idmatch + "a").value; //parseInt?
				
				document.getElementById(idmatch + "h").value = "";
				document.getElementById(idmatch + "a").value = "";
				
				const data = { idmatch, homegoals, awaygoals, currentuser };
				
				const options = {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(data)
				};
				
				fetch('/apipost', options)
				.then( x => {
					x.json()
					.then(x => {
						console.log(x);
					});
				});
				

			});
		} //chiude for
		
		//qua siamo ancora dentro init()
		
		//Render tabella pastmatches con datatable
		$("#pastMatches").DataTable({
			data: pastmatches.matches,
			columns: [
				{ "title": "Match", "data": "match" },
				{ "title": "Home Goal", "data": "homeGoals" },
				{ "title": "Away Goal", "data": "awayGoals" }
				],
			searching: false,
			paging: false,
			columnDefs: [ 
				{ sortable: false, targets: 0 },
				{ sortable: false, targets: 1 },
				{ sortable: false, targets: 2 }
				]
		});
		
		
	});
})