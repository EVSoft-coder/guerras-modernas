<?php
 
namespace App\Models;
 
use Illuminate\Database\Eloquent\Model;
 
class MarketOffer extends Model
{
    protected $table = 'market_offers';
 
    protected $fillable = [
        'base_id',
        'offered_resource',
        'offered_amount',
        'requested_resource',
        'requested_amount',
        'status',
    ];
 
    public function base()
    {
        return $this->belongsTo(Base::class);
    }
}
