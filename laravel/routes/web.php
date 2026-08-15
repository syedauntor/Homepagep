<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MonthlyCalendarGeneratorController;

Route::get('/generators/monthly-calendar', [MonthlyCalendarGeneratorController::class, 'index']);
