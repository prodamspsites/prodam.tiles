# -*- coding: utf-8 -*-
from plone.registry.interfaces import IRegistry
from prodam.tiles.config import PROJECTNAME
from prodam.tiles.testing import INTEGRATION_TESTING
from zope.component import getUtility

import unittest


DEPENDENCIES = [
    'collective.cover',
]
TILES = [
    'carrossel',
]


class InstallTestCase(unittest.TestCase):

    layer = INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        self.qi = self.portal['portal_quickinstaller']

    def test_installed(self):
        self.assertTrue(self.qi.isProductInstalled(PROJECTNAME),
                        '%s not installed' % PROJECTNAME)

    def test_dependencies(self):
        for p in DEPENDENCIES:
            self.assertTrue(self.qi.isProductInstalled(p),
                            '%s not installed' % p)

    def test_tiles(self):
        self.registry = getUtility(IRegistry)
        registered_tiles = self.registry['plone.app.tiles']
        for tile in TILES:
            self.assertIn(tile, registered_tiles)
