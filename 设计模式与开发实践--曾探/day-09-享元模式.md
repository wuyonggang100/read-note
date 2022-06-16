# 享元模式

享元（flyweight）模式是一种用于性能优化的模式，“fly”在这里是苍蝇的意思，意为蝇量级。享元模式的核心是运用共享技术来有效支持大量细粒度的对象。目标是尽量减少共享对象的数量。

如果系统中因为创建了大量类似的对象而导致内存占用过高，享元模式就非常有用了。在JavaScript 中，浏览器特别是移动端的浏览器分配的内存并不算多，如何节省内存就成了一件非常有意义的事情。

### 一、享元模式初探

未使用享元模式之前, 如下会生成 100 个对象；50个男模特和50个女模特来分别穿衣拍照；

```js
var Model = function (sex, underwear) {
    this.sex = sex;
    this.underwear = underwear;
};
Model.prototype.takePhoto = function () {
    console.log("sex= " + this.sex + " underwear=" + this.underwear);
};
for (var i = 1; i <= 50; i++) {
    var maleModel = new Model("male", "underwear" + i);
    maleModel.takePhoto();
}
for (var j = 1; j <= 50; j++) {
    var femaleModel = new Model("female", "underwear" + j);
    femaleModel.takePhoto();
}
```

使用享元模式后，只需要创建两个对象，分别各穿衣拍照50次

```js
var Model = function (sex) {
    this.sex = sex;
};
Model.prototype.takePhoto = function () {
    console.log("sex= " + this.sex + " underwear=" + this.underwear);
};
// 分别创建一个男模特对象和一个女模特对象：
var maleModel = new Model("male"),
    femaleModel = new Model("female");
// 给男模特依次穿上所有的男装，并进行拍照：
for (var i = 1; i <= 50; i++) {
    maleModel.underwear = "underwear" + i;
    maleModel.takePhoto();
}
// 同样，给女模特依次穿上所有的女装，并进行拍照：
for (var j = 1; j <= 50; j++) {
    femaleModel.underwear = "underwear" + j;
    femaleModel.takePhoto();
}
```

享元模式要求将对象的属性划分为内部状态与外部状态（状态在这里通常指属性）。享元模式的目标是尽量减少共享对象的数量，关于如何划分内部状态和外部状态，下面的几条经验提供了一些指引。

- 内部状态存储于对象内部。
- 内部状态可以被一些对象共享。
- 内部状态独立于具体的场景，通常不会改变。
- 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。

把所有内部状态相同的对象都指定为同一个共享的对象。而外部状态可以从对象身上剥离出来，并储存在外部。
剥离了外部状态之后的对象成为共享对象，外部状态在必要时被传入共享对象来组装成一个完整的对象。虽然组装外部状态成为一个完整对象的过程需要花费一定的时间，但却可以大大减少系统中的对象数量，相比之下，这点时间或许是微不足道的。因此，享元模式是一种用时间换空间的优化模式。

使用享元模式的关键是如何区别内部状态和外部状态。可以被对象共享的属性通常被划分为内部状态，而外部状态取决于具体的场景，并根据场景而变化。

### 实例

> 批量选择 2000 个文件，按照队列依次上传，在使用享元模式之前，会创建 2000 个 upload 对象，浏览器很大可能会卡死；

以下代码中用插件和 flash 方式各上传 3 个文件，一共会创建 6 个实例对象

```js
var id = 0;
window.startUpload = function (uploadType, files) {
    // uploadType 区分是控件还是flash
    for (var i = 0, file; (file = files[i++]); ) {
        var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
        uploadObj.init(id++); // 给upload 对象设置一个唯一的id
    }
};

var Upload = function (uploadType, fileName, fileSize) {
    this.uploadType = uploadType;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.dom = null;
};
Upload.prototype.init = function (id) {
    var that = this;
    this.id = id;
    this.dom = document.createElement("div");
    this.dom.innerHTML =
        "<span>文件名称:" +
        this.fileName +
        ", 文件大小: " +
        this.fileSize +
        "</span>";

    document.body.appendChild(this.dom);
};

startUpload("plugin", [
    {
        fileName: "1.txt",
        fileSize: 1000,
    },
    {
        fileName: "2.html",
        fileSize: 3000,
    },
    {
        fileName: "3.txt",
        fileSize: 5000,
    },
]);
startUpload("flash", [
    {
        fileName: "4.txt",
        fileSize: 1000,
    },
    {
        fileName: "5.html",
        fileSize: 3000,
    },
    {
        fileName: "6.txt",
        fileSize: 5000,
    },
]);
```

使用享元模式后，只保留两个对象，一个是插件上传，一个是 flash 上传。将 uploadType 作为内部属性，是插件还是 flash，一旦确定后，就不会改变；即使上传 2000个文件，也只需要 这两个对象

```js
// --------------------使用享元模式--------------------------------
var Upload = function (uploadType) {
    this.uploadType = uploadType;
};
// 工厂函数创建upload 对象
var UploadFactory = (function () {
    var createdFlyWeightObjs = {};
    return {
        create: function (uploadType) {
            if (createdFlyWeightObjs[uploadType]) {
                return createdFlyWeightObjs[uploadType];
            }
            return (createdFlyWeightObjs[uploadType] = new Upload(uploadType));
        },
    };
})();

/*
      负责向UploadFactory 提交创建对象的请求，
      并用一个uploadDatabase对象保存所有upload 对象的外部状态，
      以便在程序运行过程中给upload 共享对象设置外部状态，
      */

var uploadManager = (function () {
    var uploadDatabase = {};
    return {
        add: function (id, uploadType, fileName, fileSize) {
            var flyWeightObj = UploadFactory.create(uploadType);
            var dom = document.createElement("div");
            dom.innerHTML =
                "<span>文件名称:" +
                fileName +
                ", 文件大小: " +
                fileSize +
                "</span>" +
                '<button class="delFile">删除</button>';
            dom.querySelector(".delFile").onclick = function () {
                flyWeightObj.delFile(id);
            };
            document.body.appendChild(dom);
            uploadDatabase[id] = {
                fileName: fileName,
                fileSize: fileSize,
                dom: dom,
            };
            return flyWeightObj;
        },
        setExternalState: function (id, flyWeightObj) {
            var uploadData = uploadDatabase[id];
            for (var i in uploadData) {
                flyWeightObj[i] = uploadData[i];
            }
        },
    };
})();

// 触发上传动作
var id = 0;
window.startUpload = function (uploadType, files) {
    for (var i = 0, file; (file = files[i++]); ) {
        var uploadObj = uploadManager.add(
            ++id,
            uploadType,
            file.fileName,
            file.fileSize
        );
    }
};
// 上传 6 个文件
startUpload("plugin", [
    {
        fileName: "1.txt",
        fileSize: 1000,
    },
    {
        fileName: "2.html",
        fileSize: 3000,
    },
    {
        fileName: "3.txt",
        fileSize: 5000,
    },
]);
startUpload("flash", [
    {
        fileName: "4.txt",
        fileSize: 1000,
    },
    {
        fileName: "5.html",
        fileSize: 3000,
    },
    {
        fileName: "6.txt",
        fileSize: 5000,
    },
]);
```

## 享元模式使用场景

-  一个程序中使用了大量的相似对象。
-  由于使用了大量对象，造成很大的内存开销。
-  对象的大多数状态都可以变为外部状态。
- 剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象。



实现享元模式的关键是把内部状态和外部状态分离开来。有多少种内部状态的组合，系统中便最多存在多少个共享对象，而外部状态储存在共享对象的外部，在必要时被传入共享对象来组装成一个完整的对象。享元模式的过程是剥离外部状态，并把外部状态保存在其他地方，在合适的时刻再把外部状态组装进共享对象。

如果没有内部状态，则只需要一个共享对象；

```js
var Upload = function () {};
var UploadFactory = (function () {
    var uploadObj;
    return {
        create: function () {
            if (uploadObj) {
                return uploadObj;
            }
            return (uploadObj = new Upload());
        },
    };
})();
```

## 对象池

对象池维护一个装载空闲对象的池子，如果需要对象的时候，不是直接new，而是转从对象池里获取。如果对象池里空闲对象不够用，则创建新的对象以满足使用，当获取出的对象完成它的职责之后， 再进入池子等待被下次获取。

类似于图书馆看书，不看的时候就放进图书馆，看的时候就从图书馆取出；

对象池技术的应用非常广泛，HTTP 连接池和数据库连接池都是其代表应用。在Web 前端开发中，对象池使用最多的场景大概就是跟DOM 有关的操作。很多空间和时间都消耗在了DOM节点上，如何避免频繁地创建和删除DOM 节点就成了一个有意义的话题。

对象池是另外一种性能优化方案，它跟享元模式有一些相似之处，但没有分离内部状态和外部状态这个过程。

1. 普通对象池

   ```js
   var toolTipFactory = (function () {
       var toolTipPool = []; // toolTip 对象池
       return {
           create: function () {
               if (toolTipPool.length === 0) {
                   // 如果对象池为空
                   var div = document.createElement("div"); // 创建一个dom
                   document.body.appendChild(div);
                   return div;
               } else {
                   // 如果对象池里不为空
                   return toolTipPool.shift(); // 则从对象池中取出一个dom
               }
           },
           recover: function (tooltipDom) {
               return toolTipPool.push(tooltipDom); // 对象池回收dom
           },
       };
   })();
   var ary = [];
   for (var i = 0, str; (str = ["A", "B"][i++]); ) {
       var toolTip = toolTipFactory.create();
       toolTip.innerHTML = str;
       ary.push(toolTip);
   }
   for (var i = 0, toolTip; (toolTip = ary[i++]); ) {
       toolTipFactory.recover(toolTip);
   }
   // 再创建6 个小气泡：
   for (var i = 0, str; (str = ["A", "B", "C", "D", "E", "F"][i++]); ) {
       var toolTip = toolTipFactory.create();
       toolTip.innerHTML = str;
   }
   ```

2. 封装后的对象池

   ```js
   var objectPoolFactory = function (createObjFn) {
       var objectPool = [];
       return {
           create: function () {
               var obj =
                   objectPool.length === 0
               ? createObjFn.apply(this, arguments)
               : objectPool.shift();
               return obj;
           },
           recover: function (obj) {
               objectPool.push(obj);
           },
       };
   };
   var iframeFactory = objectPoolFactory(function () {
       var iframe = document.createElement("iframe");
       document.body.appendChild(iframe);
       iframe.onload = function () {
           iframe.onload = null; // 防止iframe 重复加载的bug
           iframeFactory.recover(iframe); // iframe 加载完成之后回收节点
       };
       return iframe;
   });
   var iframe1 = iframeFactory.create();
   iframe1.src = "http:// baidu.com";
   var iframe2 = iframeFactory.create();
   iframe2.src = "http:// QQ.com";
   setTimeout(function () {
       var iframe3 = iframeFactory.create();
       iframe3.src = "http:// 163.com";
   }, 3000);
   ```

   

享元模式是为解决性能问题而生的模式，这跟大部分模式的诞生原因都不一样。在一个存在大量相似对象的系统中，享元模式可以很好地解决大量对象带来的性能问题。





































