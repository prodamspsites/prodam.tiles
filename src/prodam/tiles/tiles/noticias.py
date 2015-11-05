# -*- coding: utf-8 -*-

from DateTime import DateTime
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from collections import OrderedDict
from collective.cover.tiles.base import IPersistentCoverTile
from collective.cover.tiles.base import PersistentCoverTile
from collective.cover.tiles.configuration_view import IDefaultConfigureForm
from plone.app.uuid.utils import uuidToObject
from plone.directives import form
from plone.namedfile.field import NamedBlobImage as NamedImage
from plone.tiles.interfaces import ITileDataManager
from plone.tiles.interfaces import ITileType
from plone.uuid.interfaces import IUUID
from prodam.tiles import _
from zope import schema
from zope.component import queryUtility
from zope.schema import getFieldsInOrder


class INoticias(IPersistentCoverTile, form.Schema):

    header = schema.TextLine(
        title=_(u'Header'),
        required=False,
    )

    form.omitted('title')
    form.no_omit(IDefaultConfigureForm, 'title')
    title = schema.TextLine(
        title=_(u'Title'),
        required=False,
    )

    form.omitted('description')
    form.no_omit(IDefaultConfigureForm, 'description')
    description = schema.Text(
        title=_(u'Description'),
        required=False,
    )

    form.omitted('date')
    form.no_omit(IDefaultConfigureForm, 'date')
    date = schema.Datetime(
        title=_(u'Date'),
        required=False,
    )

    form.omitted('image')
    form.no_omit(IDefaultConfigureForm, 'image')
    image = NamedImage(
        title=_(u'Image'),
        required=False,
    )

    # FIXME: this field should be named 'count'
    number_to_show = schema.List(
        title=_(u'Number of items to display'),
        value_type=schema.TextLine(),
        required=False,
    )

    footer = schema.TextLine(
        title=_(u'Footer'),
        required=False,
    )

    uuid = schema.TextLine(
        title=_(u'UUID'),
        readonly=True,
    )


class Noticias(PersistentCoverTile):

    index = ViewPageTemplateFile('templates/noticias.pt')

    is_configurable = True
    is_editable = True
    configured_fields = OrderedDict()

    def get_title(self):
        return self.data['title']

    def results(self):
        self.configured_fields = self.get_configured_fields()

        size_conf = self.configured_fields['number_to_show']

        if size_conf and 'size' in size_conf.keys():
            size = int(size_conf['size'])
        else:
            size = 4

        uuid = self.data.get('uuid', None)
        obj = uuidToObject(uuid)
        if uuid and obj:
            return obj.results(batch=False)[:size]
        else:
            self.remove_relation()
            return []

    def is_empty(self):
        return self.data.get('uuid', None) is None or \
            uuidToObject(self.data.get('uuid')) is None

    def populate_with_object(self, obj):
        super(Noticias, self).populate_with_object(obj)  # check permission

        if obj.portal_type in self.accepted_ct():
            header = obj.Title()  # use collection's title as header
            footer = _(u'More…')  # XXX: can we use field's default?
            uuid = IUUID(obj)

            data_mgr = ITileDataManager(self)
            data_mgr.set({
                'header': header,
                'footer': footer,
                'uuid': uuid,
            })

    def accepted_ct(self):
        """ Return a list of content types accepted by the tile.
        """
        return ['Collection']

    def get_configured_fields(self):
        # Override this method, since we are not storing anything
        # in the fields, we just use them for configuration
        tileType = queryUtility(ITileType, name=self.__name__)
        conf = self.get_tile_configuration()

        fields = getFieldsInOrder(tileType.schema)

        results = OrderedDict()
        for name, obj in fields:
            field = {'title': obj.title}
            if name in conf:
                field_conf = conf[name]
                if ('visibility' in field_conf and field_conf['visibility'] == u'off'):
                    # If the field was configured to be invisible, then just
                    # ignore it
                    continue

                if 'htmltag' in field_conf:
                    # If this field has the capability to change its html tag
                    # render, save it here
                    field['htmltag'] = field_conf['htmltag']

                if 'imgsize' in field_conf:
                    field['scale'] = field_conf['imgsize']

                if 'size' in field_conf:
                    field['size'] = field_conf['size']

            results[name] = field

        return results

    def thumbnail(self, item):
        """Return a thumbnail of an image if the item has an image field and
        the field is visible in the tile.
        :param item: [required]
        :type item: content object
        """
        scale = 'large'  # we need the name only: 'mini'
        scales = item.restrictedTraverse('@@images')
        return scales.scale('image', scale)

    def noticias(self, items):
        noticias = OrderedDict()
        for i in items:
            data = DateTime(i.EffectiveDate())
            month = data.strftime('%b') + '/' + data.strftime('%d')
            title = i.Title() + ':' + '/'.join(i.getObject().getPhysicalPath())
            noticias.setdefault(month, []).append(title)
        return noticias

    def remove_relation(self):
        data_mgr = ITileDataManager(self)
        old_data = data_mgr.get()
        if 'uuid' in old_data:
            old_data.pop('uuid')
        data_mgr.set(old_data)

    def show_header(self):
        return self._field_is_visible('header')

    def collection_url(self):
        uuid = self.data.get('uuid', None)
        obj = uuidToObject(uuid)
        return obj.absolute_url() if obj else ''

    def show_footer(self):
        return self._field_is_visible('footer')
