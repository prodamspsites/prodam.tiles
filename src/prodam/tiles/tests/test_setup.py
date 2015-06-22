# -*- coding: utf-8 -*-
from prodam.tiles.config import PROJECTNAME
from prodam.tiles.testing import INTEGRATION_TESTING

import unittest


DEPENDENCIES = [
    'collective.cover',
    'collective.nitf',
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
