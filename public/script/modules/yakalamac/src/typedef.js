/**
 * @typedef {function(Event): void} OnEvent
 */

/**
 * @typedef {OnEvent} EventAfter
 */

/**
 * @typedef {OnEvent} EventBefore
 */

/**
 * @typedef EventObject
 * @property {EventBefore|undefined} before
 * @property {EventAfter|undefined} after
 */