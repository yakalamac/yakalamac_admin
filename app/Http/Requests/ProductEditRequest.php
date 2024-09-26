<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductEditRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'price' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'price.required' => 'Fiyat zorunludur.',
        ];
    }
}
