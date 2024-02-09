@extends('layouts.app')

@section('title', 'Pengaturan')

@section('content')
<div class="page-wrapper">
    <!-- Page header -->
    <div class="page-header d-print-none">
        <div class="container-xl">
            <div class="row g-2 align-items-center">
                <div class="col">
                    <h2 class="page-title">Setting</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="page-body">
        <div class="container-xl">
            <div class="row row-cards">
                <div class="col-4">
                    <div class="card">
                        <div class="card-body">
                            <form id="form-password-admin" method="POST">
                                @csrf
                                <div class="mb-3">
                                    <label class="form-label required">Password Admin</label>
                                    <input type="text" class="form-control" name="password"
                                        placeholder="Masukkan Password Admin" maxlength="150" required>
                                    <small class="form-hint">Password sekarang : {{ $passwordAdmin }}</small>
                                </div>

                                <button type="button" class="btn btn-primary" id="btn-save">
                                    Simpan Data
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('script')
<script src="{{ asset('pages/setting.js') }}"></script>
@endpush