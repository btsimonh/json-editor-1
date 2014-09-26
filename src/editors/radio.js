JSONEditor.defaults.editors.radio = JSONEditor.defaults.editors.select.extend({
  setValue: function () {
    this._super();
  },
  register: function () {
    if (this.editors) {
      for (var i = 0; i < this.editors.length; i++) {
        if (!this.editors[i])
          continue;
        this.editors[i].unregister();
      }
      if (this.editors[this.type])
        this.editors[this.type].register();
    }
    this._super();
  },
  unregister: function () {
    this._super();
    if (this.editors) {
      for (var i = 0; i < this.editors.length; i++) {
        if (!this.editors[i])
          continue;
        this.editors[i].unregister();
      }
    }
  },
  getNumColumns: function () {
    this._super();
  },
  typecast: function () {
    this._super();
  },
  getValue: function () {
    var checkedElem = document.querySelector("input[name=\"" + this.path + "\"]:checked");
    if (checkedElem) {
      this.value = checkedElem.value;
    }
    return this.value;
  },
  preBuild: function () {
    var self = this;
    this.input_type = 'radio';
    this.enum_options = [];
    this.enum_values = [];
    this.enum_display = [];
    this.editors = [];
    this.validators = [];

    // "type":"radio",
    // "options": { "enum_titles": ["Swiss Cheese","Cheddar Cheese","Gouda Cheese"] },
    // "enum": ["swiss","cheddar","gouda"],
    // "default": "gouda"
    // Enum options enumerated
    if (this.schema.enum) {
      var display = this.schema.options && this.schema.options.enum_titles || [];

      $each(this.schema.enum, function (i, option) {
        self.enum_options[i] = "" + option;
        self.enum_display[i] = "" + (display[i] || option);
        self.enum_values[i] = self.typecast(option);
      });
    }
  },
  build: function () {
    var self = this;
    var container = this.container;


    if (!this.options.compact)
      this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
    this.container.appendChild(this.header);
    if (this.schema.description)
      this.description = this.theme.getFormInputDescription(this.schema.description);

    if (this.options.compact)
      this.container.setAttribute('class', this.container.getAttribute('class') + ' compact');

    this.input = this.theme.getRadioGroupFormControl(this.path, self.enum_options, self.enum_display, this.schema.default);


    if (this.schema.readOnly || this.schema.readonly) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.input.addEventListener('change', function (e) {
      e.preventDefault();
      e.stopPropagation();
      self.onInputChange();
    });

    this.control = this.theme.getFormControl(this.label, this.input, this.description);
    this.container.appendChild(this.control);

    this.value = this.schema.default;
  },
  onInputChange: function () {
    this._super();
  },
  setupSelect2: function () {
    this._super();
  },
  postBuild: function () {
    this._super();
  },
  onWatchedFieldChange: function () {
    this._super();
  },
  enable: function () {
    if (this.editors) {
      for (var i = 0; i < this.editors.length; i++) {
        if (!this.editors[i])
          continue;
        this.editors[i].enable();
      }
    }
    this.switcher.disabled = false;
    this._super();
  },
  disable: function () {
    if (this.editors) {
      for (var i = 0; i < this.editors.length; i++) {
        if (!this.editors[i])
          continue;
        this.editors[i].disable();
      }
    }
    this.switcher.disabled = true;
    this._super();
  },
  destroy: function () {
    this._super();
  }
});
