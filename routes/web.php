<?php

use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\File\FileUploadController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\Place\PlaceConceptCategory;
use App\Http\Controllers\Admin\Place\PlaceCuisineCategory;
use App\Http\Controllers\Admin\PlaceController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Middleware\AdminUserMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('auth/login', [AuthController::class, 'login'])->name('auth.login');
Route::post('auth/do-login', [AuthController::class, 'doLogin'])->name('auth.doLogin');
Route::get('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

Route::middleware(AdminUserMiddleware::class)->group(function(){
    Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // File uploader view
    Route::controller(FileUploadController::class)->group(function (){
        Route::get('file-upload', 'index')->name('admin.file.upload');
        Route::post('file-upload', 'makeRequest')->name('admin.file.uploadRequest');
    });

    Route::controller(PlaceCuisineCategory::class)->group(function (){
        Route::get('/places/categories/cuisine', 'collection')->name('admin.categories.place_cuisine.collection');
        Route::get('/places/categories/cuisine/edit/{id}', 'edit')->name('admin.categories.place_cuisine.edit');
        Route::get('/places/categories/cuisine/post', 'add')->name('admin.categories.place_cuisine.add');
    });

    Route::controller(PlaceConceptCategory::class)->group(function (){
        Route::get('/places/categories/concept', 'collection')->name('admin.categories.place_concept.collection');
        Route::get('/places/categories/concept/edit/{id}', 'edit')->name('admin.categories.place_concept.edit');
        Route::get('/places/categories/concept/post', 'add')->name('admin.categories.place_concept.add');
    });

    Route::controller(PlaceController::class)->group(function(){
        Route::get('/places', 'index')->name('admin.places.index');
        Route::get('/places/photos/{uuid}', 'photos')->name('admin.places.photos');
        Route::get('/places/add-photo/{uuid}', 'addPhoto')->name('admin.places.addPhoto');
        Route::get('/places/add', 'add')->name('admin.places.add');
        Route::get('/places/edit/{uuid}', 'edit')->name('admin.places.edit');
        Route::get('/places/delete/{uuid}', 'delete')->name('admin.places.delete');
        Route::get('/places/delete-photo/{uuid}', 'deletePhoto')->name('admin.places.deletePhoto');
        Route::get('/places/delete-hour/{place_uuid}/{uuid}', 'deleteHour')->name('admin.places.deleteHour');
        Route::get('/places/delete-account/{uuid}', 'deleteAccount')->name('admin.places.deleteAccount');
        Route::post('/places/add', 'addPost')->name('admin.places.addPost');
        Route::post('/places/add-photo', 'addPhotoPost')->name('admin.places.addPhotoPost');
        Route::post('/places/edit', 'editPost')->name('admin.places.editPost');
        Route::get('/places/search', 'search')->name('admin.places.search');

        Route::get('/places/categories', 'categories')->name('admin.places.categories');

        Route::get('/places/add-category', 'addCategory')->name('admin.places.addCategory');
        Route::get('/places/edit-category/{uuid}', 'editCategory')->name('admin.places.editCategory');
        Route::get('/places/delete-category/{uuid}', 'deleteCategory')->name('admin.places.deleteCategory');
        Route::post('/places/add-category', 'addPostCategory')->name('admin.places.addPostCategory');
        Route::post('/places/edit-category', 'editPostCategory')->name('admin.places.editPostCategory');

        Route::get('/places/types', 'types')->name('admin.places.types');
        Route::get('/places/add-type', 'addType')->name('admin.places.addType');
        Route::get('/places/edit-type/{uuid}', 'editType')->name('admin.places.editType');
        Route::get('/places/delete-type/{uuid}', 'deleteType')->name('admin.places.deleteType');
        Route::post('/places/add-type', 'addPostType')->name('admin.places.addPostType');
        Route::post('/places/edit-type', 'editPostType')->name('admin.places.editPostType');

        Route::get('/places/tags', 'tags')->name('admin.places.tags');
        Route::get('/places/add-tag', 'addTag')->name('admin.places.addTag');
        Route::get('/places/edit-tag/{uuid}', 'editTag')->name('admin.places.editTag');
        Route::get('/places/delete-tag/{uuid}', 'deleteTag')->name('admin.places.deleteTag');
        Route::post('/places/add-tag', 'addPostTag')->name('admin.places.addPostTag');
        Route::post('/places/edit-tag', 'editPostTag')->name('admin.places.editPostTag');

        Route::get('/places/photo-categories', 'photoCategories')->name('admin.places.photoCategories');
        Route::get('/places/add-photo-category', 'addPhotoCategory')->name('admin.places.addPhotoCategory');
        Route::get('/places/edit-photo-category/{uuid}', 'editPhotoCategory')->name('admin.places.editPhotoCategory');
        Route::get('/places/delete-photo-category/{uuid}', 'deletePhotoCategory')->name('admin.places.deletePhotoCategory');
        Route::post('/places/add-photo-category', 'addPostPhotoCategory')->name('admin.places.addPostPhotoCategory');
        Route::post('/places/edit-photo-category', 'editPostPhotoCategory')->name('admin.places.editPostPhotoCategory');
    });

    Route::controller(ProductController::class)->group(function(){
        Route::get('/products', 'index')->name('admin.products.index');
        Route::get('/products/add', 'add')->name('admin.products.add');
        Route::get('/products/ajax', 'ajax')->name('admin.products.ajax');
        Route::get('/products/edit/{uuid}', 'edit')->name('admin.products.edit');
        Route::get('/products/delete/{uuid}', 'delete')->name('admin.products.delete');
        Route::post('/products/add', 'addPost')->name('admin.products.addPost');
        Route::post('/products/edit', 'editPost')->name('admin.products.editPost');
        Route::get('/products/delete-photo/{uuid}', 'deletePhoto')->name('admin.products.deletePhoto');
        Route::get('/products/delete-option/{uuid}', 'deleteOption')->name('admin.products.deleteOption');
        Route::get('/products/search', 'search')->name('admin.products.search');

        Route::get('/products/categories', 'categories')->name('admin.products.categories');
        Route::get('/products/add-category', 'addCategory')->name('admin.products.addCategory');
        Route::get('/products/edit-category/{uuid}', 'editCategory')->name('admin.products.editCategory');
        Route::get('/products/delete-category/{uuid}', 'deleteCategory')->name('admin.products.deleteCategory');
        Route::post('/products/add-category', 'addProductCategory')->name('admin.products.addProductCategory');
        Route::post('/products/edit-category', 'editProductCategory')->name('admin.products.editProductCategory');

        Route::get('/products/types', 'types')->name('admin.products.types');
        Route::get('/products/add-type', 'addType')->name('admin.products.addType');
        Route::get('/products/edit-type/{uuid}', 'editType')->name('admin.products.editType');
        Route::get('/products/delete-type/{uuid}', 'deleteType')->name('admin.products.deleteType');
        Route::post('/products/add-type', 'addProductType')->name('admin.products.addProductType');
        Route::post('/products/edit-type', 'editProductType')->name('admin.products.editProductType');

        Route::get('/products/tags', 'tags')->name('admin.products.tags');
        Route::get('/products/add-tag', 'addTag')->name('admin.products.addTag');
        Route::get('/products/edit-tag/{uuid}', 'editTag')->name('admin.products.editTag');
        Route::get('/products/delete-tag/{uuid}', 'deleteTag')->name('admin.products.deleteTag');
        Route::post('/products/add-tag', 'addProductTag')->name('admin.products.addProductTag');
        Route::post('/products/edit-tag', 'editProductTag')->name('admin.products.editProductTag');
    });

    Route::controller(CategoryController::class)->group(function(){
        Route::get('/categories', 'index')->name('admin.categories.index');
        Route::get('/categories/add', 'add')->name('admin.categories.add');
        Route::get('/categories/edit/{uuid}', 'edit')->name('admin.categories.edit');
        Route::get('/categories/delete/{uuid}', 'delete')->name('admin.categories.delete');
        Route::post('/categories/add', 'addPost')->name('admin.categories.addPost');
        Route::post('/categories/edit', 'editPost')->name('admin.categories.editPost');

    });

    Route::controller(AccountController::class)->group(function(){
        Route::get('/accounts', 'index')->name('admin.accounts.index');
        Route::get('/accounts/add', 'add')->name('admin.accounts.add');
        Route::get('/accounts/edit/{uuid}', 'edit')->name('admin.accounts.edit');
        Route::get('/accounts/delete/{uuid}', 'delete')->name('admin.accounts.delete');
        Route::post('/accounts/add', 'addPost')->name('admin.accounts.addPost');
        Route::post('/accounts/edit', 'editPost')->name('admin.accounts.editPost');
    });

    Route::controller(NotificationController::class)->group(function(){
        Route::get('/sms', 'sms')->name('admin.notifications.sms');
        Route::get('/add-sms', 'addSms')->name('admin.notifications.addSms');
        Route::get('/edit-sms', 'editSms')->name('admin.notifications.editSms');
        Route::post('/add-sms', 'addPostSms')->name('admin.notifications.addPostSms');
        Route::get('/push', 'push')->name('admin.notifications.push');
        Route::get('/add-push', 'addPush')->name('admin.notifications.addPush');
        Route::get('/edit-push', 'editPush')->name('admin.notifications.editPush');
        Route::post('/add-push', 'addPostPush')->name('admin.notifications.addPostPush');
        Route::get('/mail', 'mail')->name('admin.notifications.mail');
        Route::get('/add-mail', 'addMail')->name('admin.notifications.addMail');
        Route::get('/edit-mail', 'editMail')->name('admin.notifications.editMail');
        Route::post('/add-mail', 'addPostMail')->name('admin.notifications.addPostMail');
    });
});
