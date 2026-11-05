(function(root, factory) {
  const api = factory();
  if (typeof module === 'object') module.exports = api;
  root.BudgetPROApiConfig = api;
})(globalThis, () => {
  'use strict';
  const productionOrigin = 'https://budget-pro-lski.vercel.app';
  function getApiBaseUrl(context = {}) {
    const loc = context.location || globalThis.location;
    const native = context.native ?? !!globalThis.Capacitor?.isNativePlatform?.();
    if (!loc || loc.protocol === 'file:' || native || !['http:', 'https:'].includes(loc.protocol)) return productionOrigin + '/api';
    // HTTP is allowed only for a local developer server, never packaged apps.
    if (loc.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(loc.hostname)) return productionOrigin + '/api';
    return loc.origin + '/api';
  }
  const getApiUrl = (route, context) => getApiBaseUrl(context) + '/' + String(route).replace(/^\/+/, '');
  return Object.freeze({ productionOrigin, getApiBaseUrl, getApiUrl });
});
