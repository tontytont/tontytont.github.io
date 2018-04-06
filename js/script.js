$(function() {
	$('body').waitForImages({
		finished: function() {
				Website();
				$('body').jKit();
		},
		waitForAll: true
	});

	$("a.ajax-link").live("click", function(){
		$this = $(this);
		var link = $this.attr('href');
		var current_url = $(location).attr('href');	
		
		if( link != current_url && link != '#' ) { 
		$.ajax({
			url:link,
			processData:true, 
			dataType:'html', 
			success:function(data){
				document.title = $(data).filter('title').text(); 
				current_url = link;
        if (typeof history.pushState != 'undefined') history.pushState(data, 'Page', link);
        
          setTimeout(function(){						
          $('#preloader').delay(50).fadeIn(500);
          $('html, body').delay(500).animate({ scrollTop:  0  },500);						
            setTimeout(function(){
							
              $('#ajax-content').html($(data).filter('#ajax-content').html());
              $('#ajax-sidebar').html($(data).filter('#ajax-sidebar').html());

  						$('body').waitForImages({
  							finished: function() {
  								Website();
  								backLoading();
  								$('.opacity-nav').delay(50).fadeOut(500);
                },										
                waitForAll: true
						  });								
					 },500);
					},0);
			}
		});
    }
    return false;
	});

function backLoading() {  
    $(window).on("popstate", function () {
        $('body').fadeOut('slow',function(){
            location.reload();
        });
        $('body').fadeIn();
    });
}   

function Website() {
		CheckScripts();		
		Masonry();
		$('body').jKit();
		backgroundmenu();
		setTimeout(function(){
			$(".preloader").fadeOut(1000);							
		},800);
		setTimeout(function(){
			$('header').fadeIn();							
		},500);
}

function CheckScripts() {

  $(document).ready(function(){
    preloaderCheck();
    Typewriting();
    sidebarhero();
  });

}


function Masonry() {
       var $container = $('.portfolio-grid');
     
       $container.imagesLoaded( function(){
         $container.masonry({
           itemSelector : 'li'
         });
       });
}

function backgroundmenu() {

  $(document).ready(function(){
     if($("#header-fade").length) {

         $(window).scroll(function(){
            if ($(this).scrollTop() > 10) {
                $('header').fadeOut();
            } else {
                $('header').fadeIn();
            }
        }); 
     }
     
     if($("#header-white").length) {

         $(window).scroll(function(){
            if ($(this).scrollTop() > 10) {
                $('header').css( "background", "white" );
                $('header .logo > a').css( "borderBottom", "0" );

            } else {
                $('header').css( "background", "none" );
            }
        }); 
     }

   
  });

}

function Typewriting() {


$(document).ready(function(){
	setTimeout( function(){
		if($("#site-type").length) {
        $(".typewrite span").typed({
            strings: ["How to","Where at","Which of","What for","WHY NOT?","YNOT"],
            typeSpeed: 50,
            backDelay: 500,
            loop: false,
            contentType: 'html', // or text
            // defaults to false for infinite loop
            loopCount: false,
        });
    }
	}, 3000);
});
}

function sidebarhero() {

  if($("#hero").length) {
    var fadeStart=100,fadeUntil=800,fading = $('#hero');

    $(window).bind('scroll', function(){
        var offset = $(document).scrollTop()
            ,opacity=0
        ;
        if( offset<=fadeStart ){
            opacity=1;
        }else if( offset<=fadeUntil ){
            opacity=1-offset/fadeUntil;
        }
        fading.css('opacity',opacity);
    });
  } 
}

function OpenCheck() {
    setTimeout(function() {
        hidePreloader();
    }, 1000);
}

function preloaderCheck() {
    showPreloader();

    $(window).load(function() {
        hidePreloader();
    });
}

function showPreloader() {
  $(".preloader").fadeIn("slow");
}

function hidePreloader() {
  $(".preloader").delay(2000).fadeOut("slow");
}



})//End

