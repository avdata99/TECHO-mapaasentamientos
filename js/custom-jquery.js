function initUI() {
	$('ul li:first-child').addClass('first');
	$('ul li:last-child').addClass('last');


    $('.sidebar .topc ul li .tt').click(function () {
       
        var active = $(this).parents('li').hasClass('slider');
        $('.sidebar .topc ul li.slider').removeClass('slider');
        $('.sidebar .bottomc ul li.slider').removeClass('slider');
        $('.filter-compile').removeClass('active');
        if (active) {
            $(this).parents('li').removeClass("slider");
        } else {
            $(this).parents('li').addClass("slider");
        }
        $('.sidebar .topc ul li .bt .arrow').click(function () {
       
            $(this).parents('li').removeClass('slider');

            return false;

        });
        
        return false;
        
    });
    
    
	
	$('.sidebar .bottomc ul li .tt').click(function () {
        var completed = localStorage.downloadCompleted;
        $('.sidebar .topc ul li.slider').removeClass('slider');
        $('.filter-compile').removeClass('active');
	    if (completed) {
            $(".download-menu").toggleClass("slider");
	    } else {
            $(this).parents('li').toggleClass('slider');
            $(".request-error").removeClass("active");
        }

        
        $('.sidebar .bottomc ul li .bt .arrow').click(function () {
       
            $(this).parents('li').removeClass('slider');

            return false;

        });
        
        return false;
        
    });
	
	
	$('.sidebar .bottomc ul li .bt.bttick .toprow').click(function () {
		
		$(this).toggleClass('ticked');
		
	});
	
    
    
    $(".mCustomScrollbars").mCustomScrollbar({
        scrollButtons:{enable:true},
        scrollbarPosition:"outside"
    });
    
    
    $('.sidebar .topc .bt.wscroll .midt .rows .toprow.clickeable').click(function () {
        var active = $(this).hasClass("active");
        $('.sidebar .topc .bt.wscroll .midt .rows .toprow.clickeable').removeClass("active");
        if (active) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }

		$(this).siblings('.botrow.clickeable').slideToggle();
        $(this).parent('.rows').siblings('.rows').find('.botrow.clickeable').slideUp();
		
	});
    
    
    $('.sidebar .topc .bt .midt .rows .botrow .blockin .blocktops').click(function () {
        $(this).siblings('.blockbots').slideToggle();
        $(this).parents('.blockins').siblings('.blockins').find('.blockbots').slideUp();
    
    });
    
    
    
    $(".search-wrap").on("click", function(e){
        e.stopPropagation();
    });
    $(".search-wrap input[type=text]").on("focus", function(e){
        $("#search_input").val('');
        $(".filter-compile").removeClass("active");
    });
    $(".search-wrap input[type=text]").on("blur", function(e){
        $('.search-botc').fadeOut();
    });
    // $('body').on('click',function(){
    //   $('.search-botc').fadeOut();
    // });
    
    
    
    $('#nav ul').clone().appendTo('.mobmenu .top2');
    $('#logo').clone().appendTo('.mobmenu .top1');
    
    
    $('.menubtn').click(function () {
        
       $('.menuwrap').slideToggle(); 
        
       $('.closeb').click(function () { 
            $('.menuwrap').slideUp();  
       });
        
        return false;    
        
    });
    
    $('.sidebar .topc ul li .tt a em').wrapInner('<b></b>');
    $('.sidebar .bottomc ul li .tt a em').wrapInner('<b></b>');
    
};

	
function wResize() {
		
   
    var h1 = $('.sidebar .topc .bt').height();
    $('.mCustomScrollbars').css('height', h1 - 90);
    
    var h2 = $('.filter-compile').height();
    $('.mcsbar').css('height', h2 - 100);
    
    
}

$(window).resize(function() {
    wResize();
});

$(window).load(function() {
    wResize();
});

    
	


