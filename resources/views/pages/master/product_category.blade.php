@extends('layouts.app')

@section('title', 'Data Kategori Produk')

@section('content')
<div class="page-wrapper">
    <!-- Page header -->
    <div class="page-header d-print-none">
        <div class="container-xl">
            <div class="row g-2 align-items-center">
                <div class="col">
                    <h2 class="page-title">Master Kategori Produk</h2>
                </div>
            </div>
        </div>
    </div>
    <div class="page-body">
        <div class="container-xl">
            <div class="row row-cards">
                <div class="col-12 d-flex flex-row-reverse">
                    <button type="button" class="btn btn-primary" id="btn-add">
                        Tambah Data
                    </button>
                </div>
                <div class="col-12">
                    <div class="card">
                        <div class="card-body table-responsive">
                            <table class="table table-vcenter card-table w-100" id="table">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
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

<div class="modal modal-blur fade" id="modal-product-category" data-bs-focus="false" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Form Kategori Produk</h5>
            </div>
            <div class="modal-body">
                <form id="form-product-category" method="post">
                    @csrf
                    <input type="hidden" name="id">
                    <div class="mb-3">
                        <label class="form-label required">Nama</label>
                        <input type="text" class="form-control" name="name" placeholder="Masukkan nama" maxlength="150"
                            required>
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
<script src="{{ asset('pages/master/product_category.js') }}"></script>
@endpush