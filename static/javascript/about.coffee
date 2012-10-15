$ ->
	$('#hideme').hide()

	$('#button-hideme').click () ->
		$('#hideme').slideDown('slow')
		$(this).hide()
		return


