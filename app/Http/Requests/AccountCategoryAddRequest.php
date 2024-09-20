<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountCategoryAddRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required',
            'description' => 'required',
            'icon' => 'required'
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Kategori Adı zorunludur.',
            'description.required' => 'Açıklama zorunludur.',
            'icon.required' => 'İkon zorunludur.'
        ];
    }
}
