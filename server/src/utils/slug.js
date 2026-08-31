const slugify = require('slugify');

const makeSlug = (value) => slugify(value, { lower: true, strict: true, trim: true });

module.exports = makeSlug;
