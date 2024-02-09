@extends('layouts.guest')

@section('content')
<div class="page page-center">
    <div class="container container-tight py-4">
        <div class="text-center mb-4">
            <a href="." class="navbar-brand navbar-brand-autodark"><img src="{{ asset('img/logo-bg.png') }}" height="36"
                    alt="" /></a>
        </div>
        <div class="card card-md">
            <div class="card-body">
                <h2 class="h2 text-center mb-4">Masuk untuk mulai menggunakan</h2>
                @if ($errors->any())
                <div class="alert alert-danger border-left-danger" role="alert">
                    <ul class="pl-4 my-2">
                        @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
                @endif
                <form method="POST" action="{{ route('login.authenticate') }}">
                    @csrf
                    <div class="mb-3">
                        <label class="form-label">Username</label>
                        <input name="username" type="text" class="form-control" maxlength="150"
                            placeholder="Username Anda" autocomplete="off" value="{{ old('username') }}" />
                    </div>
                    <div class="mb-2">
                        <label class="form-label">Password</label>

                        <div class="input-group input-group-flat">
                            <input type="password" class="form-control" name="password" id="password"
                                placeholder="Password Anda" autocomplete="off">
                            <span class="input-group-text">
                                <a role="button" class="input-group-link" id="show-password">Show password</a>
                            </span>
                        </div>
                    </div>
                    <div class="mb-2">
                        <label class="form-check">
                            <input type="checkbox" name="remember" class="form-check-input" />
                            <span class="form-check-label">Simpan akun ini pada perangkat ini.</span>
                        </label>
                    </div>
                    <div class="form-footer">
                        <button type="submit" class="btn btn-primary w-100">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('script')
<script src="{{ asset('pages/login.js') }}"></script>
@endpush