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

    $(".section-prefeitura-de-sao-paulo #controler-carrossel a").bind("click", function(){
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

    $(".bannerInfo h2 a").bind("click", function(){
        event.preventDefault();
        thisParent = $(this).parent()
        bannerInfo = $(thisParent).parent()
        $('div.chamada-item img, .bannerInfo p').each(function(){
            $(this).hide();
        })
        var controle = 'div.' + $(thisParent).attr('class');
        $(controle + ' img, ' + controle + ' p').show().css({
            opacity: 0.8
        }).animate({
            opacity:1
        },250,'easeInSine')
    })
   })
})(jQuery);