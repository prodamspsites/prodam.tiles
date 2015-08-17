# -*- coding: utf-8 -*-

from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from collective.cover.tiles.collection import CollectionTile
from collective.cover.tiles.collection import ICollectionTile


class ICollectionTile(ICollectionTile):
    pass


class CollectionTile(CollectionTile):
    index = ViewPageTemplateFile('templates/collection.pt')

    def hasImage(self, item):
        if item.getObject().image:
            return True
        else:
            return False
