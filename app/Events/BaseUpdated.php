<?php

namespace App\Events;


use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BaseUpdated
{
    use Dispatchable, SerializesModels;

    public function __construct(public \App\Models\Base $base) {}
}
