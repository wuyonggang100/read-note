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

命令模式实现撤销功能

> 这只能撤销一次命令，如果是一串命令，就不适用了；

```js
var ball = document.getElementById("ball");
var pos = document.getElementById("pos");
var moveBtn = document.getElementById("moveBtn");
var cancelBtn = document.getElementById("cancelBtn");

class MoveCommand {
    constructor(receiver, pos) {
        this.receiver = receiver;
        this.pos = pos;
        this.oldPos = null;
    }
    execute() {
        this.receiver.start("left", this.pos, 1000, "strongEaseOut");
        this.oldPos =
            this.receiver.dom.getBoundingClientRect()[
            this.receiver.propertyName
        ];
        // 记录小球开始移动前的位置
    }
    undo() {
        this.receiver.start("left", this.oldPos, 1000, "strongEaseOut");
        // 回到小球移动前记录的位置
    }
}
moveBtn.onclick = function () {
    var animate = new Animate(ball);
    moveCommand = new MoveCommand(animate, pos.value);
    moveCommand.execute();
};
cancelBtn.onclick = function () {
    moveCommand.undo(); // 撤销命令
};
```

命令模式实现系列撤销

> 需要有一个栈来存历史记录，如果有重做功能，还需要有个指针前进或后退，来取出命令执行；

```js
// 操作列表
var Ryu = {
    attack: function () {
        console.log("攻击");
    },
    defense: function () {
        console.log("防御");
    },
    jump: function () {
        console.log("跳跃");
    },
    crouch: function () {
        console.log("蹲下");
    },
};
var makeCommand = function (receiver, state) {
    // 创建命令
    return function () {
        receiver[state]();
    };
};
var commands = {
    119: "jump", // W
    115: "crouch", // S
    97: "defense", // A
    100: "attack", // D
};
var commandStack = []; // 保存命令的堆栈
document.onkeypress = function (ev) {
    var keyCode = ev.keyCode,
        command = makeCommand(Ryu, commands[keyCode]);
    if (command) {
        command(); // 执行命令
        commandStack.push(command); // 将刚刚执行过的命令保存进堆栈
    }
};

document.getElementById("replay").onclick = function () {
    // 点击播放录像
    var command;
    var point = 0; // 指针
    while ((command = commandStack[point])) {
        // 从堆栈里依次取出命令并执行
        command();
        point++
    }
};
```

命令队列

> 将命令进行排队，前一个执行完毕后，再执行下一个；命令执行完毕可以用回调函数或者发布订阅的方式来通知，订阅者接收到消息后，就开始执行队列里的下一个命令；

宏命令

> 宏命令是一组命令的集合，通过执行宏命令的方式，可以一次执行一批命令。可以用一个主命令来执行其他子命令；
>
> 宏命令是命令模式与组合模式的联用产物。

```js
// 预先定义好子命令
var closeDoorCommand = {
    execute: function () {
        console.log("关门");
    },
};
var openPcCommand = {
    execute: function () {
        console.log("开电脑");
    },
};
var openQQCommand = {
    execute: function () {
        console.log("登录QQ");
    },
};
var MacroCommand = function () {
    return {
        commandsList: [],
        add: function (command) {
            this.commandsList.push(command);
        },
        execute: function () {
            for (var i = 0, command; (command = this.commandsList[i++]); ) {
                command.execute();
            }
        },
    };
};
var macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);
macroCommand.execute();
```

智能命令与傻瓜命令

> 一般来说，命令模式都会在command 对象中保存一个接收者来负责真正执行客户的请求，这种情况下命令对象是“傻瓜式”的，它只负责把客户的请求转交给接收者来执行，这种模式的好处是请求发起者和请求接收者之间尽可能地得到了解耦。
>
> 也可以定义一些更“聪明”的命令对象，“聪明”的命令对象可以直接实现请求，这样一来就不再需要接收者的存在，这种“聪明”的命令对象也叫作智能命令。。没有接收者的智能命令，退化到和策略模式非常相近，从代码结构上已经无法分辨它们，能分辨的只有它们意图的不同。策略模式指向的问题域更小，所有策略对象的目标总是一致的，它们只是达到这个目标的不同手段，它们的内部实现是针对“算法”而言的。而智能命令模式指向的问题域更广，command 对象解决的目标更具发散性。命令模式还可以完成撤销、排队等功能。

```js
var closeDoorCommand = {
	execute: function(){
		console.log( '关门' );
	}
};
```



JavaScript 可以用高阶函数非常方便地实现命令模式。命令模式在JavaScript 语言中是一种隐形的模式。命令可以用函数的方式存储起来。