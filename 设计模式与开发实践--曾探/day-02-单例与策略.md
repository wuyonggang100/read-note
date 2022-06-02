单例模式

> 保证一个类仅有一个实例，并提供一个访问它的全局访问点。

- 用一个变量来标志当前是否已经为某个类创建过对象，如果是，则在下一次获取该类的实例时，直接返回之前创建的对象；

惰性单例

> 惰性单例指的是在需要的时候才创建对象实例。

- 惰性单例是单例模式的重点，这种技术在实际开发中非常有用，有用的程度可能超出了我们的想象。

- 我们需要把不变的部分隔离出来，先不考虑创建一个div 和创建一个iframe 有多少差异，管
  理单例的逻辑其实是完全可以抽象出来的，这个逻辑始终是一样的：用一个变量来标志是否创建
  过对象，如果是，则在下次直接返回这个已经创建好的对象：

  ```js
  var obj;
  if ( !obj ){
    obj = xxx;
  }
  ```

- 把创建实例对象的职责和管理单例的职责分别放置在两个方法里，这两个方法可以独立变化而互不影响，当它们连接在一起的时候，就完成了创建唯一实例对象的功能。

  > 把如何管理单例的逻辑从原来的代码中抽离出来，这些逻辑被封装在getSingle
  > 函数内部，创建对象的方法fn 被当成参数动态传入getSingle 函数；

  比如，创建唯一的iframe 用于动态加载第三方页面：

  ```js
  var getSingle = function( fn ){
  	var result; // 闭包
  	return function(){
  		return result || ( result = fn .apply(this, arguments ) );
  	}
  };
  var createSingleIframe = getSingle( function(){
      var iframe = document.createElement ( 'iframe' );
      document.body.appendChild( iframe );
      return iframe;
  });
  document.getElementById( 'loginBtn' ).onclick = function(){
      var loginLayer = createSingleIframe();
      loginLayer.src = 'http://baidu.com';
  };
  ```

  比如给一个 div 盒子在添加点击事件，不用判断是在第几次 render 的时候来添加；以下代码 render 了三次，但是绑定事件只有一次；

  ```js
  var bindEvent = getSingle(function(){
      document.getElementById( 'div1' ).onclick = function(){
      	alert ( 'click' );
      }
      return true;
  });
  var render = function(){
      console.log( '开始渲染列表' );
      bindEvent();
  };
  render();
  render();
  render();
  ```

最后，我们在实际使用中应该将创建单例对象和管理单例对象的逻辑分开，做到解耦；



策略模式

- 策略模式的定义：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。策略模式的目的就是将算法的使用与算法的实现分离开来。

- 一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体
  的算法，并负责具体的计算过程。 第二个部分是环境类Context，Context 接受客户的请求，随后
  把请求委托给某一个策略类。要做到这点，说明Context 中要维持对某个策略对象的引用。

- 通过使用策略模式重构代码，我们消除了原程序中大片的条件分支语句

  ```js
  var strategies = {
      "S": function( salary ){
      	return salary * 4;
      },
      "A": function( salary ){
      	return salary * 3;
      },
      "B": function( salary ){
      	return salary * 2;
      }
  };
  var calculateBonus = function( level, salary ){
  	return strategies[ level ]( salary );
  };
  console.log( calculateBonus( 'S', 20000 ) ); // 输出：80000
  console.log( calculateBonus( 'A', 10000 ) ); // 输出：30000
  ```

- 策略模式实现小球动画

  > 从开始时间到结束时间中，计算每时每刻小球应该处于哪个位置，将改变 style 让小球处于该位置，看起来就是动画；

  ```js
  /* 每个缓动算法的参数：
      动画已消耗的时间、
      小球原始位置、
      小球目标位置、
      动画持续的总时间，
      返回的值则是动画元素应该处在的当前位置
    */
      var tween = {
        linear: function (t, b, c, d) {
          return c * t / d + b;
        },
        easeIn: function (t, b, c, d) {
          return c * (t /= d) * t + b;
        },
        strongEaseIn: function (t, b, c, d) {
          return c * (t /= d) * t * t * t * t + b;
        },
        strongEaseOut: function (t, b, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        sineaseIn: function (t, b, c, d) {
          return c * (t /= d) * t * t + b;
        },
        sineaseOut: function (t, b, c, d) {
          return c * ((t = t / d - 1) * t * t + 1) + b;
        }
      };
  
      var Animate = function (dom) {
        this.dom = dom; // 进行运动的dom 节点
        this.startTime = 0; // 动画开始时间
        this.startPos = 0; // 动画开始时，dom 节点的位置，即dom 的初始位置
        this.endPos = 0; // 动画结束时，dom 节点的位置，即dom 的目标位置
        this.propertyName = null; // dom 节点需要被改变的css 属性名
        this.easing = null; // 缓动算法
        this.duration = null; // 动画持续时间
      };
  
      /*
      propertyName：要改变的CSS 属性名，比如'left'、'top'，分别表示左右移动和上下移动。
      endPos： 小球运动的目标位置。
      duration： 动画持续时间。
      easing： 缓动算法。
      */
      Animate.prototype.start = function (propertyName, endPos, duration, easing) {
        this.startTime = +new Date; // 动画启动时间
        this.startPos = this.dom.getBoundingClientRect()[propertyName]; // dom 节点初始位置
        this.propertyName = propertyName; // dom 节点需要被改变的CSS 属性名
        this.endPos = endPos; // dom 节点目标位置
        this.duration = duration; // 动画持续事件
        this.easing = tween[easing]; // 缓动算法
        var self = this;
        var timeId = setInterval(function () { // 启动定时器，开始执行动画
          if (self.step() === false) { // 如果动画已结束，则清除定时器
            clearInterval(timeId);
          }
        }, 19);
      };
      Animate.prototype.step = function () {
        var t = +new Date; // 取得当前时间
        if (t >= this.startTime + this.duration) { // (1)
          this.update(this.endPos); // 更新小球的CSS 属性值
          return false;
        }
        var pos = this.easing(t - this.startTime, this.startPos,
          this.endPos - this.startPos, this.duration);
        // pos 为小球当前位置
        this.update(pos); // 更新小球的CSS 属性值
      };
  
      Animate.prototype.update = function (pos) {
        this.dom.style[this.propertyName] = pos + 'px';
      };
  
  
      // ------------- 让小球动起来--------------------------
      var div = document.getElementById('div');
      var animate = new Animate(div);
      animate.start('left', 500, 1000, 'strongEaseOut');
  // animate.start( 'top', 1500, 500, 'strongEaseIn' );
  ```

- 用策略模式重构表单单规则校验

  ```js
  // 策略算法定义
  var strategies = {
      isNonEmpty: function( value, errorMsg ){ // 不为空
          if ( value === '' ){
              return errorMsg ;
          }
  	},
  	minLength: function( value, length, errorMsg ){ // 限制最小长度
          if ( value.length < length ){
          	return errorMsg;
          }
      },
      isMobile: function( value, errorMsg ){ // 手机号码格式
      	if ( !/(^1[3|5|8][0-9]{9}$)/.test( value ) ){
      		return errorMsg;
      	}
      }
  };
  
  // Validator 类的实现：
  var Validator = function () {
      this.cache = []; // 保存全部校验规则
  };
  Validator.prototype.add = function (dom, rule, errorMsg) {
      var args = rule.split(':'); // 把strategy 和参数分开, args 最后是 策略执行时的参数
      this.cache.push(function () { // 把校验的步骤用空函数包装起来，并且放入cache
          var strategy = args.shift(); // 用户挑选的strategy
          args.unshift(dom.value); // 把input 的value 添加进参数列表头部
          args.push(errorMsg); // 把errorMsg 添加进参数列表
          return strategies[strategy].apply(dom, args);
      });
  };
  Validator.prototype.start = function () {
      for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
          var msg = validatorFunc(); // 开始校验，并取得校验后的返回信息
          if (msg) { // 如果有确切的返回值，说明校验没有通过
              return msg;
          }
      }
  };
  
  
  var validataFunc = function () {
        var validator = new Validator(); // 创建一个validator 对象
        /***************添加一些校验规则****************/
        validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
        validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6 位');
        validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确');
        var errorMsg = validator.start(); // 获得校验结果
        return errorMsg; // 返回校验结果
  }
  
  var registerForm = document.getElementById('registerForm');
  registerForm.onsubmit = function () {
      var errorMsg = validataFunc(); // 如果errorMsg 有确切的返回值，说明未通过校验
      if (errorMsg) {
          alert(errorMsg);
          return false; // 阻止表单提交
      }
  };
  ```

  

- 用策略模式重构表单多规则校验

  ```js
  <html>
  <body>
    <form action="http:// xxx.com/register" id="registerForm" method="post">
      请输入用户名：<input type="text" name="userName" />
      请输入密码：<input type="text" name="password" />
      请输入手机号码：<input type="text" name="phoneNumber" />
      <button>提交</button>
    </form>
    <script>
      /***********************策略对象**************************/
      var strategies = {
        isNonEmpty: function (value, errorMsg) {
          if (value === '') {
            return errorMsg;
          }
        },
        minLength: function (value, length, errorMsg) {
          if (value.length < length) {
            return errorMsg;
          }
        },
        isMobile: function (value, errorMsg) {
          if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
          }
        }
      };
      /***********************Validator 类**************************/
      var Validator = function () {
        this.cache = [];
      };
      Validator.prototype.add = function (dom, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
          (function (rule) {
            var strategyAry = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;
            self.cache.push(function () {
              var strategy = strategyAry.shift();
              strategyAry.unshift(dom.value);
              strategyAry.push(errorMsg);
              return strategies[strategy].apply(dom, strategyAry);
            });
          })(rule)
        }
      };
      Validator.prototype.start = function () {
        for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
          var errorMsg = validatorFunc();
          if (errorMsg) {
            return errorMsg;
          }
        }
      };
      /***********************客户调用代码**************************/
      var registerForm = document.getElementById('registerForm');
      var validataFunc = function () {
        var validator = new Validator();
        validator.add(registerForm.userName, [{
          strategy: 'isNonEmpty',
          errorMsg: '用户名不能为空'
        }, {
          strategy: 'minLength:6',
          errorMsg: '用户名长度不能小于10 位'
        }]);
        validator.add(registerForm.password, [{
          strategy: 'minLength:6',
          errorMsg: '密码长度不能小于6 位'
        }]);
        validator.add(registerForm.phoneNumber, [{
          strategy: 'isMobile',
          errorMsg: '手机号码格式不正确'
        }]);
        var errorMsg = validator.start();
        return errorMsg;
      }
      registerForm.onsubmit = function () {
        var errorMsg = validataFunc();
        if (errorMsg) {
          alert(errorMsg);
          return false;
        }
      };
    </script>
  </body>
  </html>
  ```

  

- 隐形策略模式

  > 将算法定义与算法的使用分离解耦了。

  ```js
  var S = function( salary ){
  	return salary * 4;
  };
  var A = function( salary ){
  	return salary * 3;
  };
  var B = function( salary ){
  	return salary * 2;
  };
  // 算法的使用与定义，分离解耦
  var calculateBonus = function( func, salary ){
  	return func( salary );
  };
  calculateBonus( S, 10000 ); // 输出：40000
  ```

  

- 缺点：要使用策略模式，必须了解所有的方案，必须了解各个方案之间的不同点，这样才能选择一个合适的方案或者算法。这是违反最少知识原则的。

- 总结：不管是使用 if--else 还是策略模式，都要覆盖全部场景，才会不出 bug， 可以在外层使用 try-catch 来增强；

