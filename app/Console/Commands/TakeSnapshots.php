<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TakeSnapshots extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'game:snapshots';
    protected $description = 'Take daily snapshots of player and alliance stats';

    public function handle(\App\Services\AnalyticsService $analyticsService)
    {
        $this->info('Starting snapshots...');
        $analyticsService->takeSnapshots();
        $this->info('Snapshots completed successfully.');
    }
}
