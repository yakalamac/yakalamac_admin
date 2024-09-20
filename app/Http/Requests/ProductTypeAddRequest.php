<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductTypeAddRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'type' => 'required',
            'description' => 'required'
        ];
    }


    public function messages(): array
    {
        return [
            'type.required' => 'Başlık zorunludur.',
            'description.required' => 'Açıklama zorunludur.'
        ];
    }
}
