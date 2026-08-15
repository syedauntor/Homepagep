<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MonthlyCalendarGeneratorController extends Controller
{
    public function index()
    {
        $themes = [
            ['id' => 'clean', 'name' => 'Clean White', 'accent' => '#F97316', 'bg' => '#ffffff', 'cellBg' => '#ffffff', 'headerBg' => '#FFF7ED', 'decoration' => ''],
            ['id' => 'autumn', 'name' => 'Autumn', 'accent' => '#D97706', 'bg' => '#FEF6E4', 'cellBg' => '#FFFBF0', 'headerBg' => '#FDE68A', 'decoration' => '🍂'],
            ['id' => 'ocean', 'name' => 'Ocean', 'accent' => '#0891B2', 'bg' => '#ECFEFF', 'cellBg' => '#ffffff', 'headerBg' => '#CFFAFE', 'decoration' => '🌊'],
            ['id' => 'forest', 'name' => 'Forest', 'accent' => '#059669', 'bg' => '#ECFDF5', 'cellBg' => '#ffffff', 'headerBg' => '#A7F3D0', 'decoration' => '🌿'],
            ['id' => 'rose', 'name' => 'Rose', 'accent' => '#E11D48', 'bg' => '#FFF1F2', 'cellBg' => '#ffffff', 'headerBg' => '#FECDD3', 'decoration' => '🌹'],
            ['id' => 'sunshine', 'name' => 'Sunshine', 'accent' => '#CA8A04', 'bg' => '#FEFCE8', 'cellBg' => '#ffffff', 'headerBg' => '#FEF08A', 'decoration' => '☀️'],
            ['id' => 'lavender', 'name' => 'Lavender', 'accent' => '#7C3AED', 'bg' => '#F5F3FF', 'cellBg' => '#ffffff', 'headerBg' => '#DDD6FE', 'decoration' => '🌸'],
            ['id' => 'slate', 'name' => 'Slate', 'accent' => '#475569', 'bg' => '#F8FAFC', 'cellBg' => '#ffffff', 'headerBg' => '#E2E8F0', 'decoration' => ''],
            ['id' => 'coral', 'name' => 'Coral', 'accent' => '#F43F5E', 'bg' => '#FFF1F2', 'cellBg' => '#ffffff', 'headerBg' => '#FDA4AF', 'decoration' => '🐚'],
            ['id' => 'mint', 'name' => 'Mint', 'accent' => '#10B981', 'bg' => '#F0FDF4', 'cellBg' => '#ffffff', 'headerBg' => '#BBF7D0', 'decoration' => '🍃'],
        ];

        $relatedGenerators = [
            ['name' => 'Monthly Calendar Generator', 'slug' => 'monthly-calendar'],
            ['name' => 'Countdown Calendar Generator', 'slug' => 'countdown-calendar'],
        ];

        return view('generators.monthly-calendar', compact('themes', 'relatedGenerators'));
    }
}
