$(function (){ 

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
	

	makeSubmitLink();
	makeAjaxForms();
	makeDropLinks();
	makeMyOrderLinks();
	makeTip();
	doService();
	addToCart();
	toCartToggle()


	$( ".datepicker" ).datepicker({
		minDate: +3,
		dateFormat:'dd/mm/yy'
	},
		$.datepicker.regional[ "ru" ]
	);


	// console.log( $(".tabone").hasClass("selected") );
	// $submenuone.velocity({ top: 50 }).velocity("transition.slideUpIn");


});


function toCartToggle(){
	$( document ).on( "click", ".to_cart_toggler", function(e) {
		var
			basket = $('#cart_content'),
			basket_y = Math.ceil( basket.offset().top ) + 'px',
			basket_x = Math.ceil( basket.offset().left ) + 'px',
			btn = $(this),
			btn_text = btn.text(),
			btn_alt = btn.data('alt'),
			btn_id = btn.data('id'),
			btn_class = btn.data('class'),
			item = btn.parents('li'),
			item_w = item.width(),
			item_h = item.height(),
			form = btn.parent('form'),
			url = form.attr('action');
		
		if(item.hasClass('in_cart')){
			$(item)
				.clone()
				.css({'position': 'absolute', 'z-index': '100', top: basket_y, left: basket_x, opacity: 0.5, width:50, height:50})
				.appendTo($('.iframe'))
				.animate({
					opacity: 1,
					top: Math.ceil($(item).offset().top) + 'px',
					left: Math.ceil($(item).offset().left) + 'px',
					width: item_w,
					height: item_h
				}, 700, function () {
					$(this).remove();
					btn.data('alt',btn_text);
					btn.text(btn_alt);
					item.removeClass('in_cart')
				});	
			$.post('/netcat/modules/netshop/actions/cart.php','cart['+btn_class+']['+btn_id+']=0&json=1',
				function(data){
					if(data.TotalCount == 0){
						text = "Ваша корзина пуста";
					}else{			
						text = "<a href='/cart/'>В корзине</a> "+data.TotalCount+" "+GetNoun(data.TotalCount,'товар','товара','товаров')+"<br> на сумму "+data.TotalItemPrice+" руб.<br>"+
						"<a href='/order/' class='cart_content_order'>Оформить заказ</a>";
					}
					basket.html(text);
				},
			'json');

			
			
		}else{
		
			$(item)
				.clone()
				.css({'position': 'absolute', 'z-index': '100', top: Math.ceil($(item).offset().top) + 'px', left: Math.ceil($(item).offset().left) + 'px'})
				.appendTo($('.iframe'))
				.animate({
					opacity: 0.5,
					top: basket_y,
					left: basket_x,
					width: 50,
					height: 50
				}, 700, function () {
					$(this).remove();
					btn.data('alt',btn_text);
					btn.text(btn_alt);
					item.addClass('in_cart')
				});

				
			$.post(url,form.serialize()+'&json=1',
				function(data){
					text = "<a href='/cart/'>В корзине</a> "+data.TotalCount+" "+GetNoun(data.TotalCount,'товар','товара','товаров')+"<br> на сумму "+data.TotalItemPrice+" руб.<br>"+
					"<a href='/order/' class='cart_content_order'>Оформить заказ</a>";
					basket.html(text);
				},
			'json');
		}
		e.preventDefault();
	});
}

function addToCart(){
	$( document ).on( "submit", ".add_to_cart_form", function(e) {
		e.preventDefault();
	});
	
	
	$( document ).on( "click", ".add_to_cart", function(e) {
		var
			basket = $('#cart_content'),
			basket_y = Math.ceil( basket.offset().top ) + 'px',
			basket_x = Math.ceil( basket.offset().left ) + 'px',
			btn = $(this),
			id = btn.data('id'),
			item = $('#img_'+id),
			form = btn.parents('form.add_to_cart_form'),
			url = form.attr('action');
				
		$(item)
			.clone()
			.css({'position': 'absolute', 'z-index': '100', top: Math.ceil($(item).offset().top) + 'px', left: Math.ceil($(item).offset().left) + 'px'})
			.appendTo($('.iframe'))
			.animate({
				opacity: 0.5,
				top: basket_y,
				left: basket_x,
				width: 50,
				height: 50
			}, 700, function () {
				$(this).remove();
			});

				
		$.post(url,form.serialize()+'&json=1',
			function(data){
				text = "<a href='/cart/'>В корзине</a> "+data.TotalCount+" "+GetNoun(data.TotalCount,'товар','товара','товаров')+"<br> на сумму "+data.TotalItemPrice+" руб.<br>"+
				"<a href='/order/' class='cart_content_order'>Оформить заказ</a>";
				basket.html(text);
			},
		'json');
		
		e.preventDefault();
	});
}

function doService(){
	$('#close_iframe').on('click',function(e){
		var button = $(this);
		if(button.hasClass('confirm')){
			if( confirm('Вы уверены? Это очистит вашу корзину') ){
				$.post('/netcat/modules/netshop/actions/cart.php','json=1&cart_clear=1',
				function(data){
					//window.parent.$.colorbox.close();
				},'json');		
			}
		}else{
			//window.parent.$.colorbox.close();
		}
	})
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

 GetNoun = function(number, one, two, five) {
    number = Math.abs(number);
    number %= 100;
    if (number >= 5 && number <= 20) {
        return five;
    }
    number %= 10;
    if (number == 1) {
        return one;
    }
    if (number >= 2 && number <= 4) {
        return two;
    }
    return five;
} 
