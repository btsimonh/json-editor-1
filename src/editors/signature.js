JSONEditor.defaults.editors.signature = JSONEditor.AbstractEditor.extend({
  getNumColumns: function () {
    return 4;
  },
  build: function () {
    var self = this;
    this.title = this.header = this.label = this.theme.getFormInputLabel(this.getTitle());
    if (this.schema.description)
      this.description = this.theme.getFormInputDescription(this.schema.description);

    // Input that holds the base64 string

    var divElem = this.theme.getContainer();
    $(divElem).addClass("signature");
    var uuid = $uuid();

    var canvas = this.theme.getCanvas();
    canvas.setAttribute("id", uuid);

    divElem.appendChild(canvas);
    self.input = divElem;

    if (SignaturePad) {
      this.signaturePad = new SignaturePad(canvas);
      var sigpad = this.signaturePad;
      sigpad.onEnd = function () {
        self.setValue(
                {
                  dataURI: sigpad.toDataURL(),
                  height: canvas.height,
                  width: canvas.width,
                  timestamp: self.translate("signature_timestamp", [(new Date()).toLocaleString()]),
                  hasValue: !self.signaturePad.isEmpty()
                }
        );
        self.jsoneditor.notifyWatchers(self.path);
        if (self.parent)
          self.parent.onChildEditorChange(self);
        else
          self.jsoneditor.onChange();
      };
      var buttonHolder = this.theme.getButtonHolder();
      var button = this.getButton(self.translate("clear_signature_button"), 'cancel');
      buttonHolder.appendChild(button);
      button.addEventListener("click",
              function () {
                self.signaturePad.clear();
                self.setValue("");
                self.jsoneditor.notifyWatchers(self.path);
              }); // clear signature on press.
      divElem.appendChild(buttonHolder);
    } else {
      this.signaturePad = undefined;
    }


    if (this.getOption('compact'))
      this.container.setAttribute('class', this.container.getAttribute('class') + ' compact');

    if (this.schema.readOnly || this.schema.readonly || this.schema.template) {
      this.always_disabled = true;
    }

    // Compile and store the template
    if (this.schema.template) {
      this.template = this.jsoneditor.compileTemplate(this.schema.template, this.template_engine);
      this.jsoneditor.notifyWatchers(this.path);
    }
    else {
      this.jsoneditor.notifyWatchers(this.path);
    }

    this.control = this.theme.getFormControl(this.label, divElem, this.description);
    this.container.appendChild(this.control);

    window.addEventListener("resize", resizeCanvas);
    function resizeCanvas() {
      canvas.width = $(canvas).parent().width();
      canvas.height = $(canvas).parent().height();
    }
    resizeCanvas();

  },
  enable: function () {
    this._super();
  },
  disable: function () {
    this._super();
  },
  setValue: function (val) {
    if (val === null)
      val = "";
    else if (typeof val === "object")
      val = JSON.stringify(val);
    else if (typeof val !== "string")
      val = "" + val;

    if (val === this.serialized)
      return;

    var changed = this.getValue() !== val;
    this.value = val;
    // Bubble this setValue to parents if the value changed
    this.onChange(changed);

  },
  showValidationErrors: function (errors) {
    var self = this;

    var messages = [];
    $each(errors, function (i, error) {
      if (error.path === self.path) {
        messages.push(error.message);
      }
    });

    if (messages.length) {
      this.theme.addInputError(this.input, messages.join('. ') + '.');
    }
    else {
      this.theme.removeInputError(this.input);
    }
  }
});
