@extends(backpack_view('layouts.vertical_dark'))

@section('content')
    <div class="container-fluid">
        <h2>Grouped Users</h2>

        @foreach($data as $type => $users)
            <div class="card mt-4">
                <div class="card-header">
                    <strong>{{ ucfirst($type) }}</strong>
                </div>
                <div class="card-body table-responsive">
                    @if($users->isEmpty())
                        <p>No users found.</p>
                    @else
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($users as $user)
                                    <tr>
                                        <td><a href="{{ url('admin/users/' . $user->id . '/show') }}">{{ $user->id }}</a></td>
                                        <td>{{ $user->first_name }}</td>
                                        <td>{{ $user->email }}</td>
                                        <td>{{ $user->status }}</td>
                                        
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    @endif
                </div>
            </div>
        @endforeach
    </div>
@endsection
