发布订阅

发布—订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状
态发生改变时，所有依赖于它的对象都将得到通知。在JavaScript 开发中，我们一般用事件模型
来替代传统的发布—订阅模式。

自定义事件

> 最简单形式的发布订阅， 全部的发布会让每个订阅者都收到，不能实现精准的发布订阅，

```js
// 定义售楼处
var salesOffices = {
    clientList: [], // 缓存列表，存放订阅者的回调函数
    listen: function (fn) {
        // 增加订阅者
        this.clientList.push(fn); // 订阅的消息添加进缓存列表
    },
    trigger: function () {
        // 发布消息
        for (var i = 0, fn; (fn = this.clientList[i++]); ) {
            fn.apply(this, arguments); // (2) // arguments 是发布消息时带上的参数
        }
    },
};
// salesOffices.salesOffices.salesOffices.
// 下面我们来进行一些简单的测试：
salesOffices.listen(function (price, squareMeter) {
    // 小明订阅消息
    console.log("价格= " + price);
    console.log("squareMeter= " + squareMeter);
});
salesOffices.listen(function (price, squareMeter) {
    // 小红订阅消息
    console.log("价格= " + price);
    console.log("squareMeter= " + squareMeter);
});
salesOffices.trigger(2000000, 88); // 输出：200 万，88 平方米
salesOffices.trigger(3000000, 110); // 输出：300 万，110 平方米
```



> 优化后的发布订阅,  将 缓存列表改成了对象，然后每个 key 的值是一个 数组，这样就可以按 key 来区分，实现精准的发布订阅

```js
var salesOffices = {
    clientList: {}, // 缓存列表，存放订阅者的回调函数
    listen: function (key, fn) {
        if (!this.clientList[key]) {
            // 如果还没有订阅过此类消息，给该类消息创建一个缓存列表
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn); // 订阅的消息添加进消息缓存列表
    },
    trigger: function () {
        // 发布消息
        var key = Array.prototype.shift.call(arguments), // 取出消息类型
            fns = this.clientList[key]; // 取出该消息对应的回调函数集合
        if (!fns || fns.length === 0) {
            // 如果没有订阅该消息，则返回
            return false;
        }
        for (var i = 0, fn; (fn = fns[i++]); ) {
            fn.apply(this, arguments); // (2) // arguments 是发布消息时附送的参数
        }
    },
};
salesOffices.listen("squareMeter88", function (price) {
    // 小明订阅88 平方米房子的消息
    console.log("价格= " + price); // 输出： 2000000
});
salesOffices.listen("squareMeter110", function (price) {
    // 小红订阅110 平方米房子的消息
    console.log("价格= " + price); // 输出： 3000000
});
salesOffices.trigger("squareMeter88", 2000000); // 发布88 平方米房子的价格
salesOffices.trigger("squareMeter110", 3000000); // 发布110 平方米房子的价格
```



> 通用后的发布订阅，让每个对象都可以有发布订阅功能

```js
var event = {
    clientList: [],
    listen: function (key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
    },
    trigger: function () {
        var key = Array.prototype.shift.call(arguments), // (1);
            fns = this.clientList[key];
        if (!fns || fns.length === 0) {
            // 如果没有绑定对应的消息
            return false;
        }
        for (var i = 0, fn; (fn = fns[i++]); ) {
            fn.apply(this, arguments); // (2) // arguments 是trigger 时带上的参数
        }
    },
    remove: function (key, fn) {
        var fns = this.clientList[key];
        if (!fns) {
            // 如果key 对应的消息没有被人订阅，则直接返回
            return false;
        }
        if (!fn) {
            // 如果没有传入具体的回调函数，表示需要取消key 对应消息的所有订阅
            fns && (fns.length = 0);
        } else {
            for (var l = fns.length - 1; l >= 0; l--) {
                // 反向遍历订阅的回调函数列表
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1); // 删除订阅者的回调函数
                }
            }
        }
    },
};
// 再定义一个installEvent 函数，这个函数可以给所有的对象都动态安装发布—订阅功能：
var installEvent = function (obj) {
    for (var i in event) {
        obj[i] = event[i];
    }
};
// 再来测试一番，我们给售楼处对象salesOffices 动态增加发布—订阅功能：
var salesOffices = {};
installEvent(salesOffices);
salesOffices.listen("squareMeter88", function (price) {
    // 小明订阅消息
    console.log("价格= " + price);
});
salesOffices.listen("squareMeter100", function (price) {
    // 小红订阅消息
    console.log("价格= " + price);
});
salesOffices.trigger("squareMeter88", 2000000); // 输出：2000000
salesOffices.trigger("squareMeter100", 3000000); // 输出：3000000
salesOffices.remove( 'squareMeter88', fn1 ); // 删除小明的订阅
salesOffices.trigger( 'squareMeter88', 2000000 ); // 输出：2000000
```

以上通用模式存在一定问题，

- 给每个发布者对象都添加了listen 和trigger 方法，以及一个缓存列表clientList，这其实是一种资源浪费。
- 订阅者和发布者存在一定耦合，订阅者需要知道发布者的名字，才能顺利的订阅到事件；





全局发布订阅

> 共用一个对象，全局使用，可以在模块之间进行通信

```js
var Event = (function () {
    var clientList = {},
        listen,
        trigger,
        remove;
    listen = function (key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };
    trigger = function () {
        var key = Array.prototype.shift.call(arguments),
            fns = clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; (fn = fns[i++]); ) {
            fn.apply(this, arguments);
        }
    };
    remove = function (key, fn) {
        var fns = clientList[key];
        if (!fns) {
            return false;
        }

        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var l = fns.length - 1; l >= 0; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1);
                }
            }
        }
    };
    return {
        listen: listen,
        trigger: trigger,
        remove: remove,
    };
})();
Event.listen("squareMeter88", function (price) {
    // 小红订阅消息
    console.log("价格= " + price); // 输出：'价格=2000000'
});
Event.trigger("squareMeter88", 2000000); // 售楼处发布消息
```

带命名空间，可以先发布后订阅的发布订阅

>

```js
var Event = (function () {
    var global = this,
        Event,
        _default = "default";
    Event = (function () {
        var _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,
            find,
            each = function (ary, fn) {
                var ret;
                for (var i = 0, l = ary.length; i < l; i++) {
                    var n = ary[i];
                    ret = fn.call(n, i, n);
                }
                return ret;
            };
        _listen = function (key, fn, cache) {
            if (!cache[key]) {
                cache[key] = [];
            }
            cache[key].push(fn);
        };
        _remove = function (key, cache, fn) {
            if (cache[key]) {
                if (fn) {
                    for (var i = cache[key].length; i >= 0; i--) {
                        if (cache[key][i] === fn) {
                            cache[key].splice(i, 1);
                        }
                    }
                } else {
                    cache[key] = [];
                }
            }
        };
        _trigger = function () {
            var cache = _shift.call(arguments),
                key = _shift.call(arguments),
                args = arguments,
                _self = this,
                ret,
                stack = cache[key];
            if (!stack || !stack.length) {
                return;
            }
            return each(stack, function () {
                return this.apply(_self, args);
            });
        };
        _create = function (namespace) {
            var namespace = namespace || _default;
            var cache = {},
                offlineStack = [], // 离线事件
                ret = {
                    listen: function (key, fn, last) {
                        _listen(key, fn, cache);
                        if (offlineStack === null) {
                            return;
                        }
                        if (last === "last") {
                            offlineStack.length && offlineStack.pop()();
                        } else {
                            each(offlineStack, function () {
                                this();
                            });
                        }
                        offlineStack = null;
                    },
                    one: function (key, fn, last) {
                        _remove(key, cache);
                        this.listen(key, fn, last);
                    },
                    remove: function (key, fn) {
                        _remove(key, cache, fn);
                    },
                    trigger: function () {
                        var fn,
                            args,
                            _self = this;
                        _unshift.call(arguments, cache);
                        args = arguments;
                        fn = function () {
                            return _trigger.apply(_self, args);
                        };
                        if (offlineStack) {
                            return offlineStack.push(fn);
                        }
                        return fn();
                    },
                };
            return namespace
                ? namespaceCache[namespace]
                ? namespaceCache[namespace]
            : (namespaceCache[namespace] = ret)
            : ret;
        };
        return {
            create: _create,
            one: function (key, fn, last) {
                var event = this.create();
                event.one(key, fn, last);
            },
            remove: function (key, fn) {
                var event = this.create();
                event.remove(key, fn);
            },
            listen: function (key, fn, last) {
                var event = this.create();
                event.listen(key, fn, last);
            },
            trigger: function () {
                var event = this.create();
                event.trigger.apply(this, arguments);
            },
        };
    })();
    return Event;
})();
```

使用：

```js
/************** 先发布后订阅 ********************/
Event.trigger( 'click', 1 );
Event.listen( 'click', function( a ){
	console.log( a ); // 输出：1
});
/************** 使用命名空间 ********************/
Event.create( 'namespace1' ).listen( 'click', function( a ){
	console.log( a ); // 输出：1
});
Event.create( 'namespace1' ).trigger( 'click', 1 );
Event.create( 'namespace2' ).listen( 'click', function( a ){
	console.log( a ); // 输出：2
});
Event.create( 'namespace2' ).trigger( 'click', 2 );
```



总结： 发布订阅的三大必备件，中间 缓存列表，监听函数。触发函数， 缓存列表起到分发的作用，负责收集订阅者，在发布时将消息挨个发给订阅者，或者挨个触发订阅者的某个回调。除此外，还可以有 移除监听等其他方法。发布—订阅模式虽然可以弱化对象之间的联系，但如果过度使用的话，对象和对象之间的必要联
系也将被深埋在背后，会导致程序难以跟踪维护和理解。特别是有多个发布者和订阅者嵌套到一
起的时候，要跟踪一个bug 不是件轻松的事情。