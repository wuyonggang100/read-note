## 由来

适配器模式的作用是解决两个软件实体间的接口不兼容的问题。使用适配器模式之后，原本由于接口不兼容而不能工作的两个软件实体可以一起工作。

适配器的别名是包装器（wrapper），这是一个相对简单的模式。在程序开发中有许多这样的场景：当我们试图调用模块或者对象的某个接口时，却发现这个接口的格式并不符合目前的需求。这时候有两种解决办法，

- 第一种是修改原来的接口实现，但如果原来的模块很复杂，或者我们拿到的模块是一段别人编写的经过压缩的代码，修改原接口就显得不太现实了。
- 第二种办法是创建一个适配器，将原接口转换为客户希望的另一个接口，客户只需要和适配器打交道。

## 案例

### 一、解决地图 api 兼容问题

如果 baidu 地图没有 show 方法，就要使用适配器模式

```js
//  地图 api 兼容
var googleMap = {
    show: function () {
        console.log('开始渲染谷歌地图');
    },
};
var baiduMap = {
    display: function () {
        console.log('开始渲染百度地图');
    },
};
//  适配器模式将不同的 api 接通
var baiduMapAdapter = {
    show: function () {
        return baiduMap.display();
    },
};
renderMap(googleMap); // 输出：开始渲染谷歌地图
renderMap(baiduMapAdapter); // 输出：开始渲染百度地图
```

二、数据格式的适配

将数据适配成目标格式，最后实现统一调用；

```js
//  ------------------数据格式适配得到目标格式的数据-------------------
var getGuangdongCity = function () {
    var guangdongCity = [
        {
            name: 'shenzhen',
            id: 11,
        },
        {
            name: 'guangzhou',
            id: 12,
        },
    ];
    return guangdongCity;
};
var render = function (fn) {
    console.log('开始渲染广东省地图');
    document.write(JSON.stringify(fn()));
};

// 使用适配器将数据转换成目标格式
var addressAdapter = function (oldAddressfn) {
    var address = {},
        oldAddress = oldAddressfn();
    for (var i = 0, c; (c = oldAddress[i++]); ) {
        address[c.name] = c.id;
    }
    return function () {
        return address;
    };
};
render(addressAdapter(getGuangdongCity));
```





## 总结：

适配器模式是一对相对简单的模式，有一些模式跟适配器模式的结构非常相似，比如装饰者模式、代理模式和外观模式，这几种模式都属于“包装模式”，都是由一个对象来包装另一个对象。**区别它们的关键仍然是模式的意图**。

- 适配器模式主要用来解决两个已有接口之间不匹配的问题，它不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化。适配器模式不需要改变已有的接口，就能够使它们协同作用。

- 装饰者模式和代理模式也不会改变原有对象的接口，但装饰者模式的作用是为了给对象增加功能。装饰者模式常常形成一条长的装饰链，而适配器模式通常只包装一次。
- 代理模式是为了控制对对象的访问，通常也只包装一次。

- 外观模式的作用倒是和适配器比较相似，有人把外观模式看成一组对象的适配器，但外观模式最显著的特点是定义了一个新的接口。

























































