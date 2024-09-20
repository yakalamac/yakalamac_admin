<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AuthLoginRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:admin_users,email',
            'password' => 'required'
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'E-mail zorunludur.',
            'email.email' => 'E-mail düzgün formatta olmalıdır.',
            'email.exists' => 'E-mail bulunamadı.',
            'password.required' => 'Şifre zorunludur.'
        ];
    }
}
