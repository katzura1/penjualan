@extends('layouts.app')

@section('title', 'Data Produk')

@section('content')
<div class="page-wrapper">
    <!-- Page header -->
    <div class="page-header d-print-none">
        <div class="container-xl">
            <div class="row g-2 align-items-center">
                <div class="col">
                    <h2 class="page-title">Master Produk</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="page-body">
        <div class="container-xl">
            <div class="row row-cards">
                <div class="col-12 d-flex flex-row-reverse gap-2">
                    <button type="button" class="btn btn-primary" id="btn-add">
                        Tambah Data
                    </button>
                    <button type="button" class="btn btn-secondary" id="btn-import">
                        Import Data
                    </button>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body table-responsive">
                            <table class="table table-vcenter card-table w-100" id="table">
                                <thead>
                                    <tr>
                                        <th>Barcode</th>
                                        <th>Nama</th>
                                        <th>Kategori</th>
                                        <th class="w-1">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal modal-blur fade" id="modal-product" data-bs-focus="false" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Form Produk</h5>
            </div>
            <div class="modal-body">
                <form id="form-product" method="post">
                    @csrf
                    <input type="hidden" name="id">
                    <div class="mb-3">
                        <label class="form-label required">Barcode</label>
                        <input type="text" class="form-control" name="barcode" placeholder="Masukkan barcode"
                            maxlength="150" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label required">Nama</label>
                        <input type="text" class="form-control" name="name" placeholder="Masukkan nama" maxlength="150"
                            required>
                    </div>
                    <div class="mb-3">
                        <label for="product_category_id" class="form-label required">Kategori</label>
                        <select type="text" name="product_category_id" id="product_category_id"
                            class="form-control form-select w-100" value="" required>
                            <option value=""></option>
                            @foreach ($productCategory as $item)
                            <option value="{{ $item->id }}">{{ $item->name }}</option>
                            @endforeach
                        </select>
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


<div class="modal modal-blur fade" id="modal-import" data-bs-focus="false" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Form Import</h5>
            </div>
            <div class="modal-body">
                <form id="form-import" method="post">
                    @csrf
                    <div class="mb-3">
                        <label for="file" class="form-label required">File Excel</label>
                        <input type="file" name="file" class="form-control" accept="xlsx,xls,csv" required>
                        <small class="form-hint">Format: barcode,nama,kategori.</small>
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
<script src="{{ asset('pages/master/product.js') }}"></script>
@endpush