命令模式

- 命令模式是最简单和优雅的模式之一，命令模式中的命令（command）指的是一个执行某些特定事情的指令。
- 命令模式最常见的应用场景是：有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时希望用一种松耦合的方式来设计程序，使得请求发送者和请求接收者能够消除彼此之间的耦合关系。

命令对象：

- 命令模式把请求封装成command 对象，这个对象可以在程序中被四处传递，请求调用者和接收者互相不知道对方是谁，从而**解开了请求调用者和请求接收者之间的耦合关系**。

- 相对于过程化的请求调用，command 对象**拥有更长的生命周期**。对象的生命周期是跟初始请求无关的，因为这个请求已经被封装在了command 对象的方法中，成为了这个对象的行为。我们可以在程序运行的任意时刻去调用这个方法。
  除了这两点之外，命令模式还支持撤销、排队等操作。

```js
// 安装命令
var setCommand = function (button, command) {
    button.onclick = function () {
        command.execute();
    };
};
// ---------命令接收者---------------
var MenuBar = {
    refresh: function () {
        console.log("刷新菜单目录");
    },
};
var SubMenu = {
    add: function () {
        console.log("增加子菜单");
    },
    del: function () {
        console.log("删除子菜单");
    },
};
// ---------命令对象类---------------
class RefreshMenuBarCommand {
    constructor(receiver) {
        this.receiver = receiver;
    }
    // 请求命令，然后接收者执行
    execute() {
        this.receiver.refresh(); 
    }
}

class AddSubMenuCommand {
    constructor(receiver) {
        this.receiver = receiver;
    }
     // 请求命令，然后接收者执行
    execute() {
        this.receiver.add();
    }
}

class DelSubMenuCommand {
    constructor(receiver) {
        this.receiver = receiver;
    }
    execute() {
        this.receiver.del();
    }
}

// 最后就是把命令接收者传入到command 对象中，并且把command 对象安装到button 上面：
var refreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar); // 命令对象实例
var addSubMenuCommand = new AddSubMenuCommand(SubMenu);
var delSubMenuCommand = new DelSubMenuCommand(SubMenu);
// 安装命令对象，按钮与命令对象之间没有直接关系。可以随意安装
setCommand(button1, refreshMenuBarCommand);
setCommand(button2, addSubMenuCommand);
setCommand(button3, delSubMenuCommand);
```

命令模式的由来，其实是回调（callback）函数的一个面向对象的替代品，使用闭包可以完成同样的功能；在面向对象设计中，命令模式的接收者被当成command 对象的属性保存起来，同时约定执行命令的操作调用command.execute 方法。在使用闭包的命令模式实现中，接收者被封闭在闭包产生的环境中，执行命令的操作可以更加简单，仅仅执行回调函数即可。无论接收者被保存为对象的属性，还是被封闭在闭包产生的环境中，在将来执行命令的时候，接收者都能被顺利访问。

闭包实现形式如下：

```js
var setCommand = function (button, func) {
    button.onclick = function () {
        func();
    };
};
var MenuBar = {
    refresh: function () {
        console.log("刷新菜单界面");
    },
    undo: function () {
        console.log("撤销了---");
    },
};
var RefreshMenuBarCommand = function (receiver) {
    return function () {
        receiver.refresh();
    };
};
var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(button1, refreshMenuBarCommand);
// 当然，如果想更明确地表达当前正在使用命令模式，或者除了执行命令之外，将来有可能还
// 要提供撤销命令等操作。那我们最好还是把执行函数改为调用execute 方法：
var RefreshMenuBarCommand = function (receiver) {
    return {
        execute: function () {
            receiver.refresh();
        },
        undo: function () {
            receiver.undo();
        },
    };
};
var setCommand = function (button, command) {
    button.onclick = function () {
        command.execute();
        setTimeout(() => {
            command.undo();
        }, 5000);
    };
};
var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(button1, refreshMenuBarCommand);
```

