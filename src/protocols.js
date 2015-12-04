'use strict';

const portsByProtocol = {
  ssh: "22",
  http: "80",
  https: "443"
};

const protocolsByPort = {
  22: "ssh",
  80: "http",
  443: "https"
};

/**
 * Given a protocol, returns the (string-formatted) port number, or null
 * if not found.
 *
 * @param {string|null} protocol
 * @returns {string|null} port
 */
function getPort(protocol) {
  if (protocol === null) return null;
  let baseProtocol = protocol.split("+").pop();
  return portsByProtocol[baseProtocol];
}

/**
 * Given a port number (string or integer), returns the protocol string,
 * or null if not found.
 *
 * @param {string|integer|null} port
 * @returns {string|null} protocol
 */
function getProtocol(port) {
  if (port === null) return null;
  return protocolsByPort[port.toString()];
}

module.exports = { getPort, getProtocol };

