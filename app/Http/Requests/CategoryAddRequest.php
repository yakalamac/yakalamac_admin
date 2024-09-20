<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryAddRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'text' => 'required',
            'description' => 'required',
            'icon' => 'required'
        ];
    }

    public function messages(): array
    {
        return [
            'text.required' => 'Kategori Adı zorunludur.',
            'description.required' => 'Açıklama zorunludur.',
            'icon.required' => 'İkon zorunludur.'
        ];
    }
}
