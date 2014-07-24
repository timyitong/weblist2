module.exports = exports = function autoTimeFields (schema, options) {
  /* schema: a mongoose model schema
     options.index: boolean, if index the time field
   */
  schema.add({ createdTime: {type: Date, default: Date.now},
               modifiedTime: {type: Date}
             });
  
  schema.pre('save', function (next) {
    this.modifiedTime = new Date();
    next();
  });
  
  if (options && options.index) {
    schema.path('modifiedTime').index(options.index);
  }
}