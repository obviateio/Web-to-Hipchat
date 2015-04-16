exports.HipChat = {};
// HipChat token. Requires at least notification privs.
exports.HipChat.token = '';

exports.core = {};
exports.core.port = 8443;
// Path to SSL key/crt files. Relative to index.js
exports.core.key = 'snakeoil.key';
exports.core.cert = 'snakeoil.crt';
// Intermediary CA will probably be required for mobile
exports.core.ca = 'digicertca.crt';
