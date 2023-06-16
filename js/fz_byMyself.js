// 两个数求和
function add(a, b) {
    // 设置ab不传参的默认值
    a = a || 1;
    b = b || 2;
    return a + b;
}

// 1.求任意数组中的最大值
function arr_maxNum(arr) {
    let maxNum = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > maxNum) {
            maxNum = arr[i];
        }
    }
    return maxNum;
}

// 2.求任意数组中的最小值
function arr_minNum(arr) {
    let minNum = arr[0];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] < minNum) {
            minNum = arr[i];
        }
    }
    return minNum;
}


// 3.反转数组的代码，封装成函数
// console.log([3,5,666,4,1].reverse());
function arr_fanzhuan(arr) {
    let arr_new = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        arr_new.push(arr[i]);
    }
    return arr_new;
}


// 4.对数组排序，从小到大（封装成函数）
function arr_maoPao(arr) {
    // 外层循环保证arr.length-1个元素冒泡排序
    for (let lun = 0; lun < arr.length - 1; lun++) {
        // 内层循环保证最大数字在数组最后 通过第三个变量交换比较相邻的元素
        for (let i = 0; i < arr.length; i++) {
            let temp = arr[i];
            if (arr[i] > arr[i + 1]) {
                arr[i] = arr[i + 1];
                arr[i + 1] = temp;
            }
        }
    }
    return arr;
}


// 5.输入一个年份，判断是否是闰年(能被4整除而不能被100整除.2.能被400整除.)
function year_pingRun(year) {
    let isRunNian = false;
    if ((year % 4 == 0 && year % 100 !== 0) || year % 400 == 0) {
        isRunNian = true;
    }
    return isRunNian = isRunNian ? '闰年' : '平年';
}


// 6.输入某年某月某日，判断这一天是这一年的第几天，封装成函数
/*  1，3，5,7,8,10,12月有31天
     4,6,9,11有30天
     2月，如果是平年就是28天，闰年就是29天 */
// 2004年8月12日 8月 ：7个月的和+8月的天数 2月29天 数组下标为month-1的和+day
// 闰年[31,29,31,30,31,30,31,31,30,31,30,31]
//      0  1  2  3  4  5  6  7  8  9  20 11
// 平年[31,28,31,30,31,30,31,31,30,31,30,31]
// console.log(parseInt('2004年'));
// 数组加一个0 方便统计下标到month-1的和
function diJiTian(date) {
    let runNian = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let pingNian = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let tianShu = 0;
    // let date = '2004年1月12日';
    let staNum = date.indexOf('年') + 1;
    let endNum = date.indexOf('月');
    // console.log(date.indexOf('年')+1,date.indexOf('月'));
    // console.log(staNum, endNum);
    let year = parseInt(date);
    let month = Number(date.substring(staNum, endNum));
    let day = Number(date.substring(endNum + 1, date.indexOf('日')));
    // console.log(year, month, day);
    // 简化代码 用一个变量标志润平年
    let flag = false;
    if ((year % 4 == 0 && year % 100 !== 0) || year % 400 == 0) {
        // 闰年
        flag = true;
    }
    // let pingOrrun = flag ? runNian[i]:pingNian[i];
    if (month == 1) {
        tianShu = day;
    } else {
        // 如果是1月之后的月份 统计从1到下标为month-1的和再加上day
        let i = 1;
        while (i <= month - 1) {
            // 三元判断闰平年 选择遍历的 部分数组
            tianShu += (flag ? runNian[i] : pingNian[i]);
            i++;
        }
        // console.log(tianShu);
    }
    // console.log(tianShu);
    return tianShu;
}


/*  8.判断一个数是否是素数 素数（质数）：就只能被1和自身整除的数就是素数，例如：7,13 1既不是素数也不是合数 */
function isZhiShu(num) {
    let iszhishu = true;
    for (let i = 2; i < num; i++) {
        // 如果能在[i,num)之间找到任何一个数整除num num就是合数
        if (num % i == 0) {
            // 进来了说明是合数
            iszhishu = false;
            break;
        }
    }
    return iszhishu = iszhishu ? '质数' : '合数';
}


// dataurl传入图片base64格式 返回文件
/* 
    File {name: 'file.png', lastModified: 1685606684905, lastModifiedDate: Thu Jun 01 2023 16:04:44 GMT+0800 (中国标准时间), webkitRelativePath: '', size: 139581, …}
lastModified
: 
1685606684905
lastModifiedDate
: 
Thu Jun 01 2023 16:04:44 GMT+0800 (中国标准时间) {}
name
: 
"file.png"
size
: 
139581
type
: 
"image/png"
webkitRelativePath
: 
""
[[Prototype]]
: 
File
*/
function base64ImgtoFile(dataurl, filename = 'file') {
    //将base64格式分割：['data:image/png;base64','XXXX']
    const arr = dataurl.split(',')
    // .*？ 表示匹配任意字符到下一个符合条件的字符 刚好匹配到：
    // image/png
    const mime = arr[0].match(/:(.*?);/)[1]  //image/png
    //[image,png] 获取图片类型后缀
    const suffix = mime.split('/')[1] //png
    const bstr = atob(arr[1])   //atob() 方法用于解码使用 base-64 编码的字符串
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime
    })
}
/*  */
//pic为base64地址 base64ImgtoFile getBase64URL两个函数综合使用将base64转为blob地址
function getBase64URL(pic) {
    const blob = base64ImgtoFile(pic)
    const blobUrl = window.URL.createObjectURL(blob);
    return blobUrl
}


// 视频全屏方法 element为视频元素 video 或canvas等
function launchFullscreen(element) {
    //此方法不可以在異步任務中執行，否則火狐無法全屏
    if (element.requestFullscreen) {//浏览器兼容
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.oRequestFullscreen) {
        element.oRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    } else {
        var docHtml = document.documentElement;
        var docBody = document.body;
        var videobox = document.getElementById('video');
        var cssText = 'width:100%;height:100%;overflow:hidden;';
        docHtml.style.cssText = cssText;
        docBody.style.cssText = cssText;
        videobox.style.cssText = cssText + ';' + 'margin:0px;padding:0px;';
        document.IsFullScreen = true;
    }
}

 // 时间格式化
 function formatTime(value) {
    var time = "";
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];
    return time;
}
// 时间转换
function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }
    return time;
}
// 时间逆向转化为秒
function niXiangTime(value) {
    let time = '';
    let timeArr = value.split(':');
    // timeArr可能有2种情况：s,f,m ;f,m 
    let num = timeArr.length;
    switch (num) {
        case 2: {
            // 只有分 秒
            time = parseInt(timeArr[0]) * 60 + parseInt(timeArr[1]);
            break;
        };
        case 3: {
            // 有时 分 秒
            time = parseInt(timeArr[0]) * 3600 + parseInt(timeArr[1]) * 60 + parseInt(timeArr[2]);
            break
        }
        default: {
            time = '时间格式不对';
        }
    }
    return time;
}

// 事件节流方法 可以和video.ontimeupdate 结合使用
//fn执行函数 delay停止触发事件多长时间后执行函数 minTime不断触发时强制执行时间
var throttle = function (fn, delay, minTime) {
    if (typeof fn !== 'function') return new Function()
    var timer = null;
    var starTime = null;
    return function () {
        var now = +new Date();
        !starTime && (starTime = now);
        if (minTime && now - starTime > minTime) {
            fn();
            starTime = now;//将开始时间重置
        } else {
            clearTimeout(timer);
            timer = setTimeout(function () {
                fn();
                starTime = null;
            }, delay);
        }
    }
};
