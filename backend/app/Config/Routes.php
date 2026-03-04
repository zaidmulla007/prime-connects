<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// OPTIONS preflight (CORS) — must be first
$routes->options('(:any)', 'Preflight::handle');

// -----------------------------------------------
// Auth
// -----------------------------------------------
$routes->post('api/auth/login', 'Auth::login');

// -----------------------------------------------
// Public endpoints (no auth)
// -----------------------------------------------
$routes->get('api/public/products',              'Public\Products::index');
$routes->get('api/public/products/slug/(:segment)', 'Public\Products::showBySlug/$1');

$routes->get('api/public/categories',            'Public\Categories::index');
$routes->get('api/public/categories/slug/(:segment)', 'Public\Categories::showBySlug/$1');

$routes->get('api/public/banners/active',        'Public\Banners::active');

$routes->post('api/public/inquiries',            'Public\Inquiries::create');

$routes->get('api/public/projects',              'Public\Projects::index');
$routes->get('api/public/project-videos',        'Public\ProjectVideos::index');
$routes->get('api/public/certificates',          'Public\Certificates::index');

// -----------------------------------------------
// Protected endpoints (JWT required)
// -----------------------------------------------
$routes->group('api', ['filter' => 'jwtAuth'], function ($routes) {

    // Me (own profile)
    $routes->get('me',              'Api\Me::show');
    $routes->put('me',              'Api\Me::update');
    $routes->put('me/password',     'Api\Me::changePassword');

    // Users [Admin only]
    $routes->group('users', ['filter' => 'adminOnly'], function ($routes) {
        $routes->get('',            'Api\Users::index');
        $routes->post('',           'Api\Users::create');
        $routes->get('(:num)',      'Api\Users::show/$1');
        $routes->put('(:num)',      'Api\Users::update/$1');
        $routes->delete('(:num)',   'Api\Users::delete/$1');
    });

    // Products
    $routes->get('products',                     'Api\Products::index');
    $routes->post('products',                    'Api\Products::create');
    $routes->get('products/(:num)',              'Api\Products::show/$1');
    $routes->put('products/(:num)',              'Api\Products::update/$1');
    $routes->delete('products/(:num)',           'Api\Products::delete/$1');

    // Product Images
    $routes->get('products/(:num)/images',       'Api\ProductMedia::index/$1');
    $routes->post('products/(:num)/images/batch','Api\ProductMedia::uploadBatch/$1');
    $routes->post('products/(:num)/images/(:num)/delete', 'Api\ProductMedia::delete/$1/$2');

    // Product Specs
    $routes->get('products/(:num)/specs',        'Api\ProductSpecs::index/$1');
    $routes->post('products/(:num)/specs',       'Api\ProductSpecs::create/$1');
    $routes->put('products/(:num)/specs/(:num)', 'Api\ProductSpecs::update/$1/$2');
    $routes->delete('products/(:num)/specs/(:num)', 'Api\ProductSpecs::delete/$1/$2');

    // Categories
    $routes->get('categories',                   'Api\Categories::index');
    $routes->post('categories',                  'Api\Categories::create');
    $routes->get('categories/(:num)',            'Api\Categories::show/$1');
    $routes->post('categories/(:num)/update',    'Api\Categories::update/$1');
    $routes->delete('categories/(:num)',         'Api\Categories::delete/$1');
    $routes->post('categories/(:num)/reorder',   'Api\Categories::reorder/$1');

    // Banners
    $routes->get('banners',                      'Api\Banners::index');
    $routes->post('banners',                     'Api\Banners::create');
    $routes->get('banners/(:num)',               'Api\Banners::show/$1');
    $routes->put('banners/(:num)',               'Api\Banners::update/$1');
    $routes->delete('banners/(:num)',            'Api\Banners::delete/$1');

    // Inquiries
    $routes->get('inquiries',                    'Api\Inquiries::index');
    $routes->get('inquiries/(:num)',             'Api\Inquiries::show/$1');
    $routes->post('inquiries/(:num)/read',       'Api\Inquiries::markRead/$1');
    $routes->delete('inquiries/(:num)',          'Api\Inquiries::delete/$1');

    // Projects
    $routes->get('projects',                     'Api\Projects::index');
    $routes->post('projects',                    'Api\Projects::create');
    $routes->get('projects/(:num)',              'Api\Projects::show/$1');
    $routes->put('projects/(:num)',              'Api\Projects::update/$1');
    $routes->delete('projects/(:num)',           'Api\Projects::delete/$1');

    // Project Videos
    $routes->get('project-videos',               'Api\ProjectVideos::index');
    $routes->post('project-videos',              'Api\ProjectVideos::create');
    $routes->get('project-videos/(:num)',         'Api\ProjectVideos::show/$1');
    $routes->put('project-videos/(:num)',         'Api\ProjectVideos::update/$1');
    $routes->delete('project-videos/(:num)',      'Api\ProjectVideos::delete/$1');

    // Certificates
    $routes->get('certificates',                 'Api\Certificates::index');
    $routes->post('certificates',                'Api\Certificates::create');
    $routes->get('certificates/(:num)',          'Api\Certificates::show/$1');
    $routes->put('certificates/(:num)',          'Api\Certificates::update/$1');
    $routes->delete('certificates/(:num)',       'Api\Certificates::delete/$1');
});
