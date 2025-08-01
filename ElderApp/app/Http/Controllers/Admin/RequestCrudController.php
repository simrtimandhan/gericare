<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\RequestRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class RequestCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class RequestCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    // use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    // use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        CRUD::setModel(\App\Models\Request::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/request');
        CRUD::setEntityNameStrings('request', 'requests');
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        CRUD::setFromDb(); // set columns from db columns.

        /**
         * Columns can be defined using the fluent syntax:
         * - CRUD::column('price')->type('number');
         */
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(RequestRequest::class);
        CRUD::setFromDb(); // set fields from db columns.

        /**
         * Fields can be defined using the fluent syntax:
         * - CRUD::field('price')->type('number');
         */
    }

    protected function setupShowOperation()
    {
        // Show helper's name
        $this->crud->addColumn([
            'name' => 'helper_id',
            'label' => 'Helper Name',
            'type' => 'select',
            'entity' => 'helper',
            'attribute' => 'first_name', // or full_name if available
            'model' => "App\Models\User",
        ]);
    
        // Show elder's name
        $this->crud->addColumn([
            'name' => 'elder_id',
            'label' => 'Elder Name',
            'type' => 'select',
            'entity' => 'elder',
            'attribute' => 'first_name',
            'model' => "App\Models\User",
        ]);

        $this->crud->addColumn([
            'name' => 'service_id',
            'label' => 'Service Name',
            'type' => 'select',
            'entity' => 'service',
            'attribute' => 'service_name',
            'model' => "App\Models\Services",
        ]);

        $this->crud->setFromDb();

    
        // Optional: load other fields automatically from DB
        // $this->crud->setFromDb();
    }

    /**
     * Define what happens when the Update operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-update
     * @return void
     */
    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }
}
