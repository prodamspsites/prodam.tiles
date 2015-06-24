# -*- coding: utf-8 -*-
from PIL import Image
from StringIO import StringIO
from plone.app.robotframework.testing import AUTOLOGIN_LIBRARY_FIXTURE
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import PloneSandboxLayer
from plone.testing import z2

import random


def generate_jpeg(width, height):
    # Mandelbrot fractal
    # FB - 201003254
    # drawing area
    xa = -2.0
    xb = 1.0
    ya = -1.5
    yb = 1.5
    maxIt = 25  # max iterations allowed
    # image size
    image = Image.new('RGB', (width, height))
    c = complex(random.random() * 2.0 - 1.0, random.random() - 0.5)

    for y in range(height):
        zy = y * (yb - ya) / (height - 1) + ya
        for x in range(width):
            zx = x * (xb - xa) / (width - 1) + xa
            z = complex(zx, zy)
            for i in range(maxIt):
                if abs(z) > 2.0:
                    break
                z = z * z + c
            r = i % 4 * 64
            g = i % 8 * 32
            b = i % 16 * 16
            image.putpixel((x, y), b * 65536 + g * 256 + r)

    output = StringIO()
    image.save(output, format='PNG')
    return output


class Fixture(PloneSandboxLayer):

    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        import Products.PloneFormGen
        self.loadZCML(package=Products.PloneFormGen)
        z2.installProduct(app, 'Products.PloneFormGen')
        # Load ZCML
        import collective.cover
        self.loadZCML(package=collective.cover)
        if 'virtual_hosting' not in app.objectIds():
            # If ZopeLite was imported, we have no default virtual
            # host monster
            from Products.SiteAccess.VirtualHostMonster \
                import manage_addVirtualHostMonster
            manage_addVirtualHostMonster(app, 'virtual_hosting')
        import prodam.tiles
        self.loadZCML(package=prodam.tiles)

    def setUpPloneSite(self, portal):
        # Install into Plone site using portal_setup
        self.applyProfile(portal, 'collective.cover:default')
        self.applyProfile(portal, 'collective.cover:testfixture')
        self.applyProfile(portal, 'prodam.tiles:default')
        portal['my-image'].setImage(generate_jpeg(50, 50))
        portal['my-image'].reindexObject()
        portal['my-image1'].setImage(generate_jpeg(50, 50))
        portal['my-image1'].reindexObject()
        portal['my-image2'].setImage(generate_jpeg(50, 50))
        portal['my-image2'].reindexObject()
        portal_workflow = portal.portal_workflow
        portal_workflow.setChainForPortalTypes(['Collection'],
                                               ['plone_workflow'],)

FIXTURE = Fixture()
INTEGRATION_TESTING = IntegrationTesting(
    bases=(FIXTURE,),
    name='prodam.tiles:Integration',
)
FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(FIXTURE,),
    name='prodam.tiles:Functional',
)

ROBOT_TESTING = FunctionalTesting(
    bases=(FIXTURE, AUTOLOGIN_LIBRARY_FIXTURE, z2.ZSERVER_FIXTURE),
    name='prodam.tiles:Robot',
)
