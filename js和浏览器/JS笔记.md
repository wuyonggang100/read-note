JS 对象和数组的区别

[JavaScript](http://c.biancheng.net/js/) 中的对象（Object）和数组（Array）有时候看起来很相似，但它们是两种不同类型的数据集合，其中对象是包含已命名的值的无序集合，而数组则是包含已编码的值的有序集合。

#### 示例1

下面示例分别使用对象和数组来存储 1 和 true 这两个值。代码结构如下：

```js
var o = {  //对象    
    x :1,  //该值命名为x    
    y : true  //该值命名为y
}
var a = [  //数组    
    1,  //该值隐含编码为0    
    true  //该值隐含编码为1
]
```

对象的存储形式很像数组，因此被称为关联数组，但它不是真正意义上的数组。关联数组就是将值与特定字符串关联在一起。真正的数组与字符串没有联系，但是它将值和非负整数的下标关联在一起。

```js
console.log(o["x"]);  //返回1，使用点语法存取属性
console.log(a[0]);  //返回1，使用中括号存取属性
```

使用点语法存取属性时，属性名是标识符；而使用中括号存取属性时，属性名为字符串。

#### 示例2

当用点号运算符来存取对象属性时，属性名是用标识符表示的；当用中括号来存取对象属性时，属性名是用字符串表示的，因此可以在运行过程中动态生成字符串。

```js
var o = {    
    p1 : 1,    
    p2 : true
}
for (var i = 1; i < 3; i ++) {
    console.log(o["p" + i]);
}
```

通过关联数组法访问带有字符串表达式的对象属性是非常灵活的。当对象属性非常多时，使用点语法来存取对象属性会比较麻烦。另外，在一些特殊情况下只能使用关联数组形式来存取对象属性。

js的数组和对象都是存放在内存中的堆空间中。

数组的内存模型 Javascript的内存分为堆内存和栈内存，数组作为对象，在建立后存储在堆内存中。 任何计算机语言内存的分配都要经历三个阶段

分配内存 对内存进行读、写 释放内存（垃圾回收） 本文主要针对数组的内存分配进行解释。 Javascript中数组有几个不同于其他语言数组的特点

数组中可以存放不同的数据结构，可以存放数组、对象、Number、Undefined、Null、String、Symbol、Boolean、Function等等。 数组的index是字符串类型的，之所以你可以通过arr[1]，获得对应的数据，是因为Javascript自动将数字转化为字符串。 数组本来应该是一个连续的内存分配，但是在Javascript中不是连续分配的，而是类似哈希映射的方式存在的。 对于读取操作，哈希表的效率并不高，而修改删除的效率比较高。 现在浏览器为了优化其操作，对数组的创建时候的内存分配进行了优化：

对于同构的数组，也就是，数组中元素类型一致，会创建连续的内存分配 对于不同构数组，按照原来的方式创建。 如果你想插入一个异构数据，那么就会重新解构，通过哈希映射的方式创建。



JavaScript中数据都是存储在内存中
1、基本数据类型
	存储在内存的栈中，变量和数据都直接存储在栈中。
    	属于有序存储 
           先定义的变量存储在栈的底部
           后定义的变量存储在栈的顶部
2、引用数据类型
    存储在内存的堆中。
    	属于无序存储 
			a、先在堆中开辟一个独立的存储空间，准备存储引用数据类型数据，
				  操作系统会给这个存储空间分配一个独立的内存地址，
				  函数程序代码以 字符串形式 存储在独立的存储空间中。
			b、函数名称/变量名称 存储在内存的栈中，
			      函数名称/变量名称中存储的是引用数据类型的内存地址。
**3、基本数据类型比较判断的是数值数据，
         引用数据类型比较判断的是内存地址，
         两个 引用数据类型比较判断结果永远是 false。

JavaScript函数执行步骤的第一次亲密接触
1、封装
	(1) 在堆中开辟一个独立的存储空间，准备存储函数程序，
	    操作系统给独立的存储空间赋值内存地址
	(2) 将函数程序以字符串的形式存储在独立的存储空间中 
	(3) 将函数名称/变量名称 存储到内存的栈中，
	    函数名称/变量名称中存储的是函数的内存地址
2、调用
	(1) 读取/解析 存储在栈中的函数名称/变量名称中存储的内存地址，
	    找到堆中对应的独立的存储空间，读取其中存储的字符串程序代码。
	(2) 给形参赋值实参
	(3) 执行JavaScript的预解析/预编译/预解释
    (4) 函数程序的调用执行

### 账号密码自动输入的问题解决

方法1：加个 autocomplete="new-password"

```html
<label>
    <span>卡号:</span>
    <input type="text" name="userName" placeholder="请输入卡号" autocomplete="new-password">
</label>
<label>
    <span>密码:</span>
    <input type="password" name=password" placeholder="请输入密码" autocomplete="new-password">
</label>
```

方法2：加两个隐藏的输入框， 不能用 display: none

```html
<label><span></span><input type="text" name="hidden1" style="width:0; height:0;"></label>
<label><span></span><input type="password" name="hidden2" style="width:0; height:0;"></label>
<label>
    <span>卡号:</span>
    <input type="text" name="userName" placeholder="请输入卡号" autocomplete="off">
</label>
<label>
    <span>密码:</span>
    <input type="password" name=password" placeholder="请输入密码" autocomplete="off">
</label>
```

方法3：中间加个隐藏的 password 输入框

```html
<label>
    <span>卡号:</span>
    <input type="text" name="userName" placeholder="请输入卡号" autocomplete="off">
</label>
<label>
    <input type="password" name=password" style="display:none" autocomplete="off">
</label>
<label>
    <span>密码:</span>
    <input type="password" name=password" placeholder="请输入密码" autocomplete="off">
</label>
```

