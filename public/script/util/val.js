function processVal(value, prefix, type) {
    if(value === null ?? value.length === 0) {
        return null;
    }

    if(type !== 'string') {
        if(value === 'true') {
            value = 1;
        }
        if(value === 'false') {
            value = 0;
        }

        if(type === 'number') {
            value = value.replaceAll(',', '.');
            if(value.includes('.')) value = parseFloat(value);
            else value = parseInt(value);
        }
        if(type === 'boolean') {
            value = value !== 0;
        }
        return value;
    }
    return (prefix ?? '') + value;
}

export function val(selector, prefix = undefined, type = 'string') {
    const selected = $(selector); if(selected.length === 0) return;
    const vals = selected.val();
    if(Array.isArray(vals)) {
        const x = vals.map(value=>processVal(value, prefix, type));
        console.log(x)
        return x;
    }
    return processVal(vals, prefix, type);
}