export const ADMIN_ROLE_MAP = {
    ROLE_USER: {
        description: 'Kullanıcı',
        permissions: [
            'Yakala üzerinde giriş yapabilir.'
        ],
        degree: 0
    },
    ADMIN_SUPER: {
        description: 'Süper Admin Kullanıcısı',
        permissions: [
            'Tüm yetkilere sahiptir.'
        ],
        degree: 5
    },
    ADMIN_UNVERIFIED: {
        description: 'Doğrulanmamış Admin',
        permissions: [
            'Admin paneline doğrulama yapıldıktan sonra girebilir.'
        ],
        degree: 1
    },
    ROLE_ADMIN: {
        description: 'Yetkili Admin Kullanıcısı',
        permissions: [
            'Kullanıcıları görebilir.',
            'Yeni varlıklar ekleyebilir.',
            'Varlıkları güncelleyebilir.',
            'Varlıkları silebilir.',
            'Kullanıcıları görüntüleyebilir ancak değişteremez veya silemez.'
        ],
        degree: 4
    },
    SUPER_ADMIN: {
        description: 'Süper Admin Kullanıcısı',
        permissions: [
            'Tüm yetkilere sahiptir.'
        ],
        degree: 5
    },
    ADMIN_SUB_USER: {
        description: 'Admin Alt Kullanıcısı',
        permissions: [
            'Admin paneline girebilir',
            'Yeni varlıklar ekleyebilir',
            'Varlıkları kaldıramaz ancak değiştirebilir.',
            'Kullanıcılara erişimi yoktur.'
        ],
        degree: 2
    }
};