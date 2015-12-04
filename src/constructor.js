const FIELDS = ["protocol", "username", "password", "hostname",
                "port", "path", "query", "fragment"];

/**
 * Creates a Fuzzyurl object with the given parameter values.  Valid
 * `params` keys are: `protocol`, `username`, `password`, `hostname`,
 * `port`, `path`, `query`, and `fragment`; all default to null.
 *
 * @param {object} params Parameter values.
 *
 */
function Fuzzyurl(params) {
  FIELDS.forEach((f) => this[f] = null); // initialize
  let ps = params ? params : {};
  Object.keys(ps).forEach((k) => {
    if (-1 === FIELDS.indexOf(k)) throw new Error(`Got bad field ${k}.`);
    this[k] = ps[k];
  });
};

module.exports = Fuzzyurl;
