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
