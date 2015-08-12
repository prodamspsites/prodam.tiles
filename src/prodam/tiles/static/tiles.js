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

    $("#controler-carrossel a").bind("click", function(){
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
   })
})(jQuery);