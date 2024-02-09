@extends('layouts.app')

@section('title', 'Data User')

@section('content')
<div class="page-wrapper">
    <!-- Page header -->
    <div class="page-header d-print-none">
        <div class="container-xl">
            <div class="row g-2 align-items-center">
                <div class="col">
                    <h2 class="page-title">Master User</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="page-body">
        <div class="container-xl">
            <div class="row row-cards">
                <div class="col-12 d-flex flex-row-reverse">
                    <button type="button" class="btn btn-primary" id="btn-add">
                        Tambah User
                    </button>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <table class="table table-vcenter card-table" id="table">
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Nama</th>
                                        <th>Level</th>
                                        <th>Status</th>
                                        <th class="w-1">Aksi</th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-blur fade" id="modal-user" data-bs-focus="false" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Form User</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="form-user" method="post">
                    @csrf
                    <input type="hidden" name="id">
                    <div class="mb-3">
                        <label class="form-label required">Username</label>
                        <div>
                            <input type="text" class="form-control" name="username" placeholder="Masukkan username"
                                maxlength="150" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label required">Nama</label>
                        <div>
                            <input type="text" class="form-control" name="name" placeholder="Masukkan nama"
                                maxlength="150" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label required">Select</label>
                        <div>
                            <select class="form-select" name="level" id="level" required>
                                <option value="" disabled selected>Pilih Level</option>
                                @foreach ($userLevels as $item)
                                <option value="{{ $item['key'] }}">{{ $item['value'] }}</option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label form-label-password required">Password</label>
                        <div>
                            <input type="text" class="form-control" name="password" placeholder="Masukkan Password"
                                maxlength="30" required>
                            <small class="form-hint form-hint-password">Kosongkan kolom ini jika tidak ingin mengubah
                                password.</small>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label required">Status</label>
                        <div>
                            <select class="form-select" name="status" id="status" required>
                                <option value="" disabled selected>Pilih Status</option>
                                <option value="active">Aktif</option>
                                <option value="non_active">Non Aktif</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn me-auto" data-bs-dismiss="modal">
                    Tutup
                </button>
                <button type="button" class="btn btn-primary" id="btn-save">
                    Simpan Data
                </button>
            </div>
        </div>
    </div>
</div>
@endsection

@push('script')
<script src="{{ asset('pages/user.js') }}"></script>
@endpush
