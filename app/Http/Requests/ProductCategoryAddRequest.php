<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductCategoryAddRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required',
            'description' => 'required'
        ];
    }


    public function messages(): array
    {
        return [
            'title.required' => 'Başlık zorunludur.',
            'description.required' => 'Açıklama zorunludur.'
        ];
    }
}
