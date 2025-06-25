/**
 * Constructs a log transport object for use with external API.
 *
 * @param {Array} levels - The log levels forwarded to the external API.

 * @returns {Object} - The transport object.
 */
declare function buildTransport(levels: Array<string>): any;
export default buildTransport;
