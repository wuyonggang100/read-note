# 装饰者模式

## 一、由来

在程序开发中，许多时候都并不希望某个类天生就非常庞大，一次性包含许多职责。那么我们就可以使用装饰者模式。装饰者模式可以动态地给某个对象添加一些额外的职责，而不会影响从这个类中派生的其他对象。

在传统的面向对象语言中，给对象添加功能常常使用继承的方式，但是继承的方式并不灵活，还会带来许多问题：一方面会导致超类和子类之间存在强耦合性，当超类改变时，子类也会随之改变；另一方面，继承这种功能复用方式通常被称为“白箱复用”，“白箱”是相对可见性而言的，在继承方式中，超类的内部细节是对子类可见的，继承常常被认为破坏了封装性。使用继承还会带来另外一个问题，在完成一些功能复用的同时，有可能创建出大量的子类，使子类的数量呈爆炸性增长。

这种给对象动态地增加职责的方式称为装饰者（decorator）模式。装饰者模式能够在不改变对象自身的基础上在程序运行期间给对象动态地添加职责。跟继承相比，装饰者是一种更轻便灵活的做法，这是一种“即用即付”的式。

二、示例

1、飞机大战

> 装饰者模式将一个对象嵌入另一个对象之中，实际上相当于这个对象被另一个对象包装起来，形成一条包装链。请求随着这条链依次传递到所有的对象，每个对象都有处理这条请求的机会；

```js
var Plane = function () {};
Plane.prototype.fire = function () {
    console.log("发射普通子弹");
};
// 接下来增加两个装饰类，分别是导弹和原子弹
var MissileDecorator = function (plane) {
    this.plane = plane;
};
MissileDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log("发射导弹");
};
var AtomDecorator = function (plane) {
    this.plane = plane;
};
AtomDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log("发射原子弹");
};
var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);
plane.fire();
// 分别输出： 发射普通子弹、发射导弹、发射原子弹
```

2、不使用类来实现

```js
var plane = {
    fire: function () {
        console.log("发射普通子弹");
    },
};
var missileDecorator = function () {
    console.log("发射导弹");
};
var atomDecorator = function () {
    console.log("发射原子弹");
};
var fire1 = plane.fire;
plane.fire = function () {
    fire1();
    missileDecorator();
};
var fire2 = plane.fire;
plane.fire = function () {
    fire2();
    atomDecorator();
};
plane.fire();
// 分别输出： 发射普通子弹、发射导弹、发射原子弹
```

3、装饰函数

> JavaScript 中可以很方便地给某个对象扩展属性和方法，但却很难在不改动某个函数源代码的情况下，给该函数添加一些额外的功能。在代码的运行期间，很难切入某个函数的执行环境。要想为函数添加一些功能，最简单粗暴的方式就是直接改写该函数，但这是最差的办法，直接违反了开放封闭原则;

- 方案1：通过保存原引用的方式可以改写某个函数，如以下切片编程方式；但这种方式带来的问题，1 要维护中间变量，2 要维护 this , 防止 this 发生改变；

```js
var _getElementById = document.getElementById; 
document.getElementById = function(){ 
  alert (1); 
  return _getElementById.apply( document, arguments ); // 绑定 this
} 
var button = document.getElementById( 'button' );
```

- 方案2：使用 AOP 装饰函数

  ```js
  Function.prototype.before = function( beforefn ){ 
      var __self = this; 
      return function(){ 
          beforefn.apply( this, arguments ); 
          return __self.apply( this, arguments ); 
      } 
  }
  document.getElementById = document.getElementById.before(function(){ 
    alert (1); 
  }); 
  var button = document.getElementById( 'button' );
  ```

  AOP 示例 2

  ```js
  window.onload = ( window.onload || function(){} ).after(function(){ 
    alert (2); 
  }).after(function(){ 
    alert (3); 
  }).after(function(){ 
    alert (4); 
  });
  ```

  以上都是给 Function的原型增加方法，会污染原型，可以把原函数和新函数都作为参数传入before 或者 after 方法；

  ```js
  var before = function( fn, beforefn ){ 
       return function(){ 
           beforefn.apply( this, arguments ); 
           return fn.apply( this, arguments ); 
       } 
  } 
  var a = before( 
       function(){alert (3)}, 
       function(){alert (2)} 
  ); 
  a = before( a, function(){alert (1);} ); 
  a();
  ```

  ### AOP 应用

  > Aspect Oriented Programming（AOP）面向切面编程；

  可以把行为依照职责分成粒度更细的函数，随后通过装饰把它们合并到一起，这有助于编写一个松耦合和高复用性的系统。

  #### 1、AOP应用之一：分离业务代码和数据统计代码

  ```js
  Function.prototype.after = function (afterfn) {
      var __self = this;
      return function () {
          var ret = __self.apply(this, arguments);
          afterfn.apply(this, arguments);
          return ret;
      };
  };
  var showLogin = function () {
      console.log('打开登录浮层');
  };
  var log = function () {
      console.log('上报标签为: ' + this.getAttribute('tag'));
  };
  showLogin = showLogin.after(log); // 打开登录浮层之后上报数据
  document.getElementById('button').onclick = showLogin;
  ```

  #### 2、用 AOP 动态改变函数的参数

  - 通过 Function.prototype.before 方法给函数 func 的参数 param 动态地添加属性 b：

    ```js
    var func = function (param) {
        console.log(param); // 输出： {a: "a", b: "b"}
    };
    func = func.before(function (param) {
        param.b = 'b';
    });
    func({ a: 'a' });
    ```

  - 通过 Function.prototyte.before 将 token 装饰到 ajax 函数的参数 param 对象，给每个请求带上 token；

    ```js
    var getToken = function () {
        return 'Token';
    };
    ajax = ajax.before(function (type, url, param) {
        param.Token = getToken();
    });
    ajax('get', 'http:// xxx.com/userinfo', { name: 'sven' });
    ```

  - 修改 Function.prototype.after 方法将表单的校验输入和提交两部分完全分离开；

    ```js
    Function.prototype.before = function (beforefn) {
        var __self = this;
        return function () {
            if (beforefn.apply(this, arguments) === false) {
                // beforefn 返回 false 的情况直接 return，不再执行后面的原函数
                return;
            }
            return __self.apply(this, arguments);
        };
    };
    var validata = function () {
        if (username.value === '') {
            alert('用户名不能为空');
            return false;
        }
        if (password.value === '') {
            alert('密码不能为空');
            return false;
        }
    };
    var formSubmit = function () {
        var param = {
            username: username.value,
            password: password.value,
        };
        ajax('http:// xxx.com/login', param);
    };
    formSubmit = formSubmit.before(validata);
    ```

    函数通过以上 after 或 before 方法装饰后，返回的是一个新的函数，如果在原函数上保存了一些属性，那么这些属性会丢失。叠加了函数的作用域，如果装饰的链条过长，性能上也会受到一些影响。

    ```js
    var func = function(){ 
        alert( 1 ); 
    } 
    func.a = 'a'; 
    func = func.after( function(){ 
        alert( 2 ); 
    }); 
    alert ( func.a ); // 输出：undefined
    ```

### 装饰者和代理模式区别

代理：当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者。代理模式通常只有一层代理本体的引用，而装饰者模式经常会形成一条长长的装饰链。

装饰者模式是实实在在的为对象增加新的职责和行为，而代理做的事情还是跟本体一样，













































