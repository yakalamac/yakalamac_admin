<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductEditRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'place_id' => 'required',
            'name' => 'required',
            'price' => 'required',
            'description' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'place_id.required' => 'İşletme zorunludur.',
            'name.required' => 'Ürün Adı zorunludur.',
            'price.required' => 'Fiyat zorunludur.',
            'description.required' => 'Açıklama zorunludur.',
        ];
    }
}
