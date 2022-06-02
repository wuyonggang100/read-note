迭代器模式

提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。迭代器模式可以把迭代的过程从业务逻辑中分离出来，在使用迭代器模式之后，即使不关心对象的内部构造，也可以按顺序访问其中的每个元素。

无论是内部迭代器还是外部迭代器，只要被迭代的聚合对象拥有length 属性而且可以用下标访问，那它就可以被迭代



迭代器可以分为内部迭代器和外部迭代器，它们有各自的适用场景。

内部迭代器：迭代器内部定义好了迭代规则，完全接收整个迭代过程，外部不关心其内部的实现，只需要一次初始调用。

```js
var compare = function( ary1, ary2 ){
    if ( ary1.length !== ary2.length ){
    	throw new Error ( 'ary1 和ary2 不相等' );
	}
    each( ary1, function( i, n ){
    	if ( n !== ary2[ i ] ){
    		throw new Error ( 'ary1 和ary2 不相等' );
    	}
    });
    alert ( 'ary1 和ary2 相等' );
};
compare( [ 1, 2, 3 ], [ 1, 2, 4 ] ); // throw new Error ( 'ary1 和ary2 不相等' );
```



外部迭代器：必须显式地请求迭代下一个元素。外部迭代器增加了一些调用的复杂度，但相对也增强了迭代器的灵活性，我们可以手工控制迭代的过程或者顺序。

```js
var Iterator = function (obj) {
    var current = 0;
    var next = function () {
        current += 1;
    };
    var isDone = function () {
        return current >= obj.length;
    };
    var getCurrItem = function () {
        return obj[current];
    };
    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    }
};
// 再看看如何改写compare 函数：
var compare = function (iterator1, iterator2) {
    while (!iterator1.isDone() && !iterator2.isDone()) {
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()) {
            throw new Error('iterator1 和iterator2 不相等');
        }
        iterator1.next();
        iterator2.next();
    }
    alert('iterator1 和iterator2 相等');
}
var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);
compare(iterator1, iterator2); // 输出：iterator1 和iterator2 相等
```

