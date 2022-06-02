代理模式

- 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。
- 代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身
  对象来控制对这个对象的访问，客户实际上访问的是替身对象。替身对象对请求做出一些处理之
  后，再把请求转交给本体对象。

保护代理

代理端帮客户端过滤掉一些请求，保护代理用于控制不同权限的对象对目标对象的访问，但在JavaScript 并不容易实现保护代理，因为我们无法判断谁访问了某个对象。

虚拟代理

虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建。而虚拟代理是最常用的一种代理模式。



- 虚拟代理实现图片预加载

  > 代理负责预加载图片，预加载的操作完成之后，把请求重新交给本体MyImage。

  ```js
  // 塞进一个 img node
  var myImage = (function () {
      var imgNode = document.createElement('img');
      document.body.appendChild(imgNode);
      return {
          setSrc: function (src) {
              imgNode.src = src;
          }
      }
  })();
  // 设置代理
  var proxyImage = (function () {
      var img = new Image;
      img.onload = function () {
          // 图片加载回来后设置真实图
          myImage.setSrc(this.src);
      }
      return {
          setSrc: function (src) {
              // 先设置默认 loading 图
              myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif');
              img.src = src;
          }
      }
  })();
  proxyImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
  ```

单一职责原则：

单一职责原则指的是，就一个类（通常也包括对象和函数等）而言，应该仅有一个引起它变
化的原因。如果一个对象承担了多项职责，就意味着这个对象将变得巨大，引起它变化的原因可
能会有多个。面向对象设计鼓励将行为分布到细粒度的对象之中，如果一个对象承担的职责过多，
等于把这些职责耦合到了一起，这种耦合会导致脆弱和低内聚的设计。当变化发生时，设计可能
会遭到意外的破坏。职责被定义为“引起变化的原因”。在面向对象的程序设计中，大多数情况下，若违反其他任何原则，同时将违反开放—
封闭原则。

代理和本体接口的一致性

代理对象和本体都对外提供了同名方法，在客户看来，代理对象和本体
是一致的， 代理接手请求的过程对于用户来说是透明的，用户并不清楚代理和本体的区别，这
样做有两个好处。

- 用户可以放心地请求代理，他只关心是否能得到想要的结果。
- 在任何使用本体的地方都可以替换成使用代理。 

Java 等语言中，代理和本体都需要显式地实现同一个接口，一方面接口保证了它们会拥
有同样的方法，另一方面，面向接口编程迎合依赖倒置原则，通过接口进行向上转型，从而避开
编译器的类型检查，代理和本体将来可以被替换使用。

如果代理对象和本体对象都为一个函数（函数也是对象），且参数相同，函数必然都能被执行，则可以认为它们也具有一致的“接口”。



虚拟代理合并HTTP 请求

```js
var synchronousFile = function (id) {
      console.log('开始同步文件，id 为: ' + id);
};
var proxySynchronousFile = (function () {
    var cache = [], // 保存一段时间内需要同步的ID
        timer; // 定时器
    return function (id) {
        cache.push(id);
        if (timer) { // 保证不会覆盖已经启动的定时器
            return;
        }
        // 当真正执行时已经缓存了2s内全部需要同步的信息
        timer = setTimeout(function () {
            synchronousFile(cache.join(',')); // 2 秒后向本体发送需要同步的ID 集合
            clearTimeout(timer); // 清空定时器
            timer = null;
            cache.length = 0; // 清空ID 集合
        }, 2000);
    }
})();
var checkbox = document.getElementsByTagName('input');
for (var i = 0, c; c = checkbox[i++];) {


    c.onclick = function () {
        if (this.checked === true) {
            proxySynchronousFile(this.id);
        }
    }
};
```

虚拟代理实现惰性加载

> 当开启控制台时才加载真正的 miniConsole.js 文件，在此之前都是使用提供了相同 API  方法的代理 miniConsole 对象；

```js
// 得到虚拟代理对象
var miniConsole = (function () {
    var cache = [];
    // 打开控制台后就加载本体对象，加载完成后代理对象被释放
    var handler = function (ev) {
        if (ev.keyCode === 113) {
            var script = document.createElement('script');
            script.onload = function () {
                for (var i = 0, fn; fn = cache[i++];) {
                    fn();
                }
            };
            script.src = 'miniConsole.js';
            document.getElementsByTagName('head')[0].appendChild(script);
            document.body.removeEventListener('keydown', handler);// 只加载一次miniConsole.js
        }
    };
    document.body.addEventListener('keydown', handler, false);
    
    // 返回一个虚拟代理对象，拥有与本体对象相同的 API，将真实操作函数缓存在 cache 里，等到打开控制台后释放执行
    return {
        log: function () {
            var args = arguments;
            cache.push(function () {
                return miniConsole.log.apply(miniConsole, args);
            });
        }
    }
})();
miniConsole.log(11); // 开始打印log

// miniConsole.js 代码
miniConsole = {
    log: function () {
        // 真正代码
        console.log(Array.prototype.join.call(arguments));
    }
};
```

- 缓存代理

缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果。缓存功能有代理对象实现，本体对象只需要专注于计算。

```js
var proxyMult = (function(){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call( arguments, ',' );
        if ( args in cache ){
        	return cache[ args ];
    	}
    	return cache[ args ] = mult.apply( this, arguments );
    }
})();
proxyMult( 1, 2, 3, 4 ); // 输出：24
proxyMult( 1, 2, 3, 4 ); // 输出：24
```



代理模式包括许多小分类，在JavaScript 开发中最常用的是虚拟代理和缓存代理。往往不需要去预先猜测是否需要使用代理模式，当真正发现不方便直接访问某个对象的时候，再编写代理也不迟。



































