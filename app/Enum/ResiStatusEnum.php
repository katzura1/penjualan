<?php

namespace App\Enum;

enum ResiStatusEnum: string
{
    case PACKING = 'packing';
    case SHIPPING = 'shipping';
    case RECEIVED = 'received';
    case VALIDATED = 'validated';
    case REGISTER = 'register';
    case CONFIRM_SO = 'confirm_so';
    case REJECT_SO = 'reject_so';
}
