<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlaceTagAddRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'tag' => 'required'
        ];
    }


    public function messages(): array
    {
        return [
            'tag.required' => 'Başlık zorunludur.'
        ];
    }
}
