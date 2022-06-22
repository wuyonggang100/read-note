浏览器对象模型（Browser Object Model，简称 BOM）是 JavaScript 的组成部分之一，BOM 赋予了 JavaScript 程序与浏览器交互的能力。

window 对象是 BOM 的核心，用来表示当前浏览器窗口，其中提供了一系列用来操作或访问浏览器的方法和属性。另外，JavaScript 中的所有全局对象、函数以及变量也都属于 window 对象，甚至我们前面介绍的 document 对象也属于 window 对象。

注意：如果 HTML 文档中包含框架（<frame> 或 <iframe> 标签），浏览器会为 HTML 文档创建一个 window 对象的同时，为每个框架创建一个额外的 window 对象。

## window 对象中的属性

下表中列举了 window 对象中提供的属性及其描述：



| 属性           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| closed         | 返回窗口是否已被关闭                                         |
| defaultStatus  | 设置或返回窗口状态栏中的默认文本                             |
| document       | 对 Document 对象的只读引用                                   |
| frames         | 返回窗口中所有已经命名的框架集合，集合由 Window 对象组成，每个 Window 对象在窗口中含有一个 <frame> 或 <iframe> 标签 |
| history        | 对 History 对象的只读引用，该对象中包含了用户在浏览器中访问过的 URL |
| innerHeight    | 返回浏览器窗口的高度，不包含工具栏与滚动条                   |
| innerWidth     | 返回浏览器窗口的宽度，不包含工具栏与滚动条                   |
| localStorage   | 在浏览器中以键值对的形式保存某些数据，保存的数据没有过期时间，会永久保存在浏览器中，直至手动删除 |
| length         | 返回当前窗口中 <iframe> 框架的数量                           |
| location       | 引用窗口或框架的 Location 对象，该对象中包含当前 URL 的有关信息 |
| name           | 设置或返回窗口的名称                                         |
| navigator      | 对 Navigator 对象的只读引用，该对象中包含当前浏览器的有关信息 |
| opener         | 返回对创建此窗口的 window 对象的引用                         |
| outerHeight    | 返回浏览器窗口的完整高度，包含工具栏与滚动条                 |
| outerWidth     | 返回浏览器窗口的完整宽度，包含工具栏与滚动条                 |
| pageXOffset    | 设置或返回当前页面相对于浏览器窗口左上角沿水平方向滚动的距离 |
| pageYOffset    | 设置或返回当前页面相对于浏览器窗口左上角沿垂直方向滚动的距离 |
| parent         | 返回父窗口                                                   |
| screen         | 对 Screen 对象的只读引用，该对象中包含计算机屏幕的相关信息   |
| screenLeft     | 返回浏览器窗口相对于计算机屏幕的 X 坐标                      |
| screenTop      | 返回浏览器窗口相对于计算机屏幕的 Y 坐标                      |
| screenX        | 返回浏览器窗口相对于计算机屏幕的 X 坐标                      |
| sessionStorage | 在浏览器中以键值对的形式存储一些数据，数据会在关闭浏览器窗口或标签页之后删除 |
| screenY        | 返回浏览器窗口相对于计算机屏幕的 Y 坐标                      |
| self           | 返回对 window 对象的引用                                     |
| status         | 设置窗口状态栏的文本                                         |
| top            | 返回最顶层的父窗口                                           |



## window 对象中的方法

下表中列举了 window 对象中提供的方法及其描述：



| 方法               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| alert()            | 在浏览器窗口中弹出一个提示框，提示框中有一个确认按钮         |
| atob()             | 解码一个 base-64 编码的字符串                                |
| btoa()             | 创建一个 base-64 编码的字符串                                |
| blur()             | 把键盘焦点从顶层窗口移开                                     |
| clearInterval()    | 取消由 setInterval() 方法设置的定时器                        |
| clearTimeout()     | 取消由 setTimeout() 方法设置的定时器                         |
| close()            | 关闭某个浏览器窗口                                           |
| confirm()          | 在浏览器中弹出一个对话框，对话框带有一个确认按钮和一个取消按钮 |
| createPopup()      | 创建一个弹出窗口，注意：只有 IE 浏览器支持该方法             |
| focus()            | 使一个窗口获得焦点                                           |
| getSelection()     | 返回一个 Selection 对象，对象中包含用户选中的文本或光标当前的位置 |
| getComputedStyle() | 获取指定元素的 CSS 样式                                      |
| matchMedia()       | 返回一个 MediaQueryList 对象，表示指定的媒体查询解析后的结果 |
| moveBy()           | 将浏览器窗口移动指定的像素                                   |
| moveTo()           | 将浏览器窗口移动到一个指定的坐标                             |
| open()             | 打开一个新的浏览器窗口或查找一个已命名的窗口                 |
| print()            | 打印当前窗口的内容                                           |
| prompt()           | 显示一个可供用户输入的对话框                                 |
| resizeBy()         | 按照指定的像素调整窗口的大小，即将窗口的尺寸增加或减少指定的像素 |
| resizeTo()         | 将窗口的大小调整到指定的宽度和高度                           |
| scroll()           | 已废弃。您可以使用 scrollTo() 方法来替代                     |
| scrollBy()         | 将窗口的内容滚动指定的像素                                   |
| scrollTo()         | 将窗口的内容滚动到指定的坐标                                 |
| setInterval()      | 创建一个定时器，按照指定的时长（以毫秒计）来不断调用指定的函数或表达式 |
| setTimeout()       | 创建一个定时器，在经过指定的时长（以毫秒计）后调用指定函数或表达式，只执行一次 |
| stop()             | 停止页面载入                                                 |
| postMessage()      | 安全地实现跨源通信                                           |



## navigator 对象中的属性

下表中列举了 JavaScript navigator 对象中常用的属性及其描述：

| 属性          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| appCodeName   | 返回当前浏览器的内部名称（开发代号）                         |
| appName       | 返回浏览器的官方名称                                         |
| appVersion    | 返回浏览器的平台和版本信息                                   |
| cookieEnabled | 返回浏览器是否启用 cookie，启用返回 true，禁用返回 false     |
| onLine        | 返回浏览器是否联网，联网则返回 true，断网则返回 false        |
| platform      | 返回浏览器运行的操作系统平台                                 |
| userAgent     | 返回浏览器的厂商和版本信息，即浏览器运行的操作系统、浏览器的版本、名称 |

## navigator 对象中的方法

下表中列举了JavaScript navigator 对象中提供的方法及其描述：

| 方法          | 描述                                                         |
| ------------- | ------------------------------------------------------------ |
| javaEnabled() | 返回浏览器是否支持运行 Java Applet 小程序，支持则返回 true，不支持则返回 false |
| sendBeacon()  | 向浏览器异步传输少量数据                                     |



## screen 对象中的属性

下表中列举了 JavaScript screen 对象中常用的属性及其描述：

| 属性        | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| availTop    | 返回屏幕上方边界的第一个像素点（大多数情况下返回 0）         |
| availLeft   | 返回屏幕左边边界的第一个像素点（大多数情况下返回 0）         |
| availHeight | 返回屏幕的高度（不包括 Windows 任务栏）                      |
| availWidth  | 返回屏幕的宽度（不包括 Windows 任务栏）                      |
| colorDepth  | 返回屏幕的颜色深度（color depth），根据 CSSOM（CSS 对象模型）视图，为兼容起见，该值总为 24。 |
| height      | 返回屏幕的完整高度                                           |
| pixelDepth  | 返回屏幕的位深度/色彩深度（bit depth），根据 CSSOM（CSS 对象模型）视图，为兼容起见，该值总为 24 |
| width       | 返回屏幕的完整宽度                                           |
| orientation | 返回当前屏幕的方向                                           |

## location 对象中的属性

下表中列举了 JavaScript location 对象中常用的属性及其描述：



| 属性     | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| hash     | 返回一个 URL 中锚的部分，例如：http://c.biancheng.net#js 中的 #js。 |
| host     | 返回一个 URL 的主机名和端口号，例如 http://c.biancheng.net:8080。 |
| hostname | 返回一个 URL 的主机名，例如 http://c.biancheng.net。         |
| href     | 返回一个完整的 URL，例如 http://c.biancheng.net/javascript/location-object.html。 |
| pathname | 返回一个 URL 中的路径部分，开头有个`/`。                     |
| port     | 返回一个 URL 中的端口号，如果 URL 中不包含明确的端口号，则返回一个空字符串`' '`。 |
| protocol | 返回一个 URL 协议，即 URL 中冒号`:`及其之前的部分，例如 http: 和 https:。 |
| search   | 返回一个 URL 中的查询部分，即 URL 中`?`及其之后的一系列查询参数。 |

## history 对象中的属性

下表中列举了 JavaScript history 对象中常用的属性及其描述：



| 属性              | 说明                                                         |
| ----------------- | ------------------------------------------------------------ |
| length            | 返回浏览历史的数目，包含当前已经加载的页面。                 |
| scrollRestoration | 利用浏览器特性，使我们在返回上一页或者下一页时，将页面滚动到之前浏览的位置，该属性有两个值，分别是 auto（表示滚动）与 manual（表示不滚动）。 |
| state             | 返回浏览器在当前 URL 下的状态信息，如果没有调用过 pushState() 或 replaceState() 方法，则返回默认值 null。 |



## history 对象中的方法

下表中列举了 JavaScript history 对象中常用的方法及其描述：

| 方法           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| back()         | 参照当前页面，返回历史记录中的上一条记录（即返回上一页），您也可以通过点击浏览器工具栏中的`←`按钮来实现同样的效果。 |
| forward()      | 参照当前页面，前往历史记录中的下一条记录（即前进到下一页），您也可以通过点击浏览器工具栏中的`→`按钮来实现同样的效果。 |
| go()           | 参照当前页面，根据给定参数，打开指定的历史记录，例如 -1 表示返回上一页，1 表示返回下一页。 |
| pushState()    | 向浏览器的历史记录中插入一条新的历史记录。                   |
| replaceState() | 使用指定的数据、名称和 URL 来替换当前历史记录。              |



#### fieldset 标签

```html
<form>
  <fieldset>
    <legend>Choose your favorite monster</legend>

    <input type="radio" id="kraken" name="monster">
    <label for="kraken">Kraken</label><br/>

    <input type="radio" id="sasquatch" name="monster">
    <label for="sasquatch">Sasquatch</label><br/>

    <input type="radio" id="mothman" name="monster">
    <label for="mothman">Mothman</label>
  </fieldset>
</form>
```

