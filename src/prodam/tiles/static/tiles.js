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
        if ($('body').hasClass('subsection-noticias') || $('body').hasClass('section-capa-protetora')) {
            $('#range-start, #range-end').datepicker();
            $('select#selectedSecretaria').on('change', function() {
                thisVal = $(this).val();
                if (thisVal) {
                    // creator = 'Creator=' + thisVal + '&';
                    creator = 'autor=' + thisVal + '&';
                    appendQuery(creator);
                }
            });
            $(document).on('click', '.paginacao li a', function(e) {
                e.preventDefault();
                //page = $(this).attr('href').split('?')[1].slice(0,15);

                page = $(this).attr('href').split('?')[1];
                params = page.split("&");
                for(var i = 0;i < params.length;i++){
                    if(params[i].slice(0,11) == "b_start:int"){
                        page = params[i].slice(0,params[i].length) + "&";
                    }
                }
                /*
                page == 'b_start:int=0&C' ? page = 'b_start:int=0&' : page = page;
                appendQuery(page);*/
                appendQuery(page);
                return false
            });



            getNoticias(portal_url + '/@@busca?portal_type:list=News%20Item&b_start:int=0&sort_on=effective&sort_order=descending', inicio=true)

            $('button#filtro-noticia').click(function(e){
                //console.log('CLICADO BOTAO DE LIMPAR');
                // Limpando filtros
                $('#range-start, #range-end').attr('value','');
                $('select#selectedSecretaria').val('');
                searchUrl = '';
                page = '';
                creator = '';
                initialDate = '';
                finalDate = '';
                getNoticias(portal_url + '/@@busca?portal_type:list=News%20Item&b_start:int=0&sort_on=effective&sort_order=descending', inicio=true) 
                e.preventDefault();
             });

            $('input#range-start, input#range-end').on('change', function() {
            
                thisId = $(this).attr('id');
                thisVal = $.datepicker.formatDate('yy/mm/dd', $(this).datepicker('getDate'));
                /*
               if (thisVal) {
                    if (thisId == 'range-start') {
                        initialDate = '&EffectiveDate.query:record:list:date=' + thisVal + '&EffectiveDate.range:record=min';
                        appendQuery(initialDate);
                    } else {
                        finalDate = '&EffectiveDate.query:record:list:date=' + thisVal + ' 23:59:59&EffectiveDate.range:record=min:max';
                        appendQuery(finalDate);
                    }
                }
               */ 
               if (thisVal) {
                    if (thisId == 'range-start') {
                        initialDate = '&effective.query:record:list:date=' + thisVal + '&effective.range:record=min';
                        appendQuery(initialDate);
                    } else {
                        finalDate = '&effective.query:record:list:date=' + thisVal + ' 23:59:59&effective.range:record=min:max';
                        appendQuery(finalDate);
                    }
                }

            });

            function appendQuery() {
                (typeof page === 'undefined') ? page = 'b_start:int=0&' : page = page;
                (typeof creator === 'undefined') ? creator = '' : creator = creator;
                (typeof initialDate === 'undefined') ? initialDate = '' : initialDate = initialDate;
                (typeof finalDate === 'undefined') ? finalDate = '' : finalDate = finalDate;
                searchUrl = portal_url + '/@@busca?';
                queryString = searchUrl + page + creator + initialDate + finalDate + '&sort_on=effective&sort_order=descending&portal_type%3Alist=News+Item';
                getNoticias(queryString, inicio=false);
            }

            function getNoticias (queryString, inicio) {
                $.ajax({url: queryString, success: function(result){
                    results = $(result).find('.searchResults a');
                    batch = formataPaginacao(result);
                    $('.proximo', batch).text('»');
                    $('.anterior', batch).text('«');
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
                    results = formatNewsTile(noticias, inicio, queryString);
                    $('div.lista-noticias').html(results).append(batch);
                }})
            }

            function formataPaginacao(result, inicio, queryString) {
                paginacao = $(result).find('.paginacao')
                $(paginacao).find('li span').addClass('ativo');
              /*  page = $(result).find('.searchResults').attr('class').slice(-1);
                page = 'b_start:int=' + ((parseInt(page) -1) * 10) + '&';
                primeira = '<li><a class="primeira" href="'+queryString+'">Primeira</a></li>';
                queryString = searchUrl + page + creator + initialDate + finalDate + '&portal_type%3Alist=News+Item';
                console.log("Query string utilizada: " + queryString);
                ultima = '<li><a class="ultima" href="'+queryString+'">Última</a></li>';
*/
               page = 'b_start:int=0&';
               if (inicio) {
                   queryString = searchUrl + page + creator + initialDate + finalDate + '&portal_type%3Alist=News+Item';
                   primeira = '<li><a class="primeira" href="'+queryString+'">Primeira</a></li>';
               } else {
                   queryString = portal_url + '/@@busca?' + page + '&portal_type%3Alist=News+Item';
                   primeira = '<li><a class="primeira" href="'+queryString+'">Primeira</a></li>';
               } 

                
                var penultimo = paginacao.find("li:nth-last-child(2) a").attr("href");
                ultima = '<li><a class="ultima" href="'+penultimo+'">Última</a></li>';
                $(paginacao).prepend(primeira).append(ultima);

                return paginacao
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
                $('div.portalchamada-item img, .bannerInfo p').each(function(){
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
        tempo = 8000;
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
