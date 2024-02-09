<!DOCTYPE html>
<html lang="en">

<head>
    @include('components.auth.header')
    @stack('css')
</head>

<body>
    <div class="page">
        @include('components.auth.navbar')

        @yield('content')
    </div>
    @include('components.auth.script')
    @stack('script')
</body>

</html>
