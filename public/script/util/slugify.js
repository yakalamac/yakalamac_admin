export function slugify(str) {
    return str?.toString()
        .normalize('NFD').replace(/[\u0300-\u036f]|[^a-zA-Z0-9\s-]/g, '')
        .replace(/ğ|Ğ/g, 'g').replace(/ü|Ü/g, 'u')
        .replace(/ş|Ş/g, 's').replace(/ı|İ/g, 'i')
        .replace(/ö|Ö/g, 'o').replace(/ç|Ç/g, 'c')
        .replace(/\s+/g, '-').replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '').toLowerCase() || '';
}