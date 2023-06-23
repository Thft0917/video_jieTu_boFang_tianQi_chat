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
        imgUrl: './data/images/渲染01.webp',
        // 默认聊天人物：胡歌
        chatPerson: '胡歌',
        // 是否要换个人聊
        isTure: '',
        // apiKey
        apiKey: '',
        // 没被选中聊天的人
        chatPerson_no: [],
        // 聊天人物头像
        icon: ['大幂幂.webp', '胡歌.webp', '张雪迎.webp'],
        // 今天没有权限聊天的机器人
        meiQuXuan: [],
        // 今天有权限聊天的机器人
        youQuanXian: [],
        // 
        jqr : ['胡歌','大幂幂','张雪迎']
    },
    methods: {
        chat() {
            //  把我的话 和标志着我说的话以对象存入message中
            this.message.push({
                message: this.inputValue,
                isSelf: true
            })
            // apiKey和聊天人物对应存入vue实例
            switch (this.chatPerson) {
                case '胡歌': {
                    this.apiKey = '15719c8803174a879acbbe1b528c2f60';
                    break
                };
                case '大幂幂': {
                    this.apiKey = 'bc6e25a11efd41d7b94758109c075d73';
                    break
                };
                case '张雪迎': {
                    this.apiKey = '4d62f917d0ce44ceae7cd8fe0493cca5'
                }
            }
            // 发送ajax请求获取机器人说的话 并存入this.message中
            let data = `{
                    "perception": {
                       "inputText": {
                           "text": "${this.inputValue}"
                       }
                    },
                    "userInfo": {
                       "apiKey": "${this.apiKey}",
                       "userId": "458056"
                    }
            }`
            // let dataOjb = JSON.parse(data);
            // this.apiKey = dataOjb.userInfo.apiKey;

            $.ajax({
                type: 'post',
                url: 'http://openapi.turingapi.com/openapi/api/v2',
                data,
                dataType: 'json',
                success: backData => {
                    // console.log(this);  //vue实例
                    // console.log(backData);
                    // console.log(backData.results[0].values.text);
                    // if(backData.results[0].values.text=='请求次数超限制!')
                    // 把机器人的话存入数据data的message中
                    this.message.push({
                        message: backData.results[0].values.text,
                        isSelf: false
                    })
                    if (backData.intent.code == 4003) {
                       const timeID2= setTimeout(() => {
                            // console.log(this);
                            let isTure = confirm('要不换个人聊聊')
                            this.isTure = isTure;
                            // 已经在this.meiQuXuan的数组中 再次调用ajax不用在将this.chatPerson添加
                            if (this.meiQuXuan.indexOf(this.chatPerson) == -1) {
                                this.meiQuXuan.push(this.chatPerson);
                            }
                            for(var i=0;i<this.jqr.length;i++) {
                                if(this.meiQuXuan.indexOf(this.jqr[i])==-1) {
                                    this.youQuanXian.push(this.jqr[i])
                                }
                            }

                            let chang = this.icon.length - this.meiQuXuan.length;
                            
                            // 确定换个人聊
                            if (isTure) {
                                if(this.jqr.length!==this.meiQuXuan.length) {
                                    var jqr = prompt(`你可以和${this.jqr} 聊天,但是${this.meiQuXuan}已经没有权限了,请输入你要聊天的人:`)
                                }else {
                                    const timeID = setTimeout(function() {
                                        alert('今天的机器人权限都用完了,请重新创建或升级账号');
                                        clearTimeout(timeID)
                                    },700)
                                }
                               /*  if (chang == 2) {
                                    var num = +prompt(`已经不能和${this.meiQuXuan}聊天了,可以选择序号
                                    1.${this.youQuanXian[0]}
                                    2.${this.youQuanXian[1]}
                                    `)
                                    switch (num) {
                                        case 1: {
                                            this.chatPerson = this.youQuanXian[0];
                                            break
                                        };
                                        case 2: {
                                            this.chatPerson = this.youQuanXian[1];
                                            break
                                        };
                                        default: {
                                            console.log('选择错误');
                                        }
                                    }
                                }else if(chang==1) {
                                    var num = +prompt(`已经不能和${this.meiQuXuan}聊天了,可以选择序号
                                    1.${this.youQuanXian[0]}
                                    `)
                                    switch (num) {
                                        case 1: {
                                            this.chatPerson = this.youQuanXian[0];
                                            break
                                        };
                                        default: {
                                            console.log('选择错误');
                                        }
                                    }
                                }else if(chang == 0) {
                                    alert('都没权限')
                                } */
                                if(this.jqr.indexOf(jqr)!==-1) {
                                    this.chatPerson = jqr;
                                }

                                // 换人聊天后 apiKey修改成对应的人
                                switch (this.chatPerson) {
                                    case '胡歌': {
                                        this.apiKey = '15719c8803174a879acbbe1b528c2f60';
                                        break
                                    };
                                    case '大幂幂': {
                                        this.apiKey = 'bc6e25a11efd41d7b94758109c075d73';
                                        break
                                    };
                                    case '张雪迎': {
                                        this.apiKey = '4d62f917d0ce44ceae7cd8fe0493cca5'
                                    }
                                }
                                // 换人聊天后 清屏
                                $('ul').empty()
                                console.log(this);

                            }
                            if(this.jqr.length==this.meiQuXuan.length) {
                                clearTimeout(timeID2)
                            }


                        }, 700)

                    }
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