## 模板方法模式

模板方法模式是一种只需使用继承就可以实现的非常简单的模式。

> 模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

模板方法模式解决的问题： 一些平行的子类之间有一些相同的行为，也有一些不同的行为。如果相同和不同的行为都混合在各个子类的实现中，说明这些相同的行为会在各个子类中重复出现。模板方法模式可以将相同的行为搬移到一个单一的地方；

在模板方法模式中，子类实现中的相同部分被上移到父类中，而将不同的部分留待子类来实现。这也很好地体现了泛化的思想。

#### 实现：

1、先找出平行子类之间的相同点，构造出父类，以及父类的抽象方法；

2、创建子类，继承父类，并实现父类的抽象方法；

```js
// ==============创建父类===============
var Beverage = function () {};
Beverage.prototype.boilWater = function () {
    console.log("把水煮沸");
};
Beverage.prototype.brew = function () {}; // 空方法，应该由子类重写
Beverage.prototype.pourInCup = function () {}; // 空方法，应该由子类重写
Beverage.prototype.addCondiments = function () {}; // 空方法，应该由子类重写

// 模板方法
Beverage.prototype.init = function () {
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
};
// =============子类继承父类，并实现抽象方法===============
var Coffee = function () {};
Coffee.prototype = new Beverage();
Coffee.prototype.brew = function () {
    console.log("用沸水冲泡咖啡");
};
Coffee.prototype.pourInCup = function () {
    console.log("把咖啡倒进杯子");
};
Coffee.prototype.addCondiments = function () {
    console.log("加糖和牛奶");
};
var Coffee = new Coffee();
Coffee.init();

var Tea = function () {};
Tea.prototype = new Beverage();
Tea.prototype.brew = function () {
    console.log("用沸水浸泡茶叶");
};
Tea.prototype.pourInCup = function () {
    console.log("把茶倒进杯子");
};
Tea.prototype.addCondiments = function () {
    console.log("加柠檬");
};
var tea = new Tea();
tea.init();
```

以上代码中中，Beverage.prototype.init 被称为模板方法，该方法中封装了子类的算法框架，它作为一个算法的模板，指导子类以何种顺序去执行哪些方法。

在Beverage.prototype.init 方法中，算法内的每一个步骤都清楚地展示出来；模板方法中规定需要的方法或属性，子类必须要有，并且提供正确的实现。子类继承了父类时，必须实现抽象方法。如果每个子类中都有一些相同的具体实现，也可以将这些实现放到抽象类中以达到代码复用。

### 抽象类

​		模板方法模式是一种严重依赖抽象类的设计模式。JavaScript 在语言层面并没有提供对抽象类的支持，我们也很难模拟抽象类的实现，但可以作出让步和变通。

​		抽象类不能被实例化，如果有人编写了一个抽象类，那么这个抽象类一定是用来被某些具体类继承的。

​		js 中无法对子类重写父类的抽象方法进行检查，在编写代码时得不到任何警告，这是比较危险的，特别是使用模板方法模式这种完全依赖继承实现的设计模式时；解决方案有两种：

1. 使用鸭子类型来模拟检查接口，以确保子类重写了父类的方法，缺点是会增加与业务逻辑无关的代码。
2. 在父类抽象方法中抛出错误，若子类没有重写此方法，就会在运行时抛错误，缺点是得到错误必须要等到程序运行时，时间太靠后了；

### 模板方法模式使用场景

模板方法模式常被架构师用于搭建项目的框架，架构师定好了框架的骨架，程序员继承框架的结构之后，负责往里面填空。

在Web 开发中也能找到很多模板方法模式的适用场景，比如我们在构建一系列的UI 组件，这些组件的构建过程一般如下所示：

1. 初始化一个div 容器；
2.  通过ajax 请求拉取相应的数据；
3. 把数据渲染到div 容器里面，完成组件的构造；
4. 通知用户组件渲染完毕。

任何组件的构建都遵循上面的4 步，其中第(1)步和第(4)步是相同的。第(2)步不同的地方只是请求ajax 的远程地址，第(3)步不同的地方是渲染数据的方式。于是我们可以把这4 个步骤都抽象到父类的模板方法里面，父类中还可以顺便提供第(1)步和第(4)步的具体实现。当子类继承这个父类之后，会重写模板方法里面的第(2)步和第(3)步。

通过模板方法模式，我们在父类中封装了子类的算法框架。这些算法框架在正常状态下是适用于大多数子类的，但如果有一些特别“个性”的子类，可以使用 钩子方法来解决个性化问题；放置钩子是隔离变化的一种常见手段。在父类中容易变化的地方放置钩子，钩子可以有一个默认的实现，究竟要不要“挂钩”，这由子类自行决定。钩子方法的返回结果决定了模板方法后面部分的执行步骤，也就是程序接下来的走向。

一般在模板中容易引起变化的地方添加钩子，满足条件就执行自定义逻辑；

```js
var Beverage = function () {};
Beverage.prototype.boilWater = function () {
    console.log("把水煮沸");
};
Beverage.prototype.brew = function () {
    throw new Error("子类必须重写brew 方法");
};
Beverage.prototype.pourInCup = function () {
    throw new Error("子类必须重写pourInCup 方法");
};
Beverage.prototype.addCondiments = function () {
    throw new Error("子类必须重写addCondiments 方法");
};
Beverage.prototype.customerWantsCondiments = function () {
    return true; // 默认需要调料
};
Beverage.prototype.init = function () {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.customerWantsCondiments()) {
        // 如果挂钩返回true，则需要调料
        this.addCondiments();
    }
};
var CoffeeWithHook = function () {};
CoffeeWithHook.prototype = new Beverage();
CoffeeWithHook.prototype.brew = function () {
    console.log("用沸水冲泡咖啡");
};
CoffeeWithHook.prototype.pourInCup = function () {
    console.log("把咖啡倒进杯子");
};
CoffeeWithHook.prototype.addCondiments = function () {
    console.log("加糖和牛奶");
};
CoffeeWithHook.prototype.customerWantsCondiments = function () {
    return window.confirm("请问需要调料吗？");
};
var coffeeWithHook = new CoffeeWithHook();
coffeeWithHook.init();
```



### 好莱坞原则

> 演员不要问导演好了没有，由导演来通知导演是否好了；

允许底层组件将自己挂钩到高层组件中，而高层组件会决定什么时候、以何种方式去使用这些底层组件，高层组件对待底层组件的方式，跟演艺公司对待新人演员一样，都是“别调用我们，我们会调用你”。

模板方法模式是好莱坞原则的一个典型使用场景，它与好莱坞原则的联系非常明显，当用模板方法模式编写一个程序时，就意味着子类放弃了对自己的控制权，而是改为父类通知子类，哪些方法应该在什么时候被调用。作为子类，只负责提供一些设计上的细节。

好莱坞原则还常常应用于其他模式和场景，例如发布订阅模式和回调函数。由发布者来主动通知订阅者，不需要订阅者自己去询问；回调函数的执行是由另一个函数决定的；

模板方法模式是基于继承的一种设计模式，父类封装了子类的算法框架和方法的执行顺序，子类继承父类之后，父类通知子类执行这些方法，好莱坞原则很好地诠释了这种设计技巧，即高层组件调用底层组件。

以下方式也可以得到继承效果

```js
var Beverage = function (param) {
    var boilWater = function () {
        console.log("把水煮沸");
    };
    var brew =
        param.brew ||
        function () {
            throw new Error("必须传递brew 方法");
        };
    var pourInCup =
        param.pourInCup ||
        function () {
            throw new Error("必须传递pourInCup 方法");
        };
    var addCondiments =
        param.addCondiments ||
        function () {
            throw new Error("必须传递addCondiments 方法");
        };
    var F = function () {};
    F.prototype.init = function () {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    };
    return F;
};
var Coffee = Beverage({
    brew: function () {
        console.log("用沸水冲泡咖啡");
    },
    pourInCup: function () {
        console.log("把咖啡倒进杯子");
    },
    addCondiments: function () {
        console.log("加糖和牛奶");
    },
});
var Tea = Beverage({
    brew: function () {
        console.log("用沸水浸泡茶叶");
    },
    pourInCup: function () {
        console.log("把茶倒进杯子");
    },
    addCondiments: function () {
        console.log("加柠檬");
    },
});
var coffee = new Coffee();
coffee.init();
var tea = new Tea();
tea.init();
```

但在JavaScript 中，很多时候都不需要依样画瓢地去实现一个模版方法模式，高阶函数是更好的选择。



































