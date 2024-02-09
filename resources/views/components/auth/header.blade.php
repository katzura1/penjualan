<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<meta name="csrf-token" content="{{ csrf_token() }}">
<meta name="password-spm" content="{{ config('app.password_done_return') }}">
<meta name="level" content="{{ auth()->user()->level ?? "" }}">
<title>@yield('title','Anlysis Stock')</title>
<link rel="shortcut icon" href="{{ asset('img/logo-bg.png') }}">
<!-- CSS files -->
<link href="{{ asset('') }}/css/tabler.min.css" rel="stylesheet" />
<link href="{{ asset('') }}/css/tabler-flags.min.css" rel="stylesheet" />
<link href="{{ asset('') }}/css/tabler-payments.min.css" rel="stylesheet" />
<link href="{{ asset('') }}/css/tabler-vendors.min.css" rel="stylesheet" />
<link href="{{ asset('') }}/css/demo.min.css" rel="stylesheet" />

<link href="{{ asset('libs/datatables/dataTables.bootstrap5.min.css') }}" rel="stylesheet" />
<link href="{{ asset('libs/datatables/buttons.bootstrap5.min.css') }}" rel="stylesheet" />

<link href="{{ asset('libs/sweetalert2/sweetalert2.min.css') }}" rel="stylesheet" />
<link href="{{ asset('libs/select2/select2.min.css') }}" rel="stylesheet" />
<link href="{{ asset('libs/select2/select2-bootstrap-5-theme.min.css') }}" rel="stylesheet" />
<link href="{{ asset('libs/toastr/toastr.min.css') }}" rel="stylesheet" />
<link href="{{ asset('css/style.css?v='.config('app.version')) }}" rel="stylesheet" />
<style>
    @import url('https://rsms.me/inter/inter.css');

    :root {
        --tblr-font-sans-serif: 'Inter Var', -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif;
    }

    body {
        font-feature-settings: "cv03", "cv04", "cv11";
    }

    .dt-button {
        position: relative;
    }

    #table_filter {
        float: right;
    }
</style>