<?php

namespace App\Traits;

trait ResponseFormatter
{
    public static function success($message, $data = [])
    {
        return response()->json([
            'code' => 200,
            'message' => $message,
            'data' => $data,
        ], 200);
    }

    public static function error($code = 500, $message, $data = [])
    {
        return response()->json([
            'code' => $code,
            'message' => $message,
            'data' => $data,
        ], 500);
    }
}
