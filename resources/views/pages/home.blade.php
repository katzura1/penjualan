@extends('layouts.app')
@section('title', 'Home')

@section('content')

<div class="page-wrapper">
    <!-- Page header -->
    <div class="page-header d-print-none">
        <div class="page-body">
            <div class="container-xl">
                <div class="row row-cards">
                    @if (auth()->user()->level == 'laporan')
                    <div class="col-md-6 col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Outstanding Approve Retur</h3>
                            </div>
                            <table class="table card-table table-vcenter">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th colspan="2">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($outstanding as $item)
                                    <tr>
                                        <td>
                                            {{ $item->status }}
                                        </td>
                                        <td>
                                            {{ $item->count }}
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div class="col-md-6 col-lg-4">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="card-title">Outstanding Faktur</h3>
                            </div>
                            <table class="table card-table table-vcenter">
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th colspan="2">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($outstandingInvoice as $item)
                                    <tr>
                                        <td>
                                            {{ $item->status }}
                                        </td>
                                        <td>
                                            {{ $item->count }}
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                    @endif
                </div>
            </div>
        </div>
        @endsection