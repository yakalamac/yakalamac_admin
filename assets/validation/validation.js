import { email, password } from "./pattern";

/**
 *
 * @param {string} input
 * @returns {false|*}
 */
export const validateEmail = function (input){
    return  email.test(input);
};

/**
 * @param {string} input
 * @returns {false|*}
 */
export const validatePassword = function (input){
  return password.test(input);
};