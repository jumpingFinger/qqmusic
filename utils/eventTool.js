'use strict';

~function () {
    Function.prototype.myBind = function myBind() {
        var _this = this;

        for (var _len = arguments.length, outer = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            outer[_key - 1] = arguments[_key];
        }

        var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

        if ('bind' in this) {
            return this.bind.apply(this, arguments);
        }
        return function () {
            for (var _len2 = arguments.length, inner = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                inner[_key2] = arguments[_key2];
            }

            return _this.apply(context, outer.concat(inner));
        };
    };

    var on = function on(curEle, type, fn) {
        if (document.addEventListener) {
            curEle.addEventListener(type, fn, false);
            return;
        }
        if (typeof curEle['pond' + type] === 'undefined') {
            curEle['pond' + type] = [];
            curEle.attachEvent('on' + type, run.myBind(curEle));
        }
        var pondAry = curEle['pond' + type];
        for (var i = 0; i < pondAry.length; i++) {
            if (pondAry[i] === fn) {
                return;
            }
        }
        pondAry.push(fn);
    };

    var off = function off(curEle, type, fn) {
        if (document.removeEventListener) {
            curEle.removeEventListener(type, fn, false);
            return;
        }
        var pondAry = curEle['pond' + type];
        if (!pondAry) return;
        for (var i = 0; i < pondAry.length; i++) {
            var itemFn = pondAry[i];
            if (itemFn === fn) {
                pondAry[i] = null;
                break;
            }
        }
    };

    var run = function run(e) {
        e = e || window.event;
        if (!e.target) {
            e.target = e.srcElement;
            e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
            e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
            e.which = e.keyCode;
            e.preventDefault = function () {
                e.returnValue = false;
            };
            e.stopPropagation = function () {
                e.cancelBubble = true;
            };
        }
        var pondAry = this['pond' + e.type];
        if (!pondAry) return;
        for (var i = 0; i < pondAry.length; i++) {
            var itemFn = pondAry[i];
            if (itemFn === null) {
                pondAry.splice(i, 1);
                i--;
                continue;
            }
            itemFn.call(this, e);
        }
    };

    window.$event = {
        on: on,
        off: off
    };
}();
