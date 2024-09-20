<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PlacePhotoAddRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'uuid' => 'required|unique:place_photos,uuid',
            'place_id' => 'required|exists:places,uuid',
            'src' => 'required',
            'width_px' => 'required',
            'height_px' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'uuid.required' => 'UUID zorunludur.',
            'uuid.unique' => 'UUID eşsiz olmalıdır.',
            'place_id.required' => 'İşletme IDsi zorunludur.',
            'place_id.exists' => 'İşletme IDsi bulunamadı.',
            'src.required' => 'Fotoğraf Yolu zorunludur.',
            'width_px.required' => 'Genişlik(px) zorunludur.',
            'height_px.required' => 'Yükseklik(px) zorunludur.'
        ];
    }
}
