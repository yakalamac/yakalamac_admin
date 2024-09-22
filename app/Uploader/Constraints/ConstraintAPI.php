<?php

namespace App\Uploader\Constraints;

final readonly class ConstraintAPI
{
    public const BASE_URL = 'https://api.yaka.la';

    /** PLACES */
    public const PLACES = '/places';
    public const PLACE_PHOTOS = '/place/photos';
    public const PLACE_OPTIONS = '/place/option';
    public const PLACE_LOGOS = '/place/logos';
    public const PLACE_COMMENTS = '/place/comments';
    public const PLACE_COMMENT_PHOTOS = '/place/review/photos';
    public const PLACE_VIEWPORTS = '/place/viewports';
    public const PLACE_VIDEOS = '/place/videos';
    public const PLACE_TAX_PLATES = '/place/tax-plates';
    public const PLACE_PLUS_CODES = '/place/plus-codes';
    public const PLACE_OPENING_HOURS = '/place/opening-hours';
    public const PLACE_LOCATIONS = '/place/locations';
    public const PLACE_CONTACTS = '/place/contacts';
    public const PLACE_COMMERICAL_INFORMATIONS = '/place/commerical-informations';
    public const PLACE_ADDRESSES = '/place/addresses';
    public const PLACE_ADDRESS_COMPONENTS = '/place/address/components';

    /** PRODUCTS */
    public const PRODUCTS = '/products';
    public const PRODUCT_PHOTOS = '/product/photos';
    public const PRODUCT_OPTIONS = '/product/option';
    public const PRODUCT_LOGOS = '/product/logos';
    public const PRODUCT_COMMENTS = '/product/comments';
    //reviews
    public const PRODUCT_COMMENT_PHOTOS = '/product/comment/photos';
    //review

    /** CATEGORIES */
    public const ACCOUNT_CATEGORIES = '/category/accounts';
    public const PLACE_CATEGORIES = '/category/places';
    public const PRODUCT_CATEGORIES = '/category/products';

    /** MENUS */
    public const MENUS = '/menus';
    public const MENU_PHOTOS = '/menu/photos';
    public const MENU_OPTIONS = '/menu/option';
    public const MENU_LOGOS = '/menu/logos';
    public const MENU_COMMENTS = '/menu/review';
    // reviews
    public const MENU_COMMENT_PHOTOS = '/menu/comment/photos';
    //review
    /** TAGS */
    public const PLACE_TAGS = '/tag/places';
    public const MENU_TAGS = '/tag/menus';
    public const PRODUCT_TAGS = '/tag/products';
    /** TYPES */

    public const PLACE_TYPES = '/type/places';
    public const PRODUCT_TYPES = '/type/products';
    public const MENU_TYPES = '/type/menus';

    /** SOURCES */
    public const MENU_SOURCES = '/source/menus';
    public const PLACE_SOURCES = '/source/places';
    public const PRODUCT_SOURCES = '/source/products';
}
