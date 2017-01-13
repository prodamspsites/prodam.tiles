# -*- coding: utf-8 -*-

from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from collective.cover.tiles.collection import CollectionTile
from collective.cover.tiles.collection import ICollectionTile
from prodam.tiles import _
from zope import schema


class ICollectionTile(ICollectionTile):

    footer_link = schema.TextLine(
        title=_(u'Footer link'),
        required=False,
    )


class CollectionTile(CollectionTile):
    index = ViewPageTemplateFile('templates/collection.pt')

    def getFooterLink(self):
        if self.data.get('footer_link', None):
            return self.data.get('footer_link', None)
        else:
            return False

    def hasImage(self, item):
        if item.getObject().image:
            return True
        else:
            return False

    """
Função abaixo foi feita para atendimento do requisito 5.6 da SS26869:
5.6.	Incluir descrição do vídeo do YouTube na sessão “SÃO PAULO NA TV”

Para tanto, o sistema consulta uma API do Youtube, requisitando metadados do video, identificado pela variável 'video_id'.
O acesso da aplicação á API depende de uma chave de acesso, identificado na função abaixo pela variável 'api_key'.
Esta chave de acesso pode ser  gerada no site https://console.developers.google.com/.
 

    
    
    def getDescriptionVideo(self, obj):
        import json, requests
        try:
            desc_atual = obj.Description()
            #return desc_atual
            if len(desc_atual) == 0:
                video_id = obj.getObject().docId
                api_key = 'AIzaSyCz5vsQW9b60WheYfW8OBD5VQaHYObFGXM'
                print('ACESSANDO API DO YOUTUBE PARA ACESSO AOS METADADOS DO VIDEO: ' + video_id)
                r = requests.get('https://www.googleapis.com/youtube/v3/videos?id=' + video_id  + '&key=' + api_key  +  '&part=snippet')
                j = r.json()
                for i in j['items']:
                    description = i['snippet']['description']
                    # TODO: Criar um campo novo no tipo de conteudo 'Google Video'
                    obj.setDescription(description)
                    obj.getObject().reindexObject()
                    return description
            else:
                return desc_atual
        except:
            print('NAO FOI POSSIVEL A REQUISICAO')
            return obj.Description()
    """
