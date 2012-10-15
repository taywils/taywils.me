$(function(){
	$('#slides').slides({
		preload: true,
		preloadImage: '/static/images/slidesjs/loading.gif',
		play: 0,
		pause: 2500,
		hoverPause: true,
		animationStart: function(current){
		},
		animationComplete: function(current){
			showDescription();
		},
		slidesLoaded: function() {
			showDescription();
		}
	});

	function showDescription() {
		//slide content
		var $sc = $('div.slide').filter(function() {
			return this.style.display !== 'none';
		});
		//caption
		var cap = $sc.children('div.caption').html();
		$('div#project-description').html(cap);
	}
});
