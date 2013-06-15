$(function() {
	var $divContent, $searchResults, resultHtmlHeader, searchTag;

	$divContent = $("div#content");
	$divContent.css("display", "none");
	$divContent.fadeIn(600);

	searchTag = window.location.search.split('=')[1];
	if (searchTag) {
		resultHtmlHeader = ["Article results for <b><i>" + searchTag + "</i></b>", "<hr />"].join('\n');
		$searchResults = $("#search-results");
		$searchResults.append(resultHtmlHeader);
		$.getJSON('/search.json', function(data) {
			var result, resultFound, resultHtmlRow, _i, _len;
			data.pop();
			for (_i = 0, _len = data.length; _i < _len; _i++) {
				result = data[_i];
				resultFound = result.tags.indexOf(searchTag);
				if (resultFound !== -1) {
					resultHtmlRow = ["<div class='post-content search-result-row'>", "<p><a href='" + result.href + "'>" + result.title + "</a><br/>", "" + result.description + "</p>", "</div>"].join('\n');
					$searchResults.append(resultHtmlRow);
				}
			}
		});
	}
});
