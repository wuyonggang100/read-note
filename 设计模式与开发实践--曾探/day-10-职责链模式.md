# 职责链模式

### 一、定义

职责链模式的定义是：使多个对象都有机会处理请求，从而避免请求的发送者和接收者之间的耦合关系，将这些对象连成一条链，并沿着这条链传递该请求，直到有一个对象处理它为止。

职责链模式的名字非常形象，一系列可能会处理请求的对象被连接成一条链，请求在这些对象之间依次传递，直到遇到一个可以处理它的对象，我们把这些对象称为链中的**节点**。类似**击鼓传花** 。

### 二、解决的问题

职责链模式的最大优点：请求发送者只需要知道链中的第一个节点，从而弱化了发送者和一组接收者之间的强联系。如果不使用职责链模式，那么在公交车上，我就得先搞清楚谁是售票员，才能把硬币递给他。

### 三、实例

##### 1、使用职责链模式买手机

场景描述

> 公司针对支付过定金的用户有一定的优惠政策。在正式购买后，已经支付过500 元定金的用户会收到100 元的商城优惠券，200 元定金的用户可以收到50 元的优惠券，而之前没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况下不一定保证能买到。
>
> - orderType：表示订单类型（定金用户或者普通购买用户），code 的值为1 的时候是500 元
>
> ​     定金用户，为2 的时候是200 元定金用户，为3 的时候是普通购买用户。
>
> - pay：表示用户是否已经支付定金，值为true 或者false, 虽然用户已经下过500 元定金的
>
> ​     订单，但如果他一直没有支付定金，现在只能降级进入普通购买模式。
>
> - stock：表示当前用于普通购买的手机库存数量，已经支付过500 元或者200 元定金的用
>
> ​     户不受此限制。

```js
// 预先定义需要使用的节点
var order500 = function (orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log("500 元定金预购，得到100 优惠券");
    } else {
        return "nextSuccessor"; // 我不知道下一个节点是谁，反正把请求往后面传递
    }
};
var order200 = function (orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log("200 元定金预购，得到50 优惠券");
    } else {
        return "nextSuccessor"; // 我不知道下一个节点是谁，反正把请求往后面传递
    }
};
var orderNormal = function (orderType, pay, stock) {
    if (stock > 0) {
        console.log("普通购买，无优惠券");
    } else {
        console.log("手机库存不足");
    }
};
// 职责链节点对象，可以
var Chain = function (fn) {
    this.fn = fn;
    this.successor = null;
};
// 设置当前节点的下一个节点，并返回当前节点
Chain.prototype.setNextSuccessor = function (successor) {
    return (this.successor = successor);
};
// 可以将请求交给下一个节点执行，或者当前节点执行，最后返回执行结果
Chain.prototype.passRequest = function () {
    var ret = this.fn.apply(this, arguments);
    if (ret === "nextSuccessor") {
        return (
            this.successor &&
            this.successor.passRequest.apply(this.successor, arguments)
        );
    }
    return ret;
};

// 把3 个订单函数分别包装成职责链的节点
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);
// 然后指定节点在职责链中的顺序：
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);
// 最后把请求传递给第一个节点，以下是四个请求
chainOrder500.passRequest(1, true, 500); // 输出：500 元定金预购，得到100 优惠券
chainOrder500.passRequest(2, true, 500); // 输出：200 元定金预购，得到50 优惠券
chainOrder500.passRequest(3, true, 500); // 输出：普通购买，无优惠券
chainOrder500.passRequest(1, false, 0); // 输出：手机库存不足
```

以上代码中，各个职责链节点之间没有耦合，可以随意拆分，只需要指定顺序即可；

##### 2、异步职责链

开发中经常会遇到一些异步的问题，比如要在节点函数中发起一个ajax 异步请求，异步请求返回的结果才能决定是否继续在职责链中 passRequest。要给Chain 类再增加一个原型方法Chain.prototype.next，表示手动传递请求给职责链中的下一个节点：

```js
Chain.prototype.next = function () {
    return (
        this.successor &&
        this.successor.passRequest.apply(this.successor, arguments)
    );
};
var fn1 = new Chain(function () {
    console.log(1);
    return "nextSuccessor";
});
var fn2 = new Chain(function () {
    console.log(2);
    var self = this;
    setTimeout(function () {
        self.next();
    }, 1000);
});
var fn3 = new Chain(function () {
    console.log(3);
});
fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();
```

异步的职责链加上命令模式（把ajax 请求封装成命令对象），可以很方便地创建一个异步ajax 队列库。

### 四、优缺点

##### 1、优点

职责链模式的最大优点就是解耦了请求发送者和N 个接收者之间的复杂关系，由于不知道链中的哪个节点可以处理你发出的请求，所以你只需把请求传递给第一个节点即可；

其次，使用了职责链模式之后，链中的节点对象可以灵活地拆分重组。增加或者删除一个节点，或者改变节点在链中的位置都是轻而易举的事情；

可以手动指定起始节点，请求并不是非得从链中的第一个节点开始传递，可以减少请求在链中的传递次数，更快地找到合适的请求接受者。这在普通的条件分支语句下是做不到的，我们没有办法让请求越过某一个if 判断。

##### 2、缺点

1. 不能保证某个请求一定会被链中的节点处理，此时的请求就得不到答复，而是径直从链尾离开，或者抛出一个错误异常。

   > 在这种情况下，可以在链尾增加一个保底的接受者节点来处理这种即将离开链尾的请求。

2. 职责链模式使得程序中多了一些节点对象，可能在某一次的请求传递过程中，大部分节点并没有起到实质性的作用，它们的作用仅仅是让请求传递下去，从性能方面考虑，我们要避免过长的职责链带来的性能损耗。

### 五、使用 AOP 来实现职责链

用AOP 来实现职责链既简单又巧妙，但这种把函数叠在一起的方式，同时也叠加了函数的作用域，如果链条太长的话，也会对性能有较大的影响。

```js
Function.prototype.after = function (fn) {
    var self = this; // this 是调用 after 的函数本身
    return function () {
        var ret = self.apply(this, arguments);
        if (ret === "nextSuccessor") {
            return fn.apply(this, arguments);
        }
        return ret;
    };
};
var order = order500yuan.after(order200yuan).after(orderNormal);
order(1, true, 500); // 输出：500 元定金预购，得到100 优惠券
order(2, true, 500); // 输出：200 元定金预购，得到50 优惠券
order(1, false, 500); // 输出：普通购买，无优惠券
```

### 六、用AOP职责链模式获取文件上传对象

> 可以用来做兼容降级的处理，顺序从前向后，最后总有一个命中；

```js
var getActiveUploadObj = function () {
    try {
        return new ActiveXObject("TXFTNActiveX.FTNUpload"); // IE 上传控件
    } catch (e) {
        return "nextSuccessor";
    }
};
var getFlashUploadObj = function () {
    if (supportFlash()) {
        var str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($("body"));
    }
    return "nextSuccessor";
};
var getFormUpladObj = function () {
    return $('<form><input name="file" type="file"/></form>').appendTo(
        $("body")
    );
};
var getUploadObj = getActiveUploadObj
.after(getFlashUploadObj)
.after(getFormUpladObj);
console.log(getUploadObj());
```

只要运用得当，职责链模式可以很好地帮助我们管理代码，降低发起请求的对象和处理请求的对象之间的耦合性。职责链中的节点数量和顺序是可以自由变化的，我们可以在运行时决定链中包含哪些节点。无论是作用域链、原型链，还是DOM节点中的事件冒泡，我们都能从中找到职责链模式的影子。职责链模式还可以和组合模式结合在一起，用来连接部件和父部件，或是提高组合对象的效率。



























