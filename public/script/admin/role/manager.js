import {ADMIN_ROLE_MAP} from "./role.js";

export const factory = (role) => {
  if(role === undefined) return '<i>Hiç rol bulunmadı.</i>';
  const result = generateRole(role);
  return result === undefined ? `<i>Hiç rol bulunmadı.</i>` : `<i id="${result.id}">${result.value}</i>`;
};

/**
 * @param {string} role
 * @returns {undefined|{id, value, permissions: Array<string>}}
 */
export const generateRole=role=>typeof role==='string'&&ADMIN_ROLE_MAP[role]===undefined?undefined:{id: role, value: ADMIN_ROLE_MAP[role].description, permissions: ADMIN_ROLE_MAP[role].permissions};

export const factoryX=(data) => {
  if(typeof data === 'string') {
    return factory(data);
  }

  if(Array.isArray(data)){
    let max = -1;
    let current = undefined;
    for(let i=0; i<data.length && typeof data[i] === 'string' && ADMIN_ROLE_MAP[data[i]]; i++) {
      if(ADMIN_ROLE_MAP[data[i]].degree > max) {
        current = data[i];
        max = ADMIN_ROLE_MAP[data[i]].degree;
      }
    }

    if(current) {
      return factory(current);
    }
  }

  return '<i>Hiç rol bulunmadı.</i>';
};