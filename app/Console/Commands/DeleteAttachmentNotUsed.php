<?php

namespace App\Console\Commands;

use App\Models\ReturnAttachment;
use App\Models\SupplierInvoice;
use App\Models\SupplierInvoicePaymentAttachment;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class DeleteAttachmentNotUsed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'delete:attachment_not_used';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete attachments in storage not linked to any attachments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $files = Storage::files('public/attachment_return');
        foreach ($files as $file) {
            // $url = Storage::url($file);
            // $this->line($file);
            $check = ReturnAttachment::where('path_attachment', str_replace('public/', '', $file))->first();
            if (!$check) {
                Storage::delete($file);
                $this->info($file . ' deleted successfully');
            }
        }
        $files = Storage::files('public/scan_invoice');
        foreach ($files as $file) {
            // $url = Storage::url($file);
            // $this->line($file);
            $check = SupplierInvoice::where('scan_invoice', str_replace('public/', '', $file))->first();
            if (!$check) {
                Storage::delete($file);
                $this->info($file . ' deleted successfully');
            }
        }
        $files = Storage::files('public/proof_olsera');
        foreach ($files as $file) {
            // $url = Storage::url($file);
            // $this->line($file);
            $check = SupplierInvoice::where('proof_olsera', str_replace('public/', '', $file))->first();
            if (!$check) {
                Storage::delete($file);
                $this->info($file . ' deleted successfully');
            }
        }
        $files = Storage::files('public/proof_accurate');
        foreach ($files as $file) {
            // $url = Storage::url($file);
            // $this->line($file);
            $check = SupplierInvoice::where('proof_accurate', str_replace('public/', '', $file))->first();
            if (!$check) {
                Storage::delete($file);
                $this->info($file . ' deleted successfully');
            }
        }
        $files = Storage::files('public/proof_invoice');
        foreach ($files as $file) {
            // $url = Storage::url($file);
            // $this->line($file);
            $check = SupplierInvoice::where('proof_invoice', str_replace('public/', '', $file))->first();
            if (!$check) {
                Storage::delete($file);
                $this->info($file . ' deleted successfully');
            }
        }
        $files = Storage::files('public/attachment_payment');
        foreach ($files as $file) {
            // $url = Storage::url($file);
            // $this->line($file);
            $check = SupplierInvoicePaymentAttachment::where('path_attachment', str_replace('public/', '', $file))->first();
            if (!$check) {
                Storage::delete($file);
                $this->info($file . ' deleted successfully');
            }
        }
    }
}
