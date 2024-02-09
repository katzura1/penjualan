<?php

namespace App\Console\Commands;

use App\Models\Resi\ResiMaster;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class remove_attachment_1_not_used extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remove:attachment_not_used';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //attachment_1
        $files = Storage::files('public/resi/attachment_1');
        foreach ($files as $file) {
            // $url = Storage::url($file);
            // $this->line($file);
            $check = ResiMaster::where('attachment_1', str_replace('public/', '', $file))->first();
            if (!$check) {
                Storage::delete($file);
                $this->info($file . ' deleted successfully');
            }
        }
        //attachment_2
        $files = Storage::files('public/resi/attachment_2');
        foreach ($files as $file) {
            // $url = Storage::url($file);
            // $this->line($file);
            $check = ResiMaster::where('attachment_2', str_replace('public/', '', $file))->first();
            if (!$check) {
                Storage::delete($file);
                $this->info($file . ' deleted successfully');
            }
        }

        //resi master 15 day past
        $resiMasters = ResiMaster::where('created_at', '<', \Carbon\Carbon::now()->subDays(15))->get();
        foreach ($resiMasters as $resiMaster) {
            if ($resiMaster->attacment_1) {
                //check exists or not if exist delete
                if (Storage::exists('public/' . $resiMaster->attacment_1)) {
                    Storage::delete('public/' . $resiMaster->attacment_1);
                    $this->info($resiMaster->attacment_1 . ' deleted successfully');
                }
                $this->info($resiMaster->attacment_1 . ' deleted successfully');
            }
            if ($resiMaster->attacment_2) {
                //check exists or not if exist delete
                if (Storage::exists('public/' . $resiMaster->attacment_2)) {
                    Storage::delete('public/' . $resiMaster->attacment_2);
                    $this->info($resiMaster->attacment_2 . ' deleted successfully');
                }
                $this->info($resiMaster->attacment_2 . ' deleted successfully');
            }
        }
    }
}
