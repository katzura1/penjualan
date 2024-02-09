@extends('layouts.app')

@section('title', 'Data Menu')

@section('content')
<div class="page-wrapper">
    <!-- Page header -->
    <div class="page-header d-print-none">
        <div class="container-xl">
            <div class="row g-2 align-items-center">
                <div class="col">
                    <h2 class="page-title">Master Menu</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="page-body">
        <div class="container-xl">
            <div class="row row-cards">
                <div class="col-12 d-flex flex-row-reverse">
                    <button type="button" class="btn btn-primary" id="btn-add">
                        Tambah Menu Baru
                    </button>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body table-responsive">
                            <table class="table table-vcenter card-table w-100" id="table">
                                <thead>
                                    <tr>
                                        <th>Nama Menu</th>
                                        <th>Url Menu</th>
                                        <th>Parent Menu</th>
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

<div class="modal modal-blur fade" id="modal-menu" data-bs-focus="false" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Form Menu</h5>
            </div>
            <div class="modal-body">
                <form id="form-menu" method="post">
                    @csrf
                    <input type="hidden" name="id">
                    <div class="mb-3">
                        <label class="form-label required">Nama</label>
                        <input type="text" class="form-control" name="name" placeholder="Masukkan nama" maxlength="150"
                            required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label required">Slug</label>
                        <input type="text" class="form-control" name="slug" placeholder="Masukkan slug" maxlength="150"
                            required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label required">Tipe Menu</label>
                        <select name="type" id="type" class="form-control form-select" required>
                            <option value=""></option>
                            <option value="parent">Parent</option>
                            <option value="child">Children</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="id_parent">Parent</label>
                        <select type="text" name="id_parent" id="id_parent" class="form-control form-select w-100"
                            value="" required>
                            <option value=""></option>
                            @foreach ($parents as $parent)
                            <option value="{{ $parent->id }}">{{ $parent->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="order">Order</label>
                        <input type="number" name="order" id="order" class="form-control" min="0" required>
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

<div class="modal modal-blur fade" id="modal-menu-user" data-bs-focus="false" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Form Menu Akses</h5>
            </div>
            <div class="modal-body">
                <form id="form-menu-user" method="post">
                    @csrf
                    <input type="hidden" name="id_menu">
                    <div class="mb-3">
                        <label for="name" class="form-label">Menu</label>
                        <div>
                            <input type="text" name="name" class="form-control" readonly>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Level User</label>
                        <div>
                            @foreach ($userLevels as $item)
                            <label class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" name="user_level[]"
                                    value="{{ $item['value'] }}">
                                <span class="form-check-label">{{ $item['key'] }}</span>
                            </label>
                            @endforeach
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
<script src="{{ asset('pages/menu.js') }}"></script>
@endpush