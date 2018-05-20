var utils = (function () {
    //toArray 类数组转换成数组
    var toArray = function (obj) {
        var ary = [];
        try {
            ary = [].slice.call(obj, 0)
        } catch (e) {
            for (var i = 0; i < obj.length; i++) {
                ary[ary.length] = obj[i];
            }
        }
        return ary
    };
    //toJSON JSON格式的字符串转换成JSON格式对象
    var toJSON = function (str) {
        return 'JSON' in window ? JSON.parse(str) : eval('(' + str + ')');
    };
    //offset(ele)求ele到body偏移量
    var offsetAll = function (ele) {
        var parent = ele.offsetParent,
            left = ele.offsetLeft,
            top = ele.offsetTop;
        while (!parent === document.body && p) { //1.ele.offsetParent是body  2.ele是body p是null 用 p是true排除
            if (!/MSIE 8\.0/.test(navigator.userAgent)) {
                left += parent.clientLeft;
                top += parent.clientTop;
            }
            left += parent.offsetLeft;
            top += parent.offsetTop;
            parent = parent.offsetParent;
        }
        return {
            left: left,
            top: top
        }

    };
    //getCss(ele,attr) 内嵌式或外链式里的css样式
    var getCss = function (ele, attr) {
        var result = '';
        if (window.getComputedStyle) {
            result = window.getComputedStyle(ele, null)[attr];
        } else {
            if (attr === 'opacity') {
                var item = ele.currentStyle.filter;
                var reg = /alpha\(opacity\s*=\s*(\d+(\.\d+)?)\)/;
                result = reg.test(item) ? RegExp.$1 / 100 : 1;
            } else {
                result = ele.currentStyle.attr;
            }
        }
        reg = /^-?(?:\d|[1-9]\d+)(?:\.\d+)?(?:rem|em|px|pt)?$/;
        return reg.test(result) ? parseFloat(result) : result;
    };
    //setCss(ele,attr,value)
    var setCss = function (ele, attr, value) {
        //1.opacity各个浏览器得区别设置
        //2.width\height\margin ...若没加单位,得加单位
        if (attr === 'opacity') {
            ele.style.opacity = value;
            ele.style.filter = 'alpha(opacity=' + value * 100 + ')';
        }
        var reg = /(?:widith|hegith)(?:(?:margin|padding)?(?:left|bottom|right|top)?)/i;
        if (reg.test(attr)) {
            if (!isNaN(value)) {
                value += 'px'
            }
        }
        ele.style[attr] = value;
    };
    //
    var setGroup = function (ele, options) {
        if (Object.prototype.toString.call(options) !== '[object Object]') return ;
        for (var key in options) {
            if (options.hasOwnProperty(key)) {//自己设置的是可枚举的
                setCss(ele, key, options[key])
            }
        }
    };
    var css = function () {
        //用arguments来接收实参 通过参数的类型判断调用什么方法 =>>另一个思路
        var len = arguments.length,
            type = Object.prototype.toString.call(arguments[1]),
            fn = getCss;
        len >= 3 ? fn = setCss : (len === 2 && type === '[object Object]' ? fn = setGroup : null);
         return fn.apply(null, arguments);
    };
    var win = function (attr, value) {
        if (typeof value === 'undefined') {
            return document.documentElement[attr] || document.body[attr];
        } else {
            if (attr === 'scrollTop' || attr === 'scrollLeft') {
                document.documentElement[attr] = value;
                document.body[attr] = value;
            }
        }
    };

    var getByClass=function (strClass,context){
        if(typeof 'getElementsByClassName' ==='function'){
            return utils.toArray(context.getElementsByClassName(strClass))
        }
        context=context||document;
        var eleAll=document.getElementsByTagName('*'),
            aClassAll=strClass.replace(/^\s+|\s+$/g,'').split(/\s+/g);
        for (var i = 0; i < aClassAll.length; i++) {
            var curClass=aClassAll[i],
                ary=[],
                reg=new RegExp('(^| +)'+curClass+'( +|$)');
            for (var j = 0; j < eleAll.length; j++) {
                if(reg.test(eleAll[j].className)){
                    ary.push(eleAll[j]);
                }
            }
            eleAll=ary;
        }
        return ary;
    };
    var hasClass=function (ele,strClass){
        var aryClass=strClass.replace(/^\s+|\s+$/g,'').split(/\s+/g);
        for (var i = 0; i < aryClass.length; i++) {
            var reg=new RegExp('(^| +)'+aryClass[i]+'( +|$)');
            if(!reg.test(ele.className)){
                return false
            }
        }
        return true;
    };
    var addClass=function (ele,strClass){
        var aryClass=strClass.replace(/^\s+|\s+$/g,'').split(/\s+/g);
        for (var i = 0; i < aryClass.length; i++) {
            if(!hasClass(ele,aryClass[i])){
                ele.className+=' '+aryClass[i];
            }
        }
    };
    var removeClass=function (ele,strClass){
        var aryClass=strClass.replace(/^\s+|\s+$/g,'').split(/\s+/g);
        for (var i = 0; i < aryClass.length; i++) {
            var reg = new RegExp('(^| +)' + aryClass[i] + '( +|$)');
            if(hasClass(ele,aryClass[i])){
                ele.className=ele.className.replace(reg,' '); //这里替换的时候中间要加一个空格
            }
        }
    };
    var getChild=function (ele,tagName){
        var ary=[];
        if(typeof tagName ==='undefined'){
            var eleAll=ele.childNodes;
            for (var i = 0; i < eleAll.length; i++) {
                if(eleAll[i].nodeType===1){
                    ary.push(eleAll[i]);
                }
            }
        }else if(typeof tagName ==='string'){
            //从所有子元素中筛选出标记名是tagName
            var eleAll=ele.childNodes;
            for (var j = 0; j < eleAll.length; j++) {
                if(eleAll[j].nodeType===1){
                    if(eleAll[j].nodeName.toLowerCase ===tagName.toLowerCase){
                        ary.push(eleAll[j]);
                    }
                }
            }
        }else {
            throw new TypeError('第二个参数类型错误');
        }
        return ary;
    };


    return {
        toArray: toArray,
        toJSON: toJSON,
        offsetAll: offsetAll,
        css: css,
        win: win,
        getOneClass:getOneClass,
        getByClass:getByClass,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass,
        getChild:getChild
    }
})();


//兼容处理之传递单个样式类名
var getEleByClass=function (strClass,context){
    context = context||document;
    var result=[],
        nodeList=context.getElementsByTagName('*');
    strClass=strClass.replace(/^\s+|\s+$/g,'');
    for (var i = 0; i < nodeList.length; i++) {
        var item = nodeList[i];
        var reg=new RegExp('(^| +)'+strClass+'( +|$)');
        if(reg.test(item.className)){
            result.push(item);
        }
    }
    return result;
};
//单个兼容处理
var getEleByClass=function (strClass,context){
    context=context||document;
    var result=[],
        nodeList=context.getElementsByTagName('*');
    strClass=strClass.replace(/^\s+|\s+$/g,'');
    for (var i = 0; i < nodeList.length; i++) {
       var item=nodeList[i];
       var ary=item.className.split(/\s+/g),
           flag=false;
        for (var j = 0; j < ary.length; j++) {
            if(strClass===ary[j]){
                flag=true;
                break;
            }
        }
        flag? result.push(item):null;
    }
    return result;
};

//传递多个样式类名 第一种方法 :
var getEleByClass=function (strClass,context){
    context =context ||document;
    var result=[],
        nodeList= context.getElementsByTagName('*');
    strClass=strClass.replace(/^\s+|\s+$/g,'').split(/\s+/g);

    for (var i = 0; i < nodeList.length; i++) {
        var item=nodeList[i],
            itemClass=item.className,
            flag=true;//=>假设你传递的样式类名在item中都存在
        for (var j = 0; j < strClass.length; j++) {
            var reg=new RegExp('(^| +)'+strClass[j]+'( +|$)');
            if(!reg.test(itemClass)){
                flag=false;
                break;
            }
        }
        flag?result.push(item):null;
    }
    return result;
};
//第二种方法 排除法 :
var getByClass=function (strClass,context){
    context=context||document;
    var eleAll=context.getElementsByTagName('*');
    strClass=strClass.replace(/^\s+|\s+$/g,'').split(/\s+/g);
    eleAll=utils.toArray(eleAll);
    for (var j = 0; j < strClass.length; j++) {
        var reg =new RegExp('(^|\\s+)'+strClass[j]+'(\\s+|$)');
        for (var i = 0; i < eleAll.length; i++) {
            if(!reg.test(eleAll[i].className)){
                eleAll.splice(i,1);
                i--;
            }
        }
    }
    return eleAll;
};

Node.prototype.queryElementsByClassName=function (){
    if(arguments.length===0) return [];
    var strClass=arguments[0],
        nodeList=utils.toArray(this.getElementsByName('*'));
    strClass=strClass.replace(/^\s|\s+$/g,'').split(/\s+/);
    for (var i = 0; i < strClass.length; i++) {
            var reg=new RegExp('(^|\\s+)'+strClass[i]+'(\\s+|$)');
        for (var j = 0; j < reg.length; j++) {
            if(!reg.test(nodeList[k].className)){
                nodeList.splice(k,1);
                k--;
            }
        }
    }
    return nodeList;
};

Node.prototype.queryElementsByClassName=function (){
    if(arguments.length===0) return [];
    var strClass=arguments[0];
        nodeList=utils.toArray(this.getElementsByName('*'));
        strClass=strClass.replace(/^\s|\s+/g,'').split(/\s+/);
    for (var i = 0; i < strClass.length; i++) {
        var reg =new RegExp('(^|\\s+)'+strClass+'(\\s+|$)');
        for (var j = 0; j < utils.length; j++) {
           if(!reg.test(nodeList[k].className)){
               nodeList.splice(k,1);
               k--;
           }
        }
    }
    return nodeList;
};
var childeren=function (curEle,tagName){
    var result=[],
    childList=curEle.childNodes;
    for (var i = 0; i < childList.length; i++) {
        var item = childList[i];
        if(item.nodeType===1){
            if(typeof tagName !== 'undefined'){
                if(item.tagName.toLowerCase()===tagName.toLowerCase()){
                    result.push(item);
                }
                continue; //=>这里是重点
            }
            result.push(item);
        }
        item.nodeType ===1?result.push(item):null;
    }

    //=>在获取的所有子元素节点中进行二次过滤
    if(typeof tagName !=='undefined'){
        for (var k = 0; k < result.length; k++) {
            if(result[k].tagName.toLowerCase()===tagName.toLowerCase()){
                result.splice(k,1);
                k--;
            }
        }
    }
    return result
};

