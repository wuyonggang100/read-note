function isFalsy(val) {
  return val === null || val === undefined || val === "";
}

var strategies = {
  isRequired: function (value, errorMsg) {
    if (isFalsy(value)) {
      return errorMsg;
    }
  },
  minLength: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  isMobile: function (value, errorMsg) {
    if (!/(^1[0-9]{10}$)/.test(value)) {
      return errorMsg;
    }
  },
  isNumber: function (value, errorMsg) {
    if (!/^[1-9]d*$/.test(value)) {
      return errorMsg;
    }
  },
};
/***********************Validator 类**************************/
var Validator = function (form) {
  this.cache = [];
  this.errors = [];
  this.form = form;
};
Validator.prototype.add = function (field, rules) {
  var self = this;
  for (var i = 0, rule; (rule = rules[i++]); ) {
    (function (rule) {
      var args = rule.ruleType.split(":");
      var errorMsg = rule.errorMsg;
      var dom = self.form[field];
      self.cache.push({
        field: field,
        validator: function () {
          var ruleType = args.shift();
          var value = dom.value;
          args.unshift(value);
          args.push(errorMsg);
          return strategies[ruleType].apply(dom, args);
        },
      });
    })(rule);
  }
};
Validator.prototype.start = function () {
  for (var i = 0; i < this.cache.length; i++) {
    var rule = this.cache[i];
    var errorMsg = rule.validator();
    if (errorMsg) {
      if (!this.form[rule.field].classList.contains("is-error")) {
        this.form[rule.field].classList.add("is-error");
        this.errors.push(errorMsg);
        let p = document.createElement("p");
        p.innerHTML = errorMsg;
        // this.form.insertBefore(p, this.form[rule.field].nextSibling);
      }
    } else {
      this.form[rule.field].classList.toggle("is-error");
      if (this.form[rule.field].nextSibling) {
        this.form[rule.field].nextSibling.remove();
        // this.form.removeChild(this.form[rule.field].nextSibling);
      }
    }
  }
  return this.errors;
};

Validator.prototype.validate = function (rules) {
  for (var field in rules) {
    this.add(field, rules[field]);
  }
  var errors = this.start();
  return errors;
};

/***********************客户调用代码**************************/
var registerForm = document.getElementById("registerForm");
var validataFunc = function () {
  var validator = new Validator(registerForm);
  var errorMsgs = validator.validate({
    username: [
      {
        ruleType: "isRequired",
        errorMsg: "用户名不能为空",
      },
      {
        ruleType: "minLength:6",
        errorMsg: "用户名长度不能小于6 位",
      },
    ],
    phone: [
      {
        ruleType: "isMobile",
        errorMsg: "手机号码格式不正确",
      },
    ],
    age: [
      {
        ruleType: "isNumber",
        errorMsg: "请输入正整数",
      },
    ],
  });
  return errorMsgs;
};

function submit() {
  var errorMsgs = validataFunc();
  if (errorMsgs.length > 0) {
    console.log(errorMsgs);
    return false;
  }
}
