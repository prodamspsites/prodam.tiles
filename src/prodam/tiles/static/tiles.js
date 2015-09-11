/*
  Comentario
*/
$(function() {
    var root = typeof exports !== "undefined" && exports !== null ? exports : this;

    $(window).load(function(){
    });
});

(function($) {
    $(document).ready(function() {

        if ($('body').hasClass('subsection-cidadao') || $('body').hasClass('subsection-empresa') || $('body').hasClass('subsection-servidor') ) {
            $('.controle1').addClass('ativo');
            function timerBannerSecoes(){
                $('.ativo').removeClass('ativo');
                banners = $('.bannerInfo h2 a');
                controle = '.controle' + (parseInt(lastBanner.slice(-1)));
                if (controle == '.controle' + (banners.size() +1)) {
                    controle = '.controle1';
                    index=1;
                }
                $('div.chamada-item img, .bannerInfo p').each(function(){
                    $(this).hide();
                })
                bannerInfoAtivo = controle +' .bannerInfo ' + 'h2';
                $(bannerInfoAtivo).addClass('ativo');
                controle = controle + ' img, ' + controle + ' p';
                $(controle).show().css({
                    opacity: 0.8
                }).animate({
                    opacity:1
                },250,'easeInSine')
            }
                var tempo = 5000;
                var index = 2;
                var timer = setInterval(function(){
                    lastBanner = '.controle' + index;
                    timerBannerSecoes(lastBanner);
                    tempo = tempo*index;
                    index++;
                }, tempo);
            $(".bannerInfo h2 a").bind("click", function(){
                clearInterval(timer)
                event.preventDefault();
                $('.ativo').removeClass('ativo');
                thisParent = $(this).parent()
                bannerInfo = $(thisParent).parent()
                $('div.chamada-item img, .bannerInfo p').each(function(){
                    $(this).hide();
                })
                var controle = 'div.' + $(thisParent).attr('class');
                bannerInfoAtivo = controle + ' .bannerInfo h2';
                $(bannerInfoAtivo).addClass('ativo');
                $(controle + ' img, ' + controle + ' p').show().css({
                    opacity: 0.8
                }).animate({
                    opacity:1
                },250,'easeInSine')
            })
        }else{

            function timerBanner(){
                lastBanner = $('a.ativo');
                $('.ativo').removeClass('ativo');
                nextBanner = $(lastBanner).attr('class');
                nextBanner = '.tile-default .controle' + (parseInt(nextBanner.slice(-1)) +1);
                controles = $('#controler-carrossel a');
                if ($(controles[controles.length -1]).attr('class') == $(lastBanner).attr('class')) {
                    nextBanner = '.tile-default .controle1';
                }
                $(nextBanner).addClass('ativo');
                $('.ativo').css({
                    opacity: 0.8
                }).animate({
                    opacity:1
                },250,'easeInSine')
            }
            tempo = 5000;
                var timer = setInterval(function(index){
                    timerBanner();
                    tempo = tempo*index;
                }, tempo);


            $(".section-prefeitura-de-sao-paulo #controler-carrossel a").bind("click", function(){
                clearInterval(timer);
                event.preventDefault();
                $('.ativo').each(function(){
                    $(this).removeClass('ativo');
                })
                var controle = '.' + $(this).attr('class');
                $(controle).each(function() {
                    $(this).addClass('ativo')
                });
                $('.ativo').css({
                    opacity: 0.8
                }).animate({
                    opacity:1
                },250,'easeInSine')
            })
        }
   })
})(jQuery);
