{{-- This file is used for menu items by any Backpack v6 theme --}}
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('dashboard') }}"><i class="la la-home nav-icon"></i> {{ trans('backpack::base.dashboard') }}</a></li>

<x-backpack::menu-item title="Users" icon="la la-question" :link="backpack_url('user')" />
<x-backpack::menu-item title="Services" icon="la la-question" :link="backpack_url('services')" />
<x-backpack::menu-item title="Requests" icon="la la-question" :link="backpack_url('request')" />
<x-backpack::menu-item title="Ratings" icon="la la-question" :link="backpack_url('ratings')" />