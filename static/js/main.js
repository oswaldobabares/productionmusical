jQuery(function($){
    "use strict";
	
	var isStickyPlayer=$(".sticky_player").attr('data-sticky'),
		isStickyNav=$("#sticktop").attr('data-sticky'),
		naviheight=$("#sticktop").height(),
		playerHeight=$(".sticky_player").height(),
		navTopSpace=0,NavOffset=0;
		var $winHeight=$(window).height(),
		$winWidth=$(window).width();
		
	$(window).on('resize', function(){
		$winHeight=$(window).height();
		$winWidth=$(window).width();
		
		$('.hero_section').css('height',$winHeight+'px');
		var $hero_height=$('.hero_section').height(), 
			$hero_content_height=$('.hero_content').height();
		
		if($hero_height<$hero_content_height ){$('.hero_section').css('height',$hero_content_height+70+'px');}
		$('.hero_section').css('padding-top',($hero_height/2)-($hero_content_height/2)+'px');
		
	}).resize();
		
	$(".list_scroll").mCustomScrollbar({advanced: {updateOnContentResize: true},});
	
	if(isStickyNav!="false"){NavOffset=naviheight + 10;}
	if(isStickyPlayer!="false"){NavOffset=playerHeight+10;}
	if(isStickyNav!="false" && isStickyPlayer!="false"){NavOffset=naviheight+playerHeight+10;}	
	$('body').attr('data-offset',NavOffset+10);
	
    $(".navbar-nav a[href^='#'],.ScrollTo,.btn-scroll").click(function (e) {
		e.preventDefault();
        $('html, body').stop().animate({scrollTop: $($.attr(this, 'href')).offset().top - NavOffset}, 1000,"swing");
    });
		
	if($winWidth>700){
	  if($(".sticky_player").attr('data-sticky')!="false"){navTopSpace=playerHeight;}
	  if(isStickyNav!="false"){
		  $("#sticktop").sticky({topSpacing:navTopSpace});}  
	  if($(".sticky_player").attr('data-sticky')!="false"){
		  $(".sticky_player").sticky({topSpacing: 0});
	  }
	  $('#sticktop').on('sticky-start', function() {
		  if($(".sticky_player").attr('data-sticky')!="false")
		  $('.rock_player').removeClass('pre_sticky');
	  });
	  $('#sticktop').on('sticky-end', function() {
		  if($(".sticky_player").attr('data-sticky')!="false")
		  $('.rock_player').addClass('pre_sticky');
	  });  
	}
    
	  $.stellar({
		horizontalScrolling: false,
		verticalOffset: 0,
		responsive:true,
	  });
	
	if($('.vegas-slides').length){
		var vegas_BG_imgs = [],
		$vegas_img = $('.vegas-slides li img'),
		vegas_slide_length= $('.vegas-slides li').length;
		
		for (var i=0; i < vegas_slide_length; i++) {
			var new_vegas_img = {};
			new_vegas_img['src'] = $vegas_img.eq(i).attr('src');
			new_vegas_img['fade'] =$vegas_img.eq(i).attr('data-fade');
			vegas_BG_imgs.push(new_vegas_img);
		}
		
		var slideSpeed= $('.vegas-slides').data("speed");
		$.vegas('slideshow', {
			delay:slideSpeed,
			backgrounds:vegas_BG_imgs
		});
		$('.vegas-controls a').click(function(e){
			e.preventDefault();
			var $parent=$(this).parent('li');
			if(!$parent.hasClass('active')){
				$('.vegas-controls li').removeClass('active');
				$parent.addClass('active');
				$.vegas('jump', $parent.index());
			}
		});
		$('body').bind('vegaswalk',
		function(e, bg, step) {
			$('.vegas-controls li').removeClass('active');
			$('.vegas-controls li').eq(step).addClass('active');
		});
	}
	
	if($winWidth<760){
		$.vegas('pause');
	}
	
	reanimate();
    function reanimate() {
        $('.ScrollTo > i').animate({top:0}, 1000).animate({top: 20},1000,function(){setTimeout(reanimate, 100);});
    }
	
	$('.playlist_expander').click(function(e){
		e.preventDefault();
		$('.play_list').slideToggle();
	});
	 $("#player-instance").jPlayer({
        cssSelectorAncestor: ".rock_player",
    });
	if($('.playlist-files').length){
		var playlist_items = [],
		$playlist_audio=$('.playlist-files li'),
		$list_content=$('.player_data li'),
		playlist_items_length= $playlist_audio.length;
		
		for (var i=0; i < playlist_items_length; i++) {
			var  new_playlist_item = {};
			new_playlist_item['title'] = $playlist_audio.eq(i).attr('data-title');
			new_playlist_item['artist'] = $playlist_audio.eq(i).attr('data-artist');
			new_playlist_item['mp3'] = $playlist_audio.eq(i).attr('data-mp3');
			playlist_items.push(new_playlist_item);
			
			$list_content.eq(i+1).children('.track_index').html(i+1);
			$list_content.eq(i+1).children('.track_thumb').html('<img src='+$playlist_audio.eq(i).attr('data-thumb')+' alt="track Thumb" />');
			$list_content.eq(i+1).children('.track_title').html($playlist_audio.eq(i).attr('data-title'));
			$list_content.eq(i+1).children('.track_genre').html($playlist_audio.eq(i).attr('data-genre'));
			$list_content.eq(i+1).children('.track_composer').html($playlist_audio.eq(i).attr('data-artist'));
			$list_content.eq(i+1).children('.track_length').html($playlist_audio.eq(i).attr('data-length'));
			$list_content.eq(i+1).find('.btn_watch_video').attr('href',$playlist_audio.eq(i).attr('data-video'));
			$list_content.eq(i+1).find('.itunesLink').attr('href',$playlist_audio.eq(i).attr('data-itunes'));
		}
		
		var werock = new jPlayerPlaylist({
			jPlayer: "#player-instance",
			cssSelectorAncestor: "",
		},playlist_items ,
			{playlistOptions: {autoPlay: false}},
		{
			swfPath: "assets/jPlayer/jquery.jplayer.swf",
			supplied: "mp3",
		});
		$('.play_it').click(function(e){
			e.preventDefault();
			werock.play($(this).parents('li').index()-1);
		});
		$('.audio-title').html(werock.playlist[0].title);
		$("#player-instance").bind($.jPlayer.event.play, function (event) {
			var current = werock.current,
				playlist = werock.playlist;
			jQuery.each(playlist, function (index, obj) {
				if (index == current) {
					$('.audio-title').html(obj.title);
				}
			});
		});
		$("#player-instance").jPlayer("volume", '0.8');
		$('.jp-volume li a').click(function(e){
			e.preventDefault();
			$('.jp-volume li').removeClass('active');
			 $("#player-instance").jPlayer("volume", ($(this).parent().index()+1)/10*2);
			for(var i=0;i<=$(this).parent().index();i++){
				$('.jp-volume li').eq(i).addClass('active');
			}
		});
	}
});
