<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>@yield('title', 'Sign In')</title>
    <link rel="shortcut icon" href="{{ asset('img/logo-bg.png') }}">
    @include('components.guest.header')
</head>

<body class="d-flex flex-column">
    @yield('content')

    @include('components.guest.script')

    @stack('script')
</body>

</html>