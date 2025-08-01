<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\UserRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


/**
 * Class UserCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class UserCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation { store as traitStore; }
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation { update as traitUpdate; }
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        CRUD::setModel(\App\Models\User::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/user');
        CRUD::setEntityNameStrings('user', 'users');
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
       
        CRUD::addColumn([
        'name'  => 'user_type',
        'label' => 'User Type',
        'type'  => 'text',
    ]);
    


    
        CRUD::setFromDb(); // set columns from db columns.

        /**
         * Columns can be defined using the fluent syntax:
         * - CRUD::column('price')->type('number');
         */

    }

    public function groupedList()
    {
        $userTypes = ['elder', 'helper', 'family'];
        $data = [];
        foreach ($userTypes as $type) {
            $data[$type] = User::where('user_type', $type)->get();
        }
        return view('grouped_list', ['data' => $data]);
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(UserRequest::class);
        CRUD::setFromDb(); // set fields from db columns.

        /**
         * Fields can be defined using the fluent syntax:
         * - CRUD::field('price')->type('number');
         */
    }

    public function store()
    {
        $this->crud->setRequest($this->crud->validateRequest());
        $this->crud->setRequest($this->handlePasswordInput($this->crud->getRequest()));
        $this->crud->unsetValidation(); // validation has already been run

        return $this->traitStore();
    }

    public function update()
    {
        $this->crud->setRequest($this->crud->validateRequest());
        $this->crud->setRequest($this->handlePasswordInput($this->crud->getRequest()));
        $this->crud->unsetValidation(); // validation has already been run

        return $this->traitUpdate();
    }

    protected function handlePasswordInput($request)
    {
        // Remove fields not present on the user.
        $request->request->remove('password_confirmation');
        $request->request->remove('roles_show');
        $request->request->remove('permissions_show');

        // Encrypt password if specified.
        if ($request->input('password')) {
            $request->request->set('password', Hash::make($request->input('password')));
        } else {
            $request->request->remove('password');
        }

        return $request;
    }

    protected function setupShowOperation()
    {
        $this->crud->addColumn([
            'name'  => 'recent_photo',
            'label' => 'Photo',
            'type'  => 'image',
            'prefix' => 'storage/',
            'height' => '100px',
            'width'  => '100px',
        ]);

        $this->crud->setFromDb();
    }



    /**
     * Define what happens when the Update operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-update
     * @return void
     */
    protected function setupUpdateOperation()
    {
        $this->crud->addField([
            'name'  => 'status', // the database field name
            'label' => 'Status', // the label shown in the form
            'type'  => 'select_from_array', // type of field for a dropdown
            'options' => [
                'active'   => 'active',
                'inactive' => 'inactive',
            ],
        ]);
        $this->crud->addField([
            'name'  => 'user_type', // the database field name
            'label' => 'User Type', // the label shown in the form
            'type'  => 'select_from_array', // type of field for a dropdown
            'options' => [
                'elder'   => 'elder',
                'helper' => 'helper',
                'family' => 'family',
            ],
        ]);
        $this->crud->addField([
            'name' => 'latitude',
            'label' => 'Latitude',
            'type' => 'number',
            'attributes' => [
                'step' => '0.0000001',
            ],
            'allows_null' => true,
            'default' => 0,
            'nullable' => true,
        ]);

        $this->crud->addField([
            'name' => 'longitude',
            'label' => 'Longitude',
            'type' => 'number',
            'attributes' => [
                'step' => '0.0000001',
            ],
            'allows_null' => true,
            'default' => 0,
            'nullable' => true,
        ]);
        $this->setupCreateOperation();

    }
}
