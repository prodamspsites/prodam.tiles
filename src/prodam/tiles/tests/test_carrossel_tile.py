# -*- coding: utf-8 -*-
from collective.cover.testing import ALL_CONTENT_TYPES
from collective.cover.tests.base import TestTileMixin
from collective.cover.tiles.base import IPersistentCoverTile
from collective.cover.widgets.textlinessortable import TextLinesSortableWidget
from plone.app.testing import TEST_USER_ID
from plone.app.testing import setRoles
from plone.tiles.interfaces import ITileDataManager
from plone.uuid.interfaces import IUUID
from prodam.tiles.testing import INTEGRATION_TESTING
from prodam.tiles.tiles.carrossel import ICarrosselTile
from prodam.tiles.tiles.carrossel import UUIDSFieldDataConverter
from zope.component import getMultiAdapter

import unittest


class CarrosselTileTestCase(TestTileMixin, unittest.TestCase):

    layer = INTEGRATION_TESTING

    def setUp(self):
        self.portal = self.layer['portal']
        setRoles(self.portal, TEST_USER_ID, ['Manager'])
        self.request = self.layer['request']
        self.name = u'carrossel'
        self.portal.invokeFactory('collective.cover.content', 'frontpage')
        self.cover = self.portal['frontpage']
        self.tile = getMultiAdapter((self.cover, self.request), name=self.name)
        self.tile = self.tile['test']

    def _update_tile_data(self):
        # tile's data attribute is cached; reinstantiate it
        self.tile = self.cover.restrictedTraverse(
            '@@{0}/{1}'.format(str(self.tile.__name__), str(self.tile.id)))

    @unittest.expectedFailure  # FIXME: raises BrokenImplementation
    def test_interface(self):
        self.assertTrue(IPersistentCoverTile.implementedBy(ICarrosselTile))

    def test_default_configuration(self):
        self.assertTrue(self.tile.is_configurable)
        self.assertTrue(self.tile.is_droppable)
        self.assertTrue(self.tile.is_editable)

    def test_accepted_content_types(self):
        self.assertEqual(self.tile.accepted_ct(), ALL_CONTENT_TYPES)

    def test_tile_is_empty(self):
        self.assertTrue(self.tile.is_empty())

    def test_autoplay(self):
        # autoplay is True when tile is empty
        self.assertTrue(self.tile.autoplay())
        # but Galleria init code is not rendered
        self.assertNotIn('options.autoplay = true', self.tile())
        obj = self.portal['my-image']
        self.tile.populate_with_object(obj)
        self.assertIn('options.autoplay = true', self.tile())
        data_mgr = ITileDataManager(self.tile)
        data = data_mgr.get()
        data['autoplay'] = False
        data_mgr.set(data)
        self._update_tile_data()
        self.assertFalse(self.tile.autoplay())
        self.assertIn('options.autoplay = false', self.tile())

    def test_crud(self):
        # we start with an empty tile
        self.assertTrue(self.tile.is_empty())

        # now we add a couple of objects to the list
        obj2 = self.portal['my-image']

        self.tile.populate_with_object(obj2)

        self._update_tile_data()

        self.assertEqual(len(self.tile.results()), 1)
        self.assertIn(obj2, self.tile.results())

        # next, we replace the list of objects with a different one
        obj3 = self.portal['my-image1']
        self.tile.replace_with_objects([IUUID(obj3, None)])
        self._update_tile_data()
        self.assertNotIn(obj2, self.tile.results())
        self.assertIn(obj3, self.tile.results())

        # finally, we remove it from the list; the tile must be empty again
        self.tile.remove_item(obj3.UID())
        self._update_tile_data()
        self.assertTrue(self.tile.is_empty())

    def test_internal_structure(self):
        # we start with an empty tile
        self.assertTrue(self.tile.is_empty())
        uuids = ITileDataManager(self.tile).get().get('uuids', None)

        self.assertIsNone(uuids)

        # now we add an image
        obj1 = self.portal['my-image']

        self.tile.populate_with_object(obj1)

        uuids = ITileDataManager(self.tile).get().get('uuids', None)

        # self.assertTrue(isinstance(uuids, dict))
        self.assertTrue(len(uuids) == 1)
        self.assertTrue(uuids[obj1.UID()]['order'] == u'0')

        # now we add a second image
        obj2 = self.portal['my-image1']

        self.tile.populate_with_object(obj2)

        uuids = ITileDataManager(self.tile).get().get('uuids', None)

        # self.assertTrue(isinstance(uuids, dict))
        self.assertTrue(len(uuids) == 2)
        self.assertTrue(uuids[obj1.UID()]['order'] == u'0')
        self.assertTrue(uuids[obj2.UID()]['order'] == u'1')

    def test_custom_title(self):
        # we start with an empty tile
        self.assertTrue(self.tile.is_empty())
        uuids = ITileDataManager(self.tile).get().get('uuids', None)

        self.assertIsNone(uuids)

        # now we 2 elements
        obj1 = self.portal['my-document']
        obj2 = self.portal['my-image']

        self.tile.populate_with_uids([
            obj1.UID(), obj2.UID()
        ])

        # For obj2 we will assign a custom_title

        uuids = ITileDataManager(self.tile).get().get('uuids', None)
        uuids[obj2.UID()]['custom_title'] = u'New Title'

        title1 = self.tile.get_title(obj1)
        title2 = self.tile.get_title(obj2)

        # Document object should be the same as Title
        self.assertEqual(title1, obj1.Title())
        # First image should return the custom Title
        self.assertEqual(title2, u'New Title')

    def test_custom_description(self):
        # we start with an empty tile
        self.assertTrue(self.tile.is_empty())
        uuids = ITileDataManager(self.tile).get().get('uuids', None)

        self.assertIsNone(uuids)

        # now we 2 elements
        obj1 = self.portal['my-document']
        obj2 = self.portal['my-image']

        self.tile.populate_with_uids([
            obj1.UID(), obj2.UID()
        ])

        # For obj2 we will assign a custom_description

        uuids = ITileDataManager(self.tile).get().get('uuids', None)
        uuids[obj2.UID()]['custom_description'] = u'New Description'

        description1 = self.tile.get_description(obj1)
        description2 = self.tile.get_description(obj2)

        # Document object should be the same as Description
        self.assertEqual(description1, obj1.Description())
        # First image should return the custom URL
        self.assertEqual(description2, u'New Description')

    def test_custom_url(self):
        # we start with an empty tile
        self.assertTrue(self.tile.is_empty())
        uuids = ITileDataManager(self.tile).get().get('uuids', None)

        self.assertIsNone(uuids)

        # now we 3 elements
        obj1 = self.portal['my-document']
        obj2 = self.portal['my-image']
        obj3 = self.portal['my-image1']

        self.tile.populate_with_uids([
            obj1.UID(), obj2.UID(), obj3.UID()
        ])

        # For obj2 we will assign a custom_url

        uuids = ITileDataManager(self.tile).get().get('uuids', None)
        uuids[obj2.UID()]['custom_url'] = u'http://www.custom_url.com'

        url1 = self.tile.get_url(obj1)
        url2 = self.tile.get_url(obj2)
        url3 = self.tile.get_url(obj3)

        # Document object should be the same as absolute_url
        self.assertEqual(url1, obj1.absolute_url())
        # First image should return the custom URL
        self.assertEqual(url2, u'http://www.custom_url.com')
        # And second image should have the absolute_url and /view
        self.assertEqual(url3, u'%s/view' % obj3.absolute_url())

    def test_data_converter(self):
        field = ICarrosselTile['uuids']
        widget = TextLinesSortableWidget(self.request)
        conv = UUIDSFieldDataConverter(field, widget)

        value = {
            u'uuid1': {u'order': u'0'},
            u'uuid2': {u'order': u'2'},
            u'uuid3': {u'order': u'1'},
        }

        to_widget = conv.toWidgetValue(value)
        self.assertEqual(to_widget, u'uuid1\r\nuuid3\r\nuuid2')

        to_field = conv.toFieldValue(value)

        self.assertEqual(to_field, value)
        self.assertEqual(conv.toFieldValue({}), conv.field.missing_value)
