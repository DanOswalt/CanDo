$(function(){
  
    //Google Drive Filename: Can Do Prototype Data

    var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1MamOHGbwEpj6fgm6pfgy2DS2Uo-zb0x8tDispIyTghg/edit#gid=0';
    
    //load spreadsheet using sheetrock.js method
	$('#candoers-table').sheetrock({
  		url: mySpreadsheet
	});

	//wait until table is loaded from Google Spreadsheet
	(function onTableLoad() {
 
 		//if no table rows exist yet in DOM, no table has been loaded, so check again
    	if($('tr').length === 0) {

    		console.log('No Table');
    		setTimeout(onTableLoad, 100);

    	} else {
    		//if table exists, go ahead and execute code
    		console.log('Table Loaded');

    		$('#fetch-msg').remove();

    		var searchTerm = "",
    			lastTerm = "",
    		    matchCount = 0,
    		    $allCells = $('td, th');

    		//remove empty cells from table before defining
			$allCells.each(function(){
				if(this.textContent === "") {
					$(this).remove();
				}
			});

			//remove table headers
			$('th').remove();

			//jquery objects
			var $searchBox = $('#search'),
				$backBtn = $('#back-btn'),
				$table = $('#candoers-table'),
				$tableRows = $('tr').slice(1),
				$tableRowHeaders = $('td:first-child'),
				$tableDataCells = $('td'),
				$skillCells = $('td+td');	

			//nice fade in when loaded
			$table.fadeIn(600);
			$('#contact-msg').fadeIn(600);

			//make table headers hrefs that connect to their contact info on the commons in new tab
			$tableRowHeaders.each(function(){

				var name = $(this).text();
				var nameForUrl = name.replace(' ', '%20');
				var url = 'https://commons.multcolib.org/search/apachesolr_search/' + nameForUrl;
				var anchorElement = '<a target="_blank" href=' + url + '>' + name + '</a>';

				$(this).html(anchorElement);

				//also add row-header class
				$(this).addClass('row-header');
			});

			//////////
			//events//
			//////////

			//bind click event to $skillCells to send the value to the input box
			$skillCells.on('click', function() {
				lastTerm = searchTerm;
				searchTerm = $(this).text().trim().toUpperCase();
				$searchBox.val(searchTerm);
				toggleTableVisibility();
				checkLastTerm();
			});

			$backBtn.on('click', function() {
				backToLastTerm();
				checkLastTerm();
			});

			//toggle visibility as keyword is entered
			$searchBox.on('keyup', function() {
				lastTerm = searchTerm;
				searchTerm = this.value.trim().toUpperCase();
				toggleTableVisibility();
				// checkLastTerm();
			});

			function checkLastTerm() {
				if(lastTerm === $searchBox.val().trim().toUpperCase()) {
					$backBtn.hide();
				} else {
					$backBtn.show();
				}
			}

			function backToLastTerm() {
				$searchBox.val(lastTerm).focus();
				searchTerm = lastTerm;
				toggleTableVisibility();
			}

			function toggleTableVisibility() {
				toggleCellVisibilityForTextMatch(searchTerm);
				//delay to wait for cell fade (200ms)
				setTimeout(toggleRowVisibility, 250);
			}

			function toggleCellVisibilityForTextMatch() {

				var cellText, itemsInRow, $cell, $row;

				$tableRows.children().each(function(){

					$cell = $(this);
					$row = $cell.parent();

					//skip row header
					if($cell.hasClass('row-header')) {
						return;
					}
					cellText = $cell.text().trim().toUpperCase();

					//exact substring match
					if(cellText.indexOf(searchTerm) >= 0) {
						$row.show(); //show now for cases when row was previously hidden
						$cell.fadeIn(200);
					} else {
						$cell.fadeOut(200);
					}
				});
			}	

			function toggleRowVisibility() {

				$tableRows.each(function(index) {
					var visibleCellsInRow = $(this).find('td:visible').length;
					console.log("Row " + index + ": " + visibleCellsInRow);
					
					if(visibleCellsInRow > 1) {
						$(this).show();
					} else {
						$(this).hide();
					}

				});
			}
    	}
	})();  
});