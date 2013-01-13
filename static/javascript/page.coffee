$ ->
	# Content fade style
	###
	$divContent = $ "div#content"
	$divContent.css "display", "none"
	$divContent.fadeIn 600
	###
	
	#Checks for search parameter if found then displays results
	searchTag = window.location.search.split('=')[1]
	if searchTag
		resultHtmlHeader = [
			"Article results for <b><i>#{searchTag}</i></b>"
			"<hr />"
		].join('\n')
		$searchResults = $ "#search-results"
		$searchResults.append(resultHtmlHeader)

		$.getJSON '/search.json', (data) ->
			data.pop() # remove the null element necessary for jekyll json generation 
			for result in data
				resultFound = result.tags.indexOf searchTag
				if resultFound != -1
					resultHtmlRow = [
						"<div class='post-content search-result-row'>"
						"<p><a href='#{result.href}'>#{result.title}</a><br/>"
						"#{result.description}</p>"
						"</div>"
					].join('\n')
					$searchResults.append(resultHtmlRow)
			return
