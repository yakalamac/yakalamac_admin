<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NotificationMailAddRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required',
            'content' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'title.required' => 'Bildirim Başlığı zorunludur.',
            'content.required' => 'Bildirim İçeriği zorunludur.'
        ];
    }
}
