<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlaceCategoryAddRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
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
