$(function (){ 

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    var $submenuone = $('.menuone'),
    	$submenutwo = $('.menutwo'),
    	$opened = 0;


	$(".tabone").click(function(){
		if ( $(".tabone").hasClass("selected") ) return;

		$submenuone.addClass('on animated fadeInUp')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            	$(this).removeClass('animated fadeInUp')  });
		$submenutwo.removeClass('on');


		$opened = $(this).addClass('selected');
		$(".tabtwo").removeClass('selected');
		return false;
	});

	$(".tabtwo").click(function(){
		if ( $(".tabtwo").hasClass("selected animated bounceIn") ) return;

		$submenutwo.addClass('on animated fadeInUp')
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            	$(this).removeClass('animated fadeInUp')  });
		$submenuone.removeClass('on');

		$opened = $(this).addClass('selected');
		$(".tabone").removeClass('selected');
		return false;
	});
	$('.image-link').magnificPopup({
		type:'image',
		gallery: {
			enabled: true,
			navigateByImgClick: true,
			preload: [0,1]
		}
	});
	makeSubmitLink();
	makeAjaxForms();
	makeDropLinks();
	makeMyOrderLinks();
	makeTip();
	makeCalendar();
	doService();

	$(document).on('click','.presets_items_trigger a',function(e){
		var
			link = $(this),
			link_holder = link.parent('.presets_items_trigger'),
			container = link.data('container');
		
		$('.presets_ites_container').hide();
		
		if( link_holder.hasClass('active') ){
			link_holder.removeClass('active');
		}else{
			$('.presets_items_trigger').removeClass('active');
			link_holder.addClass('active');
			$(container).show()
		}
		
		e.preventDefault()
	})

	// console.log( $(".tabone").hasClass("selected") );
	// $submenuone.velocity({ top: 50 }).velocity("transition.slideUpIn");


});

function doService(){
	$('#service_do').on('click',function(e){
		var
			btn = $(this),
			selector = btn.data('selector'),
			oferta = btn.data('oferta'),
			val = $(selector).val(),
			url = $(selector).data('url'),
			burial = $(selector).data('burial'),
			service = $(selector).data('serviсe');
		if( $(oferta).is(':checked') ){
			if(val){	
				if(typeof service != 'undefined'){
					Cookies.set('laying', 1, { path: '/' });
					$.post('/netcat/modules/netshop/actions/cart.php','json=1&'+service+'=1','json');				
				}else{
					Cookies.remove('laying', { path: '/' });
				}
				if(typeof burial != 'undefined') Cookies.set('burial', burial, { path: '/' });
				$.colorbox({
					href:url,
					iframe:true,
					width:'80%',
					height:'80%',
					overlayClose:false,
					closeButton:false,
					onClosed: function(){
						Cookies.remove('burial', { path: '/' });
						Cookies.remove('laying', { path: '/' });
					}
				});
			} else {
				alert('Вы не выбрали услугу');
			}
		} else {
			alert('Необходимо принять условия публичной оферты');
		}
	});
	$('#close_iframe').on('click',function(e){
		var button = $(this);
		if(button.hasClass('confirm')){
			if( confirm('Вы уверены? Это очистит вашу корзину') ){
				$.colorbox.close();	
			}
		}else{
			$.colorbox.close();	
		}
	})
}

function makeCalendar(){
	moment.locale('ru', {
		months : [
			"Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
			"Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
		]
	});
	var calendars = {};
    var calTemplate =
        "<div class='clndr-controls'>" +
            "<div class='clndr-control-button'>" +
                "<span class='clndr-previous-button'>&larr;</span>" +
            "</div>" +
            "<div class='month'>" +
			"<select id='month-selector'>" +
			"<% for(var i = 0; i < 12; i++){ %>" +
			"<option value='<%= i+1 %>' <% if( month == moment({ M:i}).format('MMMM') ){ %>selected<%}%>><%= moment({ M:i}).format('MMMM') %></option>" +
			"<%}%>" +
			"</select>" + 
			"<input type='text' value='<%= year %>' id='year-input' class='year-input'>" +
			"</div>" +
            "<div class='clndr-control-button rightalign'>" +
                "<span class='clndr-next-button'>&rarr;</span>" +
            "</div>" +
        "</div>" +
		"<div class='clndr-month-year'>" + 
		"<% for(var i = 0; i < 12; i++){ %>" +
		"<% if( month == moment({ M:i}).format('MMMM') ){ %><a href='/tombs/?dt=<%= year %>-<%= i+1 %>'><%= month %></a><%}%>" +
		"<%}%>" +		
		"&nbsp;&nbsp;&nbsp;<a href='/tombs/?dt=<%= year %>'><%= year %></a>" +
		"</div>" + 
        "<table class='clndr-table' border='0' cellspacing='0' cellpadding='0'>" +
            "<thead>" +
                "<tr class='header-days'>" +
                "<% for(var i = 0; i < daysOfTheWeek.length; i++) { %>" +
                    "<td class='header-day'><%= daysOfTheWeek[i] %></td>" +
                "<% } %>" +
                "</tr>" +
            "</thead>" +
            "<tbody>" +
            "<% for(var i = 0; i < numberOfRows; i++){ %>" +
                "<tr>" +
                "<% for(var j = 0; j < 7; j++){ %>" +
                "<% var d = j + i * 7; %>" +
                    "<td class='<%= days[d].classes %>'>" +
                        "<div class='day-contents'><%= days[d].day %></div>" +
                    "</td>" +
                "<% } %>" +
                "</tr>" +
            "<% } %>" +
            "</tbody>" +
        "</table>";	
	
    calendar = $('#calendar').clndr({
		daysOfTheWeek: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
		template: calTemplate,
		weekOffset: 1,
        clickEvents: {
            click: function (target) {
				dt = target.date._i;
				window.location.href = '/tombs/?dt='+dt;
            },
            onMonthChange: function (month) {
				$('#year-input').mask('9999');
            },
            onYearChange: function () {
				$('#year-input').mask('9999');
            }
        },
        showAdjacentMonths: true,
        adjacentDaysChangeMonth: false
    });
	
	$( document ).on( 'change', '#month-selector', function(e){
		selected_month = parseInt($(this).find('option:selected').val());
		calendar.setMonth(selected_month-1);
		$('#year-input').mask('9999');
	} ); 
	$( document ).on( 'keyup', '#year-input', function(e){
		val = parseInt( $(this).val() );
		if(val > 999){
			calendar.setYear(val);
			$('#year-input').mask('9999');
		}
	} ); 
	$('#year-input').mask('9999');
}

function makeTip(){
     $('a.tip').each(function() {
         $(this).qtip({
            content: {
                text: function(event, api) {
                    $.ajax({
                        url: api.elements.target.data('url') // Use href attribute as URL
                    })
                    .then(function(content) {
                        // Set the tooltip content upon successful retrieval
                        api.set('content.text', content);
                    }, function(xhr, status, error) {
                        // Upon failure... set the tooltip content to error
                        api.set('content.text', status + ': ' + error);
                    });
        
                    return 'Секундочку...'; // Set some initial text
                }
            },
            position: {
                viewport: $(window)
            },
            style: 'qtip-light qtip-shadow qtip-rounded'
         });
     });
}

function makeMyOrderLinks(){
	$('a.show-order-contents').on('click',function(e){
		link = $(this);
		link_text = link.text();
		link_alt = link.data('alt');
		link.parent().next('div').slideToggle(function(){
			link.text(link_alt);
			link.data('alt',link_text);		
		})

		
		e.preventDefault();
	});
}

function makeSubmitLink(){
	$('a.submit').on('click',function(e){
		rel = $(this).attr('rel');
		$('#'+rel).submit();
		e.preventDefault();
	})
}

function makeDropLinks(){
	$("a.drop").each(function(e){
			$(this).confirmOn({
				questionText: 'Вы уверены, что хотите удалить?',
				textYes: 'Да, уверен',
				textNo: 'Нет, не надо'
			 },'click', function(e, confirmed) {
				if(confirmed){
						$.blockUI.defaults.css = {};
						$.blockUI({
							message: '<div style="padding:10px;background:#ffffff;border-radius:10px;">Секундочку...</div>',
							blockMsgClass: 'block-message'
						});						
						$.get($(this).attr("href"), {template: 1000,ajax:1}, function(data){
							if(data.reload) window.location.reload(true);
							if(data.redirect) window.location.href = data.redirect;
							if(data.updateCont){
								$(data.updateCont).html(data.updateValue);
								$.unblockUI();
							}
							if(data.hideBlock){
								$.unblockUI();
								$(data.hideBlock).slideUp();
							}
						}, "json");
				};					
			})
	})
}


function makeAjaxForms(){
	$(document).on('submit', 'form.ajax',function(){
		$oForm = $(this);
		$sLoadCont = $oForm.data('loadcont');
		$sSaveHistory = $oForm.data('savehistory');
		$sURL = $(this).attr('action');
		$sSerializeParams = $oForm.serialize();
		$sParams = $sSerializeParams+'&template=1000&ajax=1&json=1';
		$sMethod = $oForm.attr('method');
		if($sMethod == '') $sMethod = 'get';
		$.blockUI.defaults.css = {};
		$oForm.children('.errorHolder').html('').hide();
		$oForm.block({
			message: '<div style="padding:10px;background:#ffffff;border-radius:10px;">Секундочку...</div>',
			blockMsgClass: 'block-message'
		});
		if($sSaveHistory){
			var state = {
				title: '',
				url: '?'+$sSerializeParams 
			}
			history.pushState( state, state.title, state.url );		
		}
		if($sLoadCont){
			$($sLoadCont).load($sURL+'?'+$sParams+'&hideForm=1&isNaked=1',function(){
				$oForm.unblock();
			});
		}else{
			$.ajax($sURL,{
				type:$sMethod,
				dataType:'json',
				data: $sParams,
				error:function(){
					alert('Ошибка')
				},
				success:function(data){
					if(data.status == 'error'){
						if(data.errorContainer){
							$(data.errorContainer).html(data.errorMessage).show();
						}else{
							alert(data.errorMessage);
						}
					}
					if(data.status == 'ok'){
						if(data.redirect){
							window.location.href = data.redirect;
						}else if(data.reload){
							window.location.reload(true);
						}else{
							if(data.resetForm) {
								$oForm.html(data.okMessage);
							}else{
								if(data.removeForm) $oForm.html(data.okMessage)
							}
							if(data.removeBlock) $(data.removeBlock).html(data.okMessage);
							if(data.clearForm) $oForm[0].reset();
							if(data.updateCont) $(data.updateCont).html(data.updateValue);
							if(data.loadURL){
								$oDummy = $('<div id="dummy"></div>');
								$oDummy.load(data.loadURL,function(){
									if(data.loadContainer == 'before'){
										if(data.loadPos){
											$(data.loadPos).before($oDummy.html());
										}else{
											$oForm.before($oDummy.html());
										}
									}
									if(data.loadContainer == 'after'){
										if(data.loadPos){
											$(data.loadPos).after($oDummy.html());
										}else{
											$oForm.after($oDummy.html());
										}
									}
									if(data.loadContainer == 'into'){
										if(data.loadPos){
											$(data.loadPos).html($oDummy.html());
										}else{
											$oForm.html($oDummy.html());
										}
									}								
								})
								$oDummy.remove();
							}
						}
					}
					$oForm.unblock();				
				},
				complete:function(){
					$oForm.unblock();
				}
			});
		}
		return false;
	});
}
