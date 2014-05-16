JSONEditor.defaults.editors.arrayBase1 = JSONEditor.defaults.editors.array.extend({
  getElementEditor: function(i) {
    var superResult = this._super(i);
    var item_info = this.getItemInfo(i);
    superResult.schema.title = item_info.title +' '+ (i + 1);
    superResult.header_text = item_info.title +' '+ (i + 1);
    return superResult;
  }
});