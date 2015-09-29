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
        if ($('body').hasClass('subsection-noticias')) {
            $('#range-start, #range-end').datepicker();
            $('select#selectedSecretaria').on('change', function() {
                thisVal = $(this).val();
                if (thisVal) {
                    creator = 'Creator=' + thisVal + '&';
                    appendQuery(creator);
                }
            });
            $(document).on('click', '.paginacao li a', function(e) {
                e.preventDefault();
                page = $(this).attr('href').split('?')[1].slice(0,15);
                appendQuery(page);
                return false
            });
            $('input#range-start, input#range-end').on('change', function() {
                thisId = $(this).attr('id');
                thisVal = $.datepicker.formatDate('yy/mm/dd', $(this).datepicker('getDate'));
                if (thisVal) {
                    if (thisId == 'range-start') {
                        initialDate = '&EffectiveDate.query:record:list:date=' + thisVal + '&EffectiveDate.range:record=min';
                        appendQuery(initialDate);
                    } else {
                        finalDate = '&EffectiveDate.query:record:list:date=' + thisVal + '&EffectiveDate.range:record=min:max';
                        appendQuery(finalDate);
                    }
                }
            });

            function appendQuery() {
                (typeof page === 'undefined') ? page = '' : page = page;
                (typeof creator === 'undefined') ? creator = '' : creator = creator;
                (typeof initialDate === 'undefined') ? initialDate = '' : initialDate = initialDate;
                (typeof finalDate === 'undefined') ? finalDate = '' : finalDate = finalDate;
                searchUrl = portal_url + '/@@busca?';
                queryString = searchUrl + page + creator + initialDate + finalDate + '&portal_type%3Alist=News+Item';
                getNoticias(queryString);
            }

            function getNoticias (queryString) {
                $.ajax({url: queryString, success: function(result){
                    results = $(result).find('.searchResults a');
                    batch = $(result).find('.paginacao');
                    noticias = {};
                    $.each(results, function(k, v) {
                        link = $(this).attr('href');
                        title = $(this).find('.itemTitle').text() + '|' + link;
                        date =  $.trim($(this).find('.documentPublished').html());
                        if (date in noticias) {
                            noticias[date].push(title)
                        } else {
                            noticias[date] = [title];
                        }
                    })
                    results = formatNewsTile(noticias);
                    $('div.lista-noticias').html(results).append(batch);
                }})
            }

            function formatNewsTile(dict) {
                results = '';
                $.each(dict, function(k, v) {
                    thisDate = k.slice(0,2);
                    thisMonth = k.slice(3,5);
                    thisMonth = returnMonth(thisMonth);
                    results += '<div class="controle1 collection-item"><div class="data-noticia">';
                    results += '<span>'+thisMonth+'</span><span>'+ thisDate+'</span>';
                    results += '</div><div class="titulo-noticia">';
                    $.each(v, function(k, v) {
                        news = v.split('|');
                        results += '<p><a href="'+news[1]+'" title="'+news[0]+'">'+news[0]+'</a></p>';
                    })
                    results += '</div><!--  --><div class="visualClear"><!-- --></div></div>';
                })
                return results;
            }

            function returnMonth(entry) {
                entry = parseInt(entry);
                months = {01: 'Jan', 02: 'Fev', 03: 'Mar', 04: 'Abr', 05: 'Mai', 06: 'Jun', 07: 'Jul', 08: 'Ago', 09: 'Set', 10: 'Out', 11: 'Nov', 12: 'Dez'}
                return months[entry];
            }
        }

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
                return false;
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
        if ($('body').hasClass('section-prefeitura-de-sao-paulo') && $('body').hasClass('portaltype-collective-cover-content')) {
            var timer = setInterval(function(index){
                timerBanner();
                tempo = tempo*index;
            }, tempo);
        }

            $(".section-prefeitura-de-sao-paulo #controler-carrossel a , .subsection-turista #controler-carrossel a ").bind("click", function(){
                clearInterval(timer);
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
                return false;
            })
        }
   })
})(jQuery);
