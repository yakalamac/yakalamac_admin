<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        AdminUser::create([
            'email' => 'admin@yakalamac.com.tr',
            'password' => Hash::make('Yakalamac2024'),
            'name' => 'Admin Yakalamaç'
        ]);

        AdminUser::create([
            'email' => 'onur@yakalamac.com.tr',
            'password' => Hash::make('onurkudret'),
            'name' => 'Admin Onur'
        ]);

        AdminUser::create([
            'email' => 'baris@yakalamac.com.tr',
            'password' => Hash::make('bariskudret'),
            'name' => 'Admin Barış'
        ]);

        AdminUser::create([
            'email' => 'kerem@yakalamac.com.tr',
            'password' => Hash::make('keremozturk'),
            'name' => 'Admin Kerem'
        ]);

        AdminUser::create([
            'email' => 'alper@yakalamac.com.tr',
            'password' => Hash::make('alperuyanik'),
            'name' => 'Admin Alper'
        ]);

        AdminUser::create([
            'email' => 'yigit@yakalamac.com.tr',
            'password' => Hash::make('yigittastan'),
            'name' => 'Admin Yiğit'
        ]);

        AdminUser::create([
            'email' => 'naci@yakalamac.com.tr',
            'password' => Hash::make('nacibozkir'),
            'name' => 'Admin Naci'
        ]);

        AdminUser::create([
            'email' => 'cihan@yakalamac.com.tr',
            'password' => Hash::make('ibrahimcihandikmen'),
            'name' => 'Admin İbrahim Cihan'
        ]);

        AdminUser::create([
            'email' => 'tunahan@yakalamac.com.tr',
            'password' => Hash::make('tunahanalanci'),
            'name' => 'Admin Tunahan'
        ]);

        AdminUser::create([
            'email' => 'onursevik@yakalamac.com.tr',
            'password' => Hash::make('onursevik'),
            'name' => 'Admin Onur'
        ]);

        AdminUser::create([
            'email' => 'burak@yakalamac.com.tr',
            'password' => Hash::make('halilburakgonenli'),
            'name' => 'Admin Halil Burak'
        ]);
    }
}
