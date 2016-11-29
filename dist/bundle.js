/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	eval("\"use strict\";\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\nvar _utils = __webpack_require__(1);\n\nvar Utils = _interopRequireWildcard(_utils);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\n$.fn.timeSchedule = function (options) {\n    var defaults = {\n        rows: {},\n        startTime: \"07:00\",\n        endTime: \"19:30\",\n        widthTimeX: 25, // Width per cell (px)\n        widthTime: 600, // Separation time (sec)\n        timeLineY: 50, // timeline height(px)\n        timeLineBorder: 1, // timeline height border\n        timeBorder: 1, // border width\n        timeLinePaddingTop: 0,\n        timeLinePaddingBottom: 3,\n        headTimeBorder: 0, // time border width\n        dataWidth: 160, // data width\n        verticalScrollbar: 0, // vertical scrollbar width\n\n        // event\n        init_data: null,\n        change: null,\n        click: null,\n        append: null,\n        time_click: null,\n        debug: \"\" // debug selector\n    };\n\n    var setting = $.extend(defaults, options);\n    this.setting = setting;\n    var scheduleData = [];\n    var timelineData = [];\n    var $element = $(this);\n    var element = this;\n    var tableStartTime = Utils.calcStringTime(setting.startTime);\n    var tableEndTime = Utils.calcStringTime(setting.endTime);\n    var currentNode = null;\n    tableStartTime -= tableStartTime % setting.widthTime;\n    tableEndTime -= tableEndTime % setting.widthTime;\n\n    this.getScheduleData = function () {\n        return scheduleData;\n    };\n\n    this.getTimelineData = function () {\n        return timelineData;\n    };\n\n    // Get the current timeline number\n    this.getTimeLineNumber = function (top) {\n        var num = 0;\n        var n = 0;\n        var tn = Math.ceil(top / (setting.timeLineY + setting.timeLinePaddingTop + setting.timeLinePaddingBottom));\n        setting.rows.forEach(function (val) {\n            var r = val;\n            var tr = 0;\n            if (_typeof(r[\"schedule\"]) == Object) {\n                tr = r[\"schedule\"].length;\n            }\n            if (currentNode && currentNode[\"timeline\"]) {\n                tr++;\n            }\n            n += Math.max(tr, 1);\n            if (n >= tn) {\n                return;\n            }\n            num++;\n        });\n\n        return num;\n    };\n\n    this.addNewEvent = function (data) {\n\n        var convertedData = {\n            \"timeline\": 0,\n            \"start\": Utils.calcStringTime(data.start),\n            \"end\": Utils.calcStringTime(data.end),\n            \"text\": data.text,\n            \"data\": data.data\n        };\n\n        this.addScheduleData(convertedData);\n    };\n\n    // Add schedule\n    this.addScheduleData = function (data) {\n        var st = Math.ceil((data[\"start\"] - tableStartTime) / setting.widthTime);\n        var et = Math.floor((data[\"end\"] - tableStartTime) / setting.widthTime);\n        var $bar = jQuery('<div class=\"sc_Bar\"><span class=\"head\"><span class=\"time\"></span></span><span class=\"text\"></span></div>');\n        var stext = Utils.formatTime(data[\"start\"]);\n        var etext = Utils.formatTime(data[\"end\"]);\n        var snum = element.getScheduleCount(data[\"timeline\"]);\n        $bar.css({\n            left: st * setting.widthTimeX,\n            top: snum * setting.timeLineY + setting.timeLinePaddingTop,\n            width: (et - st) * setting.widthTimeX,\n            height: setting.timeLineY\n        });\n        $bar.find(\".time\").text(stext + \"-\" + etext);\n        if (data[\"text\"]) {\n            $bar.find(\".text\").text(data[\"text\"]);\n        }\n        if (data[\"class\"]) {\n            $bar.addClass(data[\"class\"]);\n        }\n        //$element.find('.sc_main').append($bar);\n        $element.find('.sc_main .timeline').eq(data[\"timeline\"]).append($bar);\n        // Add data\n        scheduleData.push(data);\n        // key\n        var key = scheduleData.length - 1;\n        $bar.data(\"sc_key\", key);\n\n        $bar.bind(\"mouseup\", function () {\n            // Call back if callback is set\n            if (setting.click) {\n                if (jQuery(this).data(\"dragCheck\") !== true && jQuery(this).data(\"resizeCheck\") !== true) {\n                    var node = jQuery(this);\n                    var sc_key = node.data(\"sc_key\");\n                    setting.click(node, scheduleData[sc_key]);\n                }\n            }\n        });\n\n        var $node = $element.find(\".sc_Bar\");\n        // move node.\n        $node.draggable({\n            grid: [setting.widthTimeX, 1],\n            containment: \".sc_main\",\n            helper: 'original',\n            start: function start(event, ui) {\n                var node = {};\n                node[\"node\"] = this;\n                node[\"offsetTop\"] = ui.position.top;\n                node[\"offsetLeft\"] = ui.position.left;\n                node[\"currentTop\"] = ui.position.top;\n                node[\"currentLeft\"] = ui.position.left;\n                node[\"timeline\"] = element.getTimeLineNumber(ui.position.top);\n                node[\"nowTimeline\"] = node[\"timeline\"];\n                currentNode = node;\n            },\n            drag: function drag(event, ui) {\n                jQuery(this).data(\"dragCheck\", true);\n                if (!currentNode) {\n                    return false;\n                }\n                var $moveNode = jQuery(this);\n                var sc_key = $moveNode.data(\"sc_key\");\n                var originalTop = ui.originalPosition.top;\n                var originalLeft = ui.originalPosition.left;\n                var positionTop = ui.position.top;\n                var positionLeft = ui.position.left;\n                var timelineNum = element.getTimeLineNumber(ui.position.top);\n                // fix position\n                //ui.position.top = Math.floor(ui.position.top / setting.timeLineY) * setting.timeLineY;\n                //ui.position.top = element.getScheduleCount(timelineNum) * setting.timeLineY;\n                ui.position.left = Math.floor(ui.position.left / setting.widthTimeX) * setting.widthTimeX;\n\n                //$moveNode.find(\".text\").text(timelineNum+\" \"+(element.getScheduleCount(timelineNum) + 1));\n                if (currentNode[\"nowTimeline\"] != timelineNum) {\n                    // Adjust height\n                    //element.resizeRow(currentNode[\"nowTimeline\"],element.getScheduleCount(currentNode[\"nowTimeline\"]));\n                    //element.resizeRow(timelineNum,element.getScheduleCount(timelineNum) + 1);\n                    // Current timeline\n                    currentNode[\"nowTimeline\"] = timelineNum;\n                } else {\n                    //ui.position.top = currentNode[\"currentTop\"];\n                }\n                currentNode[\"currentTop\"] = ui.position.top;\n                currentNode[\"currentLeft\"] = ui.position.left;\n                // Text change\n                element.rewriteBarText($moveNode, scheduleData[sc_key]);\n                return true;\n            },\n            // Processing after element movement has ended\n            stop: function stop(event, ui) {\n                jQuery(this).data(\"dragCheck\", false);\n                currentNode = null;\n\n                var node = jQuery(this);\n                var sc_key = node.data(\"sc_key\");\n                var x = node.position().left;\n                var w = node.width();\n\n                var start = tableStartTime + Math.floor(x / setting.widthTimeX) * setting.widthTime;\n                // let end = tableStartTime + (Math.floor((x + w) / setting.widthTimeX) * setting.widthTime);\n                var end = start + (scheduleData[sc_key][\"end\"] - scheduleData[sc_key][\"start\"]);\n\n                scheduleData[sc_key][\"start\"] = start;\n                scheduleData[sc_key][\"end\"] = end;\n                // Call back if callback is set\n                if (setting.change) {\n                    setting.change(node, scheduleData[sc_key]);\n                }\n            }\n        });\n        $node.resizable({\n            handles: 'e, w', // East (right) and West (left),\n            grid: [setting.widthTimeX, setting.timeLineY],\n            minWidth: setting.widthTimeX,\n            start: function start(event, ui) {\n                var node = jQuery(this);\n                node.data(\"resizeCheck\", true);\n            },\n            // Processing after element movement has ended\n            stop: function stop(event, ui) {\n                var node = jQuery(this);\n                var sc_key = node.data(\"sc_key\");\n                var x = node.position().left;\n                var w = node.width();\n                var start = tableStartTime + Math.floor(x / setting.widthTimeX) * setting.widthTime;\n                var end = tableStartTime + Math.floor((x + w) / setting.widthTimeX) * setting.widthTime;\n                var timelineNum = scheduleData[sc_key][\"timeline\"];\n\n                scheduleData[sc_key][\"start\"] = start;\n                scheduleData[sc_key][\"end\"] = end;\n\n                // Height adjustment\n                element.resetBarPosition(timelineNum);\n                // Text change\n                element.rewriteBarText(node, scheduleData[sc_key]);\n\n                node.data(\"resizeCheck\", false);\n                // Call back if callback is set\n                if (setting.change) {\n                    setting.change(node, scheduleData[sc_key]);\n                }\n            }\n        });\n        return key;\n    };\n    // Acquire schedule number\n    this.getScheduleCount = function (n) {\n        var num = 0;\n        for (var i in scheduleData) {\n            if (scheduleData[i][\"timeline\"] == n) {\n                num++;\n            }\n        }\n        return num;\n    };\n    // add\n    this.addRow = function (timeline, row) {\n        var title = row[\"title\"];\n        var id = $element.find('.sc_main .timeline').length;\n\n        var html = void 0;\n\n        html = '';\n        html += '<div class=\"timeline\"><span>' + title + '</span></div>';\n        var $data = jQuery(html);\n        // event call\n        if (setting.init_data) {\n            setting.init_data($data, row);\n        }\n        $element.find('.sc_data_scroll').append($data);\n\n        html = '';\n        html += '<div class=\"timeline\"></div>';\n        var $timeline = jQuery(html);\n        for (var t = tableStartTime; t < tableEndTime; t += setting.widthTime) {\n            var $tl = jQuery('<div class=\"tl\"></div>');\n            $tl.width(setting.widthTimeX - setting.timeBorder);\n\n            $tl.data(\"time\", Utils.formatTime(t));\n            $tl.data(\"timeline\", timeline);\n            $timeline.append($tl);\n        }\n        // click event\n        if (setting.time_click) {\n            $timeline.find(\".tl\").click(function () {\n                setting.time_click(this, jQuery(this).data(\"time\"), jQuery(this).data(\"timeline\"), timelineData[jQuery(this).data(\"timeline\")]);\n            });\n        }\n        $element.find('.sc_main').append($timeline);\n\n        timelineData[timeline] = row;\n\n        if (row[\"class\"] && row[\"class\"] != \"\") {\n            $element.find('.sc_data .timeline').eq(id).addClass(row[\"class\"]);\n            $element.find('.sc_main .timeline').eq(id).addClass(row[\"class\"]);\n        }\n        // Schedule timeline\n        if (row[\"schedule\"]) {\n            for (var i in row[\"schedule\"]) {\n                var bdata = row[\"schedule\"][i];\n                var s = Utils.calcStringTime(bdata[\"start\"]);\n                var e = Utils.calcStringTime(bdata[\"end\"]);\n\n                var data = {};\n                data[\"timeline\"] = id;\n                data[\"start\"] = s;\n                data[\"end\"] = e;\n                if (bdata[\"text\"]) {\n                    data[\"text\"] = bdata[\"text\"];\n                }\n                data[\"data\"] = {};\n                if (bdata[\"data\"]) {\n                    data[\"data\"] = bdata[\"data\"];\n                }\n                element.addScheduleData(data);\n            }\n        }\n        // Adjust height\n        element.resetBarPosition(id);\n        $element.find('.sc_main .timeline').eq(id).droppable({\n            accept: \".sc_Bar\",\n            drop: function drop(ev, ui) {\n                var node = ui.draggable;\n                var sc_key = node.data(\"sc_key\");\n                var nowTimelineNum = scheduleData[sc_key][\"timeline\"];\n                var timelineNum = $element.find('.sc_main .timeline').index(this);\n                // change timeline\n                scheduleData[sc_key][\"timeline\"] = timelineNum;\n                node.appendTo(this);\n                // Height adjustment\n                element.resetBarPosition(nowTimelineNum);\n                element.resetBarPosition(timelineNum);\n            }\n        });\n        // Call back if callback is set\n        if (setting.append) {\n            $element.find('.sc_main .timeline').eq(id).find(\".sc_Bar\").each(function () {\n                var node = jQuery(this);\n                var sc_key = node.data(\"sc_key\");\n                setting.append(node, scheduleData[sc_key]);\n            });\n        }\n    };\n    this.getScheduleData = function () {\n        var data = [];\n\n        for (var i in timelineData) {\n            if (typeof timelineData[i] == \"undefined\") continue;\n            var timeline = jQuery.extend(true, {}, timelineData[i]);\n            timeline.schedule = [];\n            data.push(timeline);\n        }\n\n        for (var _i in scheduleData) {\n            if (typeof scheduleData[_i] == \"undefined\") continue;\n            var schedule = jQuery.extend(true, {}, scheduleData[_i]);\n            schedule.start = Utils.formatTime(schedule.start);\n            schedule.end = Utils.formatTime(schedule.end);\n            var timelineIndex = schedule.timeline;\n            delete schedule.timeline;\n            data[timelineIndex].schedule.push(schedule);\n        }\n\n        return data;\n    };\n    // Change text\n    this.rewriteBarText = function (node, data) {\n        var x = node.position().left;\n        var w = node.width();\n        var start = tableStartTime + Math.floor(x / setting.widthTimeX) * setting.widthTime;\n        //let end = tableStartTime + (Math.floor((x + w) / setting.widthTimeX) * setting.widthTime);\n        var end = start + (data[\"end\"] - data[\"start\"]);\n        var html = Utils.formatTime(start) + \"-\" + Utils.formatTime(end);\n        jQuery(node).find(\".time\").html(html);\n    };\n    this.resetBarPosition = function (n) {\n        // reorder elements\n        var $bar_list = $element.find('.sc_main .timeline').eq(n).find(\".sc_Bar\");\n        var codes = [];\n        for (var i = 0; i < $bar_list.length; i++) {\n            codes[i] = { code: i, x: jQuery($bar_list[i]).position().left };\n        }\n\n        // Sort\n        codes.sort(function (a, b) {\n            if (a[\"x\"] < b[\"x\"]) {\n                return -1;\n            } else if (a[\"x\"] > b[\"x\"]) {\n                return 1;\n            }\n            return 0;\n        });\n        var check = [];\n        var h = 0;\n        var $e1 = void 0,\n            $e2 = void 0;\n        var c1 = void 0,\n            c2 = void 0;\n        var s1 = void 0,\n            e1 = void 0,\n            s2 = void 0,\n            e2 = void 0;\n        for (var _i2 = 0; _i2 < codes.length; _i2++) {\n            c1 = codes[_i2][\"code\"];\n            $e1 = jQuery($bar_list[c1]);\n            for (h = 0; h < check.length; h++) {\n                var next = false;\n                L: for (var j = 0; j < check[h].length; j++) {\n                    c2 = check[h][j];\n                    $e2 = jQuery($bar_list[c2]);\n\n                    s1 = $e1.position().left;\n                    e1 = $e1.position().left + $e1.width();\n                    s2 = $e2.position().left;\n                    e2 = $e2.position().left + $e2.width();\n                    if (s1 < e2 && e1 > s2) {\n                        next = true;\n                        continue L;\n                    }\n                }\n                if (!next) {\n                    break;\n                }\n            }\n            if (!check[h]) {\n                check[h] = [];\n            }\n            $e1.css({ top: h * setting.timeLineY + setting.timeLinePaddingTop });\n            check[h][check[h].length] = c1;\n        }\n        // Adjust height\n        this.resizeRow(n, check.length);\n    };\n    this.resizeRow = function (n, height) {\n        //let h = Math.max(element.getScheduleCount(n),1);\n        var h = Math.max(height, 1);\n        $element.find('.sc_data .timeline').eq(n).height(h * setting.timeLineY - setting.timeLineBorder + setting.timeLinePaddingTop + setting.timeLinePaddingBottom);\n        $element.find('.sc_main .timeline').eq(n).height(h * setting.timeLineY - setting.timeLineBorder + setting.timeLinePaddingTop + setting.timeLinePaddingBottom);\n\n        $element.find('.sc_main .timeline').eq(n).find(\".sc_bgBar\").each(function () {\n            jQuery(this).height(jQuery(this).closest(\".timeline\").height());\n        });\n\n        $element.find(\".sc_data\").height($element.find(\".sc_main_box\").height());\n    };\n    // resizeWindow\n    this.resizeWindow = function () {\n        var sc_width = $element.width();\n        var sc_main_width = sc_width - setting.dataWidth - setting.verticalScrollbar;\n        var cell_num = Math.floor((tableEndTime - tableStartTime) / setting.widthTime);\n        $element.find(\".sc_header_cell\").width(setting.dataWidth);\n        $element.find(\".sc_data,.sc_data_scroll\").width(setting.dataWidth);\n        $element.find(\".sc_header\").width(sc_main_width);\n        $element.find(\".sc_main_box\").width(sc_main_width);\n        $element.find(\".sc_header_scroll\").width(setting.widthTimeX * cell_num);\n        $element.find(\".sc_main_scroll\").width(setting.widthTimeX * cell_num);\n    };\n    // init\n    this.init = function () {\n        var html = '';\n        html += '<div class=\"sc_menu\">' + \"\\n\";\n        html += '<div class=\"sc_header_cell\"><span>&nbsp;</span></div>' + \"\\n\";\n        html += '<div class=\"sc_header\">' + \"\\n\";\n        html += '<div class=\"sc_header_scroll\">' + \"\\n\";\n        html += '</div>' + \"\\n\";\n        html += '</div>' + \"\\n\";\n        html += '<br class=\"clear\" />' + \"\\n\";\n        html += '</div>' + \"\\n\";\n        html += '<div class=\"sc_wrapper\">' + \"\\n\";\n        html += '<div class=\"sc_data\">' + \"\\n\";\n        html += '<div class=\"sc_data_scroll\">' + \"\\n\";\n        html += '</div>' + \"\\n\";\n        html += '</div>' + \"\\n\";\n        html += '<div class=\"sc_main_box\">' + \"\\n\";\n        html += '<div class=\"sc_main_scroll\">' + \"\\n\";\n        html += '<div class=\"sc_main\">' + \"\\n\";\n        html += '</div>' + \"\\n\";\n        html += '</div>' + \"\\n\";\n        html += '</div>' + \"\\n\";\n        html += '<br class=\"clear\" />' + \"\\n\";\n        html += '</div>' + \"\\n\";\n\n        $element.append(html);\n\n        $element.find(\".sc_main_box\").scroll(function () {\n            $element.find(\".sc_data_scroll\").css(\"top\", $(this).scrollTop() * -1);\n            $element.find(\".sc_header_scroll\").css(\"left\", $(this).scrollLeft() * -1);\n        });\n\n        // add time cell\n        var cell_num = Math.floor((tableEndTime - tableStartTime) / setting.widthTime);\n        var before_time = -1;\n        for (var t = tableStartTime; t < tableEndTime; t += setting.widthTime) {\n\n            if (before_time < 0 || Math.floor(before_time / 3600) != Math.floor(t / 3600)) {\n                var _html = '';\n                _html += '<div class=\"sc_time\">' + Utils.formatTime(t) + '</div>';\n                var $time = jQuery(_html);\n                var _cell_num = Math.floor(Number(Math.min(Math.ceil((t + setting.widthTime) / 3600) * 3600, tableEndTime) - t) / setting.widthTime);\n                $time.width(_cell_num * setting.widthTimeX - setting.headTimeBorder);\n                $element.find(\".sc_header_scroll\").append($time);\n\n                before_time = t;\n            }\n        }\n\n        jQuery(window).resize(function () {\n            element.resizeWindow();\n        }).trigger(\"resize\");\n\n        // addrow\n\n        setting.rows.forEach(function (val, i) {\n            this.addRow(i, val);\n        }.bind(this));\n    };\n    // Initialization\n    this.init();\n\n    this.debug = function () {\n        var html = '';\n        for (var i in scheduleData) {\n            html += '<div>';\n\n            html += i + \" : \";\n            var d = scheduleData[i];\n            for (var n in d) {\n                var dd = d[n];\n                html += n + \" \" + dd;\n            }\n\n            html += '</div>';\n        }\n        jQuery(setting.debug).html(html);\n    };\n    if (setting.debug && setting.debug != \"\") {\n        setInterval(function () {\n            element.debug();\n        }, 10);\n    }\n\n    return this;\n};\n\n//////////////////\n// WEBPACK FOOTER\n// ./js/jq.schedule.js\n// module id = 0\n// module chunks = 0\n//# sourceURL=webpack:///./js/jq.schedule.js?");

/***/ },
/* 1 */
/***/ function(module, exports) {

	eval("\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n    value: true\n});\nexports.calcStringTime = calcStringTime;\nexports.formatTime = formatTime;\nfunction calcStringTime(string) {\n    var slice = string.split(':');\n    var h = Number(slice[0]) * 60 * 60;\n    var i = Number(slice[1]) * 60;\n    var min = h + i;\n\n    return min;\n}\n\nfunction formatTime(min) {\n    var h = \"\" + (min / 36000 | 0) + (min / 3600 % 10 | 0);\n    var i = \"\" + (min % 3600 / 600 | 0) + (min % 3600 / 60 % 10 | 0);\n    var string = h + \":\" + i;\n\n    return string;\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./js/utils.js\n// module id = 1\n// module chunks = 0\n//# sourceURL=webpack:///./js/utils.js?");

/***/ }
/******/ ]);