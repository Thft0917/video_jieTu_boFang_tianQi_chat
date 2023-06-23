// 原生部分实现 时间同步 等更广阔学会了vue再去用vue实现
 // 页面一打开的时候先获取到时间 后再执行下面的延时器
 function x() {
    let timeStr;
    let time = new Date();
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();
    if (h < 10 && m > 10 && s > 10) {
        timeStr = `0${h}:${m}:${s}`;
    } else if (h > 10 && m < 10 && s > 10) {
        timeStr = `${h}:0${m}:${s}`;
    } else if (h > 10 && m > 10 && s < 10) {
        timeStr = `${h}:${m}:0${s}`;
    } else if (h < 10 && m < 10 && s > 10) {
        timeStr = `0${h}:0${m}:${s}`;
    } else if (h < 10 && m > 10 && s < 10) {
        timeStr = `0${h}:${m}:0${s}`;
    } else if (h > 10 && m < 10 && s < 10) {
        timeStr = `${h}:0${m}:0${s}`;
    } else if (h < 10 && m < 10 && s < 10) {
        timeStr = `0${h}:0${m}:0${s}`;
    } else if (h > 10 && m > 10 && s > 10) {
        timeStr = `${h}:${m}:${s}`
    }
    $('.time').text(timeStr)
}
x();
// console.dir(time);
// console.log(`${h}:${m}:${s}`);

setInterval(() => {
    x()
}, 1000);

// vue部分
let app = new Vue({
    el: '#container',
    data: {
        inputValue: '',
        message: [],
        imgUrl : './data/images/渲染01.webp',
    },
    methods: {
        chat() {
            //  把我的话 和标志着我说的话以对象存入message中
            this.message.push({
                message: this.inputValue,
                isSelf: true
            })
            // 发送ajax请求获取机器人说的话 并存入this.message中
            let data = `{
                    "perception": {
                       "inputText": {
                           "text": "${this.inputValue}"
                       }
                    },
                    "userInfo": {
                       "apiKey": "15719c8803174a879acbbe1b528c2f60",
                       "userId": "458056"
                    }
            }`
            $.ajax({
                type : 'post',
                url : 'http://openapi.turingapi.com/openapi/api/v2',
                data,
                dataType : 'json',
                success : backData => {
                    // console.log(this);  //vue实例
                    // console.log(backData);
                    // 把机器人的话存入数据data的message中
                    this.message.push({
                        message : backData.results[0].values.text,
                        isSelf : false
                    })
                }
            })
            // console.log(this);
            // console.log(this.message);
            this.inputValue = '';
        },
        gengHuan(e) {
            // console.dir(e.target);
            let file = e.target.files[0];
            let fileBlob = URL.createObjectURL(file);
            // console.log(fileBlob);
            this.imgUrl = fileBlob;
            console.log(this);
        }
    },
    updated() {
        // 滚到头
        $('.content').scrollTop(9999)
    }
})