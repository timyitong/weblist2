module.exports = exports = function autoTimeFields (schema, options) {
    /** 
     * schema: a mongoose model schema
     * options.index: boolean, if index the time field
     * options.expires: ms module https://github.com/guille/ms.js to represent milliseconds
     *                  (i.e. 60 * 60, '1h', '1d')
     */
    schema.add({
        createdTime: { type: Date, default: Date.now },
        modifiedTime: { type: Date }
    });
  
    schema.pre('save', function (next) {
        this.modifiedTime = new Date();
        next();
    });

    if (options) {
        if (options.index) {
            schema.path('modifiedTime').index(options.index);
        }
        if (options.expires) {
            schema.path('createdTime').expires(options.expires);
        }
    }
}