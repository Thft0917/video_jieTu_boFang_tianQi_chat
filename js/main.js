$(function () {
    // 找到视频帧画布 存放每秒图片
    const canvas_video_pic = document.querySelector('#ctx');
    // 找到主体视频画布
    const canvas_video_zhuti = document.querySelector('#zhuti');
    // 获得视频帧画笔
    const ctx = canvas_video_pic.getContext('2d');
    // 获得视频主体画笔
    const ctx_zhuti = canvas_video_zhuti.getContext('2d');
    // 页面一打开时 就将图片渲染到canvas_video_zhuti上
    const fengmian = new Image();
    fengmian.src = '../data/images/huge/11.png';
    console.log(fengmian);
    fengmian.onload = function () {
        ctx_zhuti.drawImage(fengmian, 0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
    }
    // 找到video标签 video这里用来显示画中画内容
    const v = document.getElementById('videos');
    // 找到画中画遮罩层
    const zhezhaoceng = document.querySelector('.zhezhaoceng');
    // 视频每秒图像 鼠标移入video_progress_main 显示对应位置的图片
    $('.video_progress').on('mousemove', function (e) {
        $('.video_spot').css('display', 'block');
        $('.chengyihao').css('display', 'block');
        $('.beishu').css('display', 'block');
        e = e || window.event;
        // console.log(e);
        // console.log(e.offsetX);
        // 百分比来计算当前移入的秒
        let percent = e.offsetX / 650;
        // 获取存储在隐藏域的 视频总时长
        // console.log($('#yincangyu').val());
        const duration = $('#yincangyu').val();
        let shubiao_yiru = Math.round(duration * percent);
        // console.log(shubiao_yiru); //17
        var imgData = [];
        for (var i = 1; i <= Math.floor(duration); i++) {
            imgData.push(`${i}.png`)
            // console.log(imgData);
            // 移入的shubiao_yiru和i都在1-duration之间 如果相等取数组最后一个元素 跳出循环
            if (i == Math.floor(duration)) {
                // console.log(shubiao_yiru);
                // 这时能拿到完整的数组
                // 创建img
                let img = new Image();
                // console.log(imgData[shubiao_yiru-1]);
<<<<<<< HEAD
                img.src = `./data/images/huge` + imgData[shubiao_yiru];
=======
                img.src = `./data/images/huge/` + imgData[shubiao_yiru];
>>>>>>> 564c397 (完成天知道天气查询 带有高德免费的天气api和自己写的中文城市名转adcode接口（便于天气api参数city接收参数值adcode）)
                img.onload = function () {
                    ctx.drawImage(img, 0, 0, canvas_video_pic.width, canvas_video_pic.height)
                }
                break;
            }
        }

        // 放置视频图片的canvas_video_pic和时间的div显示和隐藏
        // 鼠标移入时间
        let time_yiru = transTime(shubiao_yiru);
        // console.log(time_yiru);
        // 视频图片 时间显示
        $('.video_pic').css({
            'display': 'block',
            'backgroundColor': 'skyblue',
            'left': e.offsetX - 50,
            'top': -50
        }).next().css({
            'display': 'block',
            'backgroundColor': 'yellow',
            'left': e.offsetX - 50,
            'top': -10,
        }).text(time_yiru);
        // 图片时间 移出时 隐藏
        $(this).on('mouseleave', function (e) {
            $('.video_spot').css('display', 'none');
            $('.chengyihao').css('display', 'none');
            $('.beishu').css('display', 'none');
            $('.video_pic').css({
                'display': 'none',
            }).next().css('display', 'none');
        })

    }).on('mouseenter', function () {

        // 快进时 鼠标先得移入video_progress 此条件上 鼠标点击 事件嵌套
        $(this).on('click', function (e) {
            // 获取此时鼠标处对应的时间
            let value = $('.time_yiru').text();
            // 逆向转为时间为秒
            let time = niXiangTime(value);
            // 设置到当前播放
            v.currentTime = time;
            const percent = time / niXiangTime($('.end_spa').text());
            const video_bar_width = $('.video_progress').width() * percent;
            // 设置video_bar的宽度
            $('.video_bar').css('width', video_bar_width);
        })
    })

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

    // 解决获取视频时长duration NAN问题
    const timeid = setInterval(function () {
        if (v.readyState == 4) {
            // console.log(v.duration);
            // 将duration存入yingcangyu待用
            $('#yincangyu').val(v.duration);
            const duration = transTime(v.duration);
            $('.end_span').text(duration);
            clearInterval(timeid);
        }
    }, 100);

    // 视频暂停或播放切换
    var timeID;
    // 页面一打开的定时器id
    let timeId_yemiandakai;
    $('.video_spot').css('display', 'none');
    $('.video_state').on('click', function () {
        // 三元运算视频播放暂停
        // v.paused ? v.play() : v.pause();
        if (v.paused) {
            // 视频播放
            v.play();
            // $('.video_state1').css('display', 'block').prev().css('display', 'none');
            $(this).removeClass('icon-zanting').addClass('icon-zanting1');
            // console.log(v.currentTime);
            timeID = setInterval(function () {
                // console.log(1);
                // 设置视频播放到的时间显示
                $('.start_time').text(transTime(v.currentTime));

                let percent = v.currentTime / $('#yincangyu').val();
                // console.log(percent);
                let video_bar_width = $('.video_progress').width() * percent;
                // console.log(video_bar_width);
                $('.video_bar').css({
                    'width': video_bar_width
                });
                // video_bar_width也作为video_spot定位的left
                $('.video_spot').css({
                    'left': video_bar_width,
                    'display': 'block'
                });
                $('.chengyihao').css({
                    'left': video_bar_width + 15,
                    'display': 'block'
                });
                // 获取选择的播放倍速
                if ($('#zuojiantou').siblings().children('span:nth-child(2)').hasClass('icon-dagou')) {
                    // var bs = $(this).prev().text();

                }
                $('#zuojiantou').siblings().each(function (i, el) {
                    if ($(el).children('span:nth-child(2)').hasClass('icon-dagou')) {
                        var bs = $(el).children('span:nth-child(1)').text();
                        if (bs == '正常') {
                            $('.beishu').text(1);
                        } else {
                            $('.beishu').text(bs);
                        }

                    }
                })

                $('.beishu').css({
                    'left': video_bar_width + 35,
                    'display': 'block'
                })

                // $('#yincangyu').val()是duration 不等于视频结束时的v.currentTime
                // console.log($('#yincangyu').val(),v.currentTime); //60.112993 60.113469
                if (Math.ceil(v.currentTime) == Math.ceil($('#yincangyu').val())) {
                    //视频播放完也要清除定时器 隐藏奔跑的人
                    $('.video_spot').css('display', 'none');
                    $('.chengyihao').css('display', 'none');
                    $('.beishu').css('display', 'none');
                    // 视频播放完时播放按钮隐藏 暂停按钮显示 视频回到起始位置
                    $('.video_state1').css('display', 'none').prev().css('display', 'block');
                    $('.video_bar').css('width', '0');
                    // console.log(2);
                    $('.video_spot').css('display', 'none');
                    $('.start_time').text('');
                    $('.video_state').removeClass('icon-zanting1').addClass('icon-zanting');
                    clearInterval(timeID);
                }
            }, 1000);

            // 
        } else {
            // 视频暂停
            v.pause();
            // $('.video_state').css('display', 'block').next().css('display', 'none');
            // console.log(v.currentTime);
            $(this).removeClass('icon-zanting1').addClass('icon-zanting');
            // 视频暂停时清除定时器
            clearInterval(timeID);
            console.log(timeId_yemiandakai);
            clearInterval(timeId_yemiandakai);

            // 视频暂停时 停止弹幕动画 同时清除获取localStorage内容为弹幕的定时器
            // $('.videos').children('i').stop();

        }

        // 鼠标点击渲染视频到zhuti画布
        function render() {
            if ($('#videos').css('display') == 'none') {
                ctx_zhuti.drawImage(v, 0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
            }
            const animationID1 = requestAnimationFrame(render);
            if (v.ended) {
                cancelAnimationFrame(animationID);
                cancelAnimationFrame(animationID1);
                console.log(`render函数停止了`);
            }

        }
        var animationID = requestAnimationFrame(render);

    })
    // 音量调节代码开始
    // console.log(v.volume); //1
    let oldVolume;
    let oldHeight;
    $('.video_volume').on('mouseenter', function () {
        // console.log(1);
        $('.box').stop().slideToggle();
    }).on('mouseleave', function () {
        $('.box').stop().slideToggle();
    }).on('click', function () {
        if ($(this).hasClass('icon-shengyin')) {
            $(this).removeClass('icon-shengyin').addClass('icon-shengyinjingyin');
        } else {
            $(this).removeClass('icon-shengyinjingyin').addClass('icon-shengyin')
        };

        if ($(this).hasClass('icon-shengyinjingyin')) {
            // 静音前用变量来保存元素之前的height和volume的大小
            oldHeight = $('.video_bar_volum').height();
            oldVolume = v.volume;
            $('.video_bar_volum').height(0);
            v.volume = 0;
        } else {
            $('.video_bar_volum').height(oldHeight);
            v.volume = oldVolume;
        }
    })

    $('.box').on('mouseenter', function () {
        $('.video_spot_volum').fadeIn(400);
    }).on('mouseleave', function () {
        $('.video_spot_volum').fadeOut(400);
    });

    // 点击子元素video_bar_volum时
    $('.video_bar_volum').on('click', function (e) {
        // e.preventDefault();
        e = e || window.event;
        console.log(`e.offsetY==${e.offsetY}`);
        // console.log(e.offsetY);
        // console.log($(this).height());
        // let percent = 1-(e.offsetY/$('.video_progress_volum').height());
        // console.log(percent);

        // 动态高度给到video_bar_volum
        let video_bar_volum_height = $(this).height() - e.offsetY;
        console.log(`height==${video_bar_volum_height}`);
        $(this).css('height', video_bar_volum_height);
        let percent = video_bar_volum_height / $('.video_progress_volum').height();
        v.volume = percent;
        // 给到小黄圆点定位的top
        let top = $(this).parent().height() - video_bar_volum_height;
        $('.video_spot_volum').css('top', top);
        if (video_bar_volum_height == 0) {
            v.volume = 0;
            $('.video_volume').removeClass('icon-shengyin').addClass('icon-shengyinjingyin');
        }
        // 阻止点击video_bar_volum 父元素点击事件触发
        console.log(2);
        return false;
    })

    // 点击父元素 video_progress_volum时
    $('.video_progress_volum').on('click', function (e) {
        console.log(1);
        e = e || window.event;
        let percent = 1 - e.offsetY / $(this).height();
        let video_bar_volum_height = $(this).height() * percent;
        $('.video_bar_volum').css('height', video_bar_volum_height);
        v.volume = percent;
        // 给小黄点加上动态的top
        let top = $(this).height() - video_bar_volum_height;
        $('.video_spot_volum').css('top', top);
        // 阻止父元素video_volume同名点击事件发生
        return false;
    })
    /* 音量调节结束 */

    /* ul#gengduo部分开始 */
    $('#gengduo').children('li').on('mouseenter', function (e) {
        $(this).css('backgroundColor', '#e0e0e0').siblings('li').css('backgroundColor', 'white');
    })

    // launchFullscreen
    // 全屏 
    $('#quanpin').on('click', function () {
        // console.log('quanpin');
        // bymyself.js中的全屏方法
        launchFullscreen(canvas_video_zhuti);
    }).next().on('click', function () {
        // 下载
        // console.log('xiazai');
        console.log(v.currentSrc);
        let v_src = v.currentSrc;
        // 正则对象中\表示后面的一个不转义 就是那个意思
        // console.log(v_src.match(/\/(\w*|[\u4e00-\u9fa5]*|(\w*[\u4e00-\u9fa5]*))\.mp4/));
        // 找到a
        const aLink = $('.aLink')[0];
        // match 配合正则获取v的src视频的全称
        const v_name = v_src.match(/(\w*|[\u4e00-\u9fa5]*|(\w*[\u4e00-\u9fa5]*))\.mp4/)[0]
        //    console.dir(aLink);
        // 文件命名
        aLink.download = v_name;
        aLink.href = v_src;
    })

    // 三个点点击后显示ul#gengduo
    var oldColor;
    $('.gengduo').on('mouseenter', function () {
        oldColor = $(this).css('color');
        $(this).css('color', 'white');
    }).on('mouseleave', function () {
        // console.log(oldColor);
        $(this).css('color', oldColor);
    }).on('click', function () {
        // 得判断根据#gengduo的display属性 如果隐藏了点击后让它显示 如果显示让它隐藏
        if ($('#gengduo').css('display') == 'none') {
            $('#gengduo').css({
                'display': 'block',
                'right': '0px',
                'bottom': '145px'
            })
        } else {
            $('#gengduo').css({
                'display': 'none'
            })
        }
    })

    // 点击li.bofangsudu ul#sudu显示
    $('.bofangsudu').on('click', function () {
        console.log('bofangsudu');
        $('#sudu').css({
            'display': 'block',
            'right': '0px',
            'bottom': '145px'
        })
        // ul.gengduo隐藏
        $('#gengduo').hide();
        // 在点击播放速度条件上 点击三个点
        $('.gengduo').on('click', function () {
            $('#sudu').hide();
        })
    })


    $('#zuojiantou').on('click', function () {
        $('#sudu').hide();
    })
    /* ul#gengduo部分结束 */

    /* 设置速度部分开始 */
    $('#sudu').children('li').on('mouseenter', function (e) {
        $(this).css('backgroundColor', '#e0e0e0').siblings('li').css('backgroundColor', 'white');
    }).css('position', 'relative').on('click', function () {
        if ($(this).children('span:nth-child(2)').text() == '选项') {
            $('#sudu').hide();
        } else {
            if ($(this).children('span:nth-child(1)').text() == '正常') {
                v.playbackRate = 1;
            } else {
                v.playbackRate = Number($(this).children('span:nth-child(1)').text());
            }
            $(this).children('span:nth-child(2)').addClass('icon-dagou').parent().siblings('li').children('span:nth-child(2)').removeClass('icon-dagou');

        }
    }).children('span.marginLeft1').css({
        'position': 'absolute',
        'left': '30px',
        'top': '13px',
        'fontSize': '15px',
        'fontFamily': '宋体'
    }).next().css({
        'position': 'absolute',
        'left': '90px',
        'top': '13px',
        'fontSize': '15px',
        'fontFamily': '宋体'
    })
    $('#sudu').children('li:nth-child(1)').children('span:nth-child(1)').css({
        'position': 'absolute',
        'left': '5px',
        'top': '15px',
        'fontSize': '15px',
        'fontFamily': '宋体'
    })
    /* 设置速度部分结束 */

    /* 设置清晰度部分开始 */
    $('#qingxidu').children('li').on('mouseenter', function () {
        $(this).css('backgroundColor', '#e0e0e0').siblings('li').css('backgroundColor', 'white');
        // 选中哪个就打勾
    }).on('click', function () {
        $(this).children('span:nth-child(3)').toggleClass('icon-dagou').parent().siblings().children('span:nth-child(3)').removeClass('icon-dagou');
    })

    // 点击li.qingxidu ul#qingxidu显示
    $('.qingxidu').on('click', function () {
        console.log('qingxidu');
        $('#qingxidu').css({
            'display': 'block',
            'right': '0px',
            'bottom': '145px'
        })
        // ul#gengduo隐藏
        $('#gengduo').hide();
        // 在点击q清晰度条件上 点击三个点
        $('.gengduo').on('click', function () {
            $('#qingxidu').hide();
        })
    })

    // 选择复古风 利用画笔的属性globalCompositeOperation = '' 大概作用是将每渲染一张图片上去 后一张图片和前一张覆盖后的结果
    $('.fugufeng').on('click', function () {
        var that = this;
        ctx_zhuti.clearRect(0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
        // console.log('fugufeng');
        function render() {
            ctx_zhuti.drawImage(v, 0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
            let imgData_zhuti = ctx_zhuti.getImageData(0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
            // 得判断当前元素的第三个span有没有icon-dagou这个类 有的话 就选择复古风
            if ($(that).children('span:nth-child(3)').hasClass('icon-dagou')) {
                // imgData_zhuti.data中每四个元素 r g b a代表一个像素 第四个表示透明度 
                // 将每四个中的前三个求平均值再给到每组中的前三个 就能拿到复古风图片
                for (let i = 0; i < imgData_zhuti.data.length; i += 4) {
                    let avg = (imgData_zhuti.data[i] + imgData_zhuti.data[i + 1] + imgData_zhuti.data[i + 2]) / 3;
                    imgData_zhuti.data[i] = avg;
                    imgData_zhuti.data[i + 1] = avg;
                    imgData_zhuti.data[i + 2] = avg;
                    imgData_zhuti.data[i + 3] = 255;
                }
                // 修改的的数据重新渲染
            }
            ctx_zhuti.putImageData(imgData_zhuti, 0, 0)
            let timeID1 = requestAnimationFrame(render);
            if (v.ended) {
                cancelAnimationFrame(timeID);
                cancelAnimationFrame(timeID1);
            }
        }
        const timeID = requestAnimationFrame(render)
    })

    //选择反向风
    $('.fanxiang').on('click', function () {
        ctx_zhuti.clearRect(0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
        var that = this;
        // console.log('fugufeng');
        function render() {
            ctx_zhuti.drawImage(v, 0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
            let imgData_zhuti = ctx_zhuti.getImageData(0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);

            console.log($(that).children('span:nth-child(3)').hasClass('icon-dagou'));
            if ($(that).children('span:nth-child(3)').hasClass('icon-dagou')) {
                // imgData_zhuti.data中每四个元素 r g b a代表一个像素 第四个表示透明度 
                // 将每四个中的前三个取反再给到每组中的前三个 就能拿到反向图片
                for (let i = 0; i < imgData_zhuti.data.length; i += 4) {
                    imgData_zhuti.data[i] = 255 - imgData_zhuti.data[i];
                    imgData_zhuti.data[i + 1] = 255 - imgData_zhuti.data[i + 1];
                    imgData_zhuti.data[i + 2] = 255 - imgData_zhuti.data[i + 1];
                    imgData_zhuti.data[i + 3] = 255;
                }
                // 修改的的数据重新渲染
            }
            ctx_zhuti.putImageData(imgData_zhuti, 0, 0)
            let timeID1 = requestAnimationFrame(render);
            if (v.ended) {
                cancelAnimationFrame(timeID);
                cancelAnimationFrame(timeID1);
            }
        }
        const timeID = requestAnimationFrame(render)
    })


    /* 设置清晰度部分结束 */

    /* 画中画部分开始 */
    /* huozhonghua拖动 */
    v.onmousedown = function (e) {
        let rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        v.onmousemove = function (e) {
            let a = e.pageX - x + 'px';
            let b = e.pageY - y + 'px';
            this.style.left = a;
            this.style.top = b;

            // 给遮罩层动态left top
            zhezhaoceng.style.left = a;
            zhezhaoceng.style.top = b;

            // 拖动时提高层级
            v.style.zIndex = 1000;
        }
    }
    v.onmouseup = function () {
        v.onmousemove = null;
    };

    $('#videos').on('mouseenter', function () {
        let rect = v.getBoundingClientRect();
        let x = rect.left;
        let y = rect.top;
        // 把v距离client的left和top给到zhezhaoceng
        $('.zhezhaoceng').show().css({
            'zIndex': 1001,
            'left': x,
            'top': y
        }).on('mousemove', function () {
            $(this).show().css('zIndex', 1001);
        });
        const timeID = setTimeout(function () {
            $('.zhezhaoceng').hide();
            clearTimeout(timeID);
        }, 2000)
    })

    zhezhaoceng.onmousedown = function (e) {
        let rect = this.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        zhezhaoceng.onmousemove = function (e) {
            let a = e.pageX - x + 'px';
            let b = e.pageY - y + 'px';
            this.style.left = a;
            this.style.top = b;

            // 给遮罩层动态left top
            v.style.left = a;
            v.style.top = b;

            // 拖动时提高层级
            v.style.zIndex = 1000;
        }
    }
    zhezhaoceng.onmouseup = function () {
        const timeID = setTimeout(() => {
            zhezhaoceng.style.display = 'none';
            clearTimeout(timeID);
        }, 2000);
        zhezhaoceng.onmousemove = null;
    };

    // 点击huazhonghua中右三角播放视频
    $('#ysj').on('click', function () {
        console.log('ysj');
        // v.paused ? v.play():v.pause();
        $('.video_state').trigger('click')
    })

    // 点击li.hzh
    var animationID;
    var tID;
    $('.hzh').on('click', function () {
        // console.log('hzh');
        // console.log($('#videos').css('display'));
        if ($('#videos').css('display') == 'none') {
            $('#videos').css({
                'display': 'block',
            });
            ctx_zhuti.clearRect(0, 0, 800, 450);
            ctx_zhuti.fillRect(0, 0, 800, 450);
            ctx_zhuti.font = '30px 宋体';
            ctx_zhuti.fillStyle = 'white';
            ctx_zhuti.fillText(`以"画中画"模式播放`, 80, 50);
            $('.shzh').text(`退出“画中画”模式`);
        } else {
            $('#videos').css('display', 'none');
            $('.shzh').text(`画中画`);
            // 退出画中画 重新渲染视频到画布中 
            function render() {
                if ($('#videos').css('display') == 'none') {
                    ctx_zhuti.drawImage(v, 0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
                    $('.zhezhaoceng').css('display', 'none');
                } else {
                    // ctx_zhuti.clearRect(0, 0, 800, 450);
                    ctx_zhuti.fillStyle = 'black';
                    ctx_zhuti.fillRect(0, 0, 800, 450);
                    ctx_zhuti.font = '30px 宋体';
                    ctx_zhuti.fillStyle = 'white';
                    ctx_zhuti.fillText(`以"画中画"模式播放`, 80, 50);
                }


                tID = setInterval(function () {
                    render();
                }, 1 / 12);
                if (v.ended) {
                    clearInterval(tID);
                    cancelAnimationFrame(animationID);
                    console.log(`render函数停止了`);
                    return
                }

            }
            animationID = requestAnimationFrame(render)
        }
        // #gengduo隐藏
        $('#gengduo').hide();
    })

    // 点击div.fh zhezhaoceng和video隐藏 借用.hzh的点击事件的逻辑 触发器
    $('.fh').on('click', function () {
        $('.zhezhaoceng').hide();
        $('.hzh').trigger('click');
    })
    $('#cha').on('click', function () {
        $('.zhezhaoceng').hide();
        $('.hzh').trigger('click');
    })
    /* 画中画部分结束 */

    // 鼠标移入时给画布样式
    //iconFont方法返回ctx.fillText()可以绘制的字体图标文本 三个参数：ctxWhat:哪个画布  unicode :字体图标的编码  fontsize:字体大小  
    function iconFont(ctxWhat, Unicode, fontsize) {
        ctxWhat.beginPath();
        ctxWhat.font = `${fontsize} iconfont`;
        // 将使用的图标的Unicode放在以下方式进行转义，便可以使用
        //后台返回的字段进行了转义，需要进行反转义
        if (Unicode.indexOf('&amp;') !== -1) {
            Unicode = Unicode.replace('&amp;', '&')
        }
        var icon = eval('("' + `${Unicode}`.replace('&#x', '\\u').replace(';', '') + '")')
        return icon;
    }

    /* 画中画部分结束 */

    /* 弹幕部分开始 */
    // 弹幕封装函数danmu:传入内容
    function danmu(txt) {
        /*   {
              neiRong : txt; //弹幕内容
              danmu_top : $('div.fu').height()-$('<i></i>').height() ; //弹幕随机出现在父盒子的高度
              right_start : -$('<i></i>').width(); //弹幕从右边出发的位置
              width : $('<i></i>').width() ; //弹幕的宽度
              height : $('<i></i>').height(); //弹幕的高度
              fontSize : //字体大小
              right_end : $('div.fu').width() //弹幕结束的位置
              time : //弹幕运动时间
              fangshi : //弹幕运动方式
              div_fu :  //相对定位的  父元素
          } */
        // 去除空格
        txt = $.trim(txt);
        // 动态生成弹幕颜色
        let r = Math.floor(Math.random() * 256);
        let g = Math.floor(Math.random() * 256);
        let b = Math.floor(Math.random() * 256);
        let rgb = `rgb(${r},${g},${b})`;

        // 动态生成i的绝对定位top
        let top = Math.ceil(Math.random() * 400);
        // 动态创建i标签
        $('<i></i>').text(txt).css({
            'position': 'absolute',
            'right': '-200px',
            'top': top,
            'width': '200px',
            'height': '30px',
            'fontSize': '20px',
            'color': rgb,
            'fontFamily': '宋体'
        }).animate({ 'right': 800 }, 20000
            , 'linear', function () {
                $(this).remove();
            }).appendTo('.videos')
    }
    // 弹幕内容
    let danMuTxt = '';
    // 记录点击的次数
    let count_djdm = 0;
    let timeId_locstor;
    $('#fashe').on('click', function () {
        let txt = $('#dandao').val();
        // console.log(txt);
        if (!txt) {
            return console.log('没有填装弹幕');
        }
        danmu(txt);
        // 将每次填入弹幕存储到localStorage
        count_djdm++;
        localStorage.setItem('danMuTxt', txt);
        if (count_djdm == 1) {
            danMuTxt = danMuTxt + localStorage.getItem('danMuTxt')
            // console.log(danMuTxt);
            localStorage.setItem('danMuTxt', danMuTxt);
        } else {
            danMuTxt = danMuTxt + ',' + localStorage.getItem('danMuTxt')
            // console.log(danMuTxt);
            localStorage.setItem('danMuTxt', danMuTxt);
        }
        // 发射后 保存后 清空弹道内容
        $('#dandao').val('');

        // 拿到存入浏览器的数据
        danMuTxt = localStorage.getItem('danMuTxt');
        console.log(danMuTxt);
        let danmuArr = danMuTxt.split(',');
        console.log(danmuArr);
        for (let i = 0; i < danmuArr.length; i++) {
            timeId_locstor = setInterval(function () {
                danmu(danmuArr[i]);
            }, 20000)
        }
    })


    // 按回车触发发射弹幕
    document.documentElement.onkeydown = function (e) {
        //  console.log(e.keyCode);
        if (e.keyCode == 13) {
            $('#fashe').trigger('click');
            $('#dandao').val('');
        }
    }

    // let timeId_yemiandakai;
    // 页面一打开就获取存储在localStorage的弹幕
    let oldDanMuStr = localStorage.getItem('danMuTxt');
    let oldDanMuArr = oldDanMuStr.split(',');
    console.log(oldDanMuArr);
    for (let i = 0; i < oldDanMuArr.length; i++) {
        danmu(oldDanMuArr[i])
        timeId_yemiandakai = setInterval(function () {
            danmu(oldDanMuArr[i])
        }, 5000)
    }

    /*   $('.video_state').on('click', function () {
          if ($('.video_state').hasClass('icon-zanting')) {
              clearInterval(timeId_yemiandakai);
          }
      }) */

    // 开关闭弹幕
    var danMu_timeId;
    $('#danmu').on('click', function () {
        // console.log(danMu_timeId);
        clearInterval(danMu_timeId);
        if ($(this).hasClass('icon-bofangqi-danmukai')) {
            // 关闭弹幕
            // 切换弹幕开关 为关闭
            $(this).removeClass('icon-bofangqi-danmukai').addClass('icon-bofangqi-danmuguan')
            danMu_timeId = setInterval(function () {
                // 弹幕标签i自杀
                $('.videos').children('i').remove();
                // console.log(danMu_timeId);
            }, 1 / 12)
        } else {
            // 打开弹幕
            $(this).addClass('icon-bofangqi-danmukai').removeClass('icon-bofangqi-danmuguan');
            console.log(danMu_timeId);
            clearInterval(danMu_timeId);
            console.log(danMu_timeId);
            for (let i = 0; i < oldDanMuArr.length; i++) {
                danmu(oldDanMuArr[i])
            }
        }
    })


    /* 弹幕部分结束 */


    /* 线路选择部分开始 */
    $('#xianlu').on('click', function () {
        if ($('#bendi').css('display') == 'none') {
            $('#bendi').css('display', 'block');
        } else {
            $('#bendi').css('display', 'none');
        }
        if ($('#wangluo').css('display') == 'none') {
            $('#wangluo').css('display', 'block');
        } else {
            $('#wangluo').css('display', 'none');
        }
    })
    $('#file').on('change', function () {
        // console.dir(this);
        let file = this.files[0];
        console.log(this.files);
        let url = URL.createObjectURL(file);
        // console.log(url);
        // 把地址存到本地
        localStorage.setItem('videoUrl',url);
        // console.log(localStorage.getItem('videoUrl') == url);
        //获得的blob视频地址给到video
        $('#videos').attr('src', url);
        /*   if(v.paused) {
              v.play();
              $('.video_state').addClass('icon-zanting1').removeClass('icon-zanting')
              function render() {
              if ($('#videos').css('display') == 'none') {
                  ctx_zhuti.drawImage(v, 0, 0, canvas_video_zhuti.width, canvas_video_zhuti.height);
              }
              const animationID1 = requestAnimationFrame(render);
              if (v.ended) {
                  cancelAnimationFrame(animationID);
                  cancelAnimationFrame(animationID1);
                  console.log(`render函数停止了`);
              }

          }
          var animationID = requestAnimationFrame(render);
          } */

        // 触发器 点击本地按钮借用播放按钮的逻辑
        $('.video_state').trigger('click')
    })
    /* 线路选择部分结束 */

    /* 快进快退显示开始 */
    // 点击div.video_progress 快进
    $('.video_progress').on('click', function (e) {
        let left = e.offsetX;
        console.log(left);
        if (left < 31) {
            left = 31
        } else if (540 >= left >= 31) {
            left = e.offsetX + 3
        } else if (left > 540) {
            left = 540
        }
        $('.jtInfo').css({
            'display': 'block',
            'left': left
        });
        e = e || window.event;
        let rect = this.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let percent = x / ($(this).width());
        const duration = Number($('#yincangyu').val());
        // let time = transTime(duration*percent);
        // console.log(time);
        let time = duration * percent;
        let currentTime = v.currentTime;
        // console.log(currentTime);
        let jinTime = time - currentTime;
        // console.log(parseInt('003'));
        let jinTime_format = transTime(jinTime);
        // console.log(jinTime_format);
        let timeArr = jinTime_format.split(':');
        let h, m, s, resTime;
        switch (timeArr.length) {
            case 3: {
                h = parseInt(timeArr[0]);
                m = parseInt(timeArr[1]);
                s = parseInt(timeArr[2]);
                resTime = `${h}h${m}m${s}s`;
                break;
            };
            case 2: {
                m = parseInt(timeArr[0]);
                s = parseInt(timeArr[1]);
                if (m == 0) {
                    resTime = `${s}s`;
                } else {
                    resTime = `${m}m${s}s`;
                }
            }
        }
        //    console.log(resTime);

        $('.jt').text(`快进${resTime}`);
        $('.kjt').removeClass('icon-zuojiantou1').addClass('icon-youjiantou');
        // return false;
        let timeID = setTimeout(function () {
            $('.jtInfo').css('display', 'none');
            clearTimeout(timeID);
        }, 1100);
    })
    // 鼠标点击div.video_bar 快退
    // 利用第二种思路 鼠标点击div.video_bar必然要先移入 移入后有悬浮时间
    // 从悬浮时间div.time_yiru 获取点击的时间
    $('.video_bar').on('click', function (e) {
        let x = e.offsetX;
        console.log(x);
        if (x < 31) {
            x = 31
        } else if (540 >= x >= 31) {
            x = e.offsetX + 3
        } else if (x > 540) {
            x = 540
        }
        $('.jtInfo').css({
            'display': 'block',
            'left': x
        });
        let percent = e.offsetX / ($('.video_progress').width());
        let duration = Number($('#yincangyu').val());
        let time = v.currentTime - duration * percent;
        // console.log(time);
        let tuiTime_format = transTime(time);
        console.log(tuiTime_format);
        let timeArr = tuiTime_format.split(':');
        let h, m, s, resTime;
        switch (timeArr.length) {
            case 3: {
                h = parseInt(timeArr[0]);
                m = parseInt(timeArr[1]);
                s = parseInt(timeArr[2]);
                resTime = `${h}h${m}m${s}s`;
                break;
            };
            case 2: {
                m = parseInt(timeArr[0]);
                s = parseInt(timeArr[1]);
                if (m == 0) {
                    resTime = `${s}s`;
                } else {
                    resTime = `${m}m${s}s`;
                }
            }
        }
        //    console.log(resTime);

        $('.jt').text(`快退${resTime}`);
        $(this).css({
            'width': e.offsetX
        })
        v.currentTime = duration * percent;

        // span.kjt 添加左箭头类 去除.icon-youjiantou
        $('.kjt').removeClass('icon-youjiantou').addClass('icon-zuojiantou1');
        let timeID = setTimeout(function () {
            $('.jtInfo').css('display', 'none');
            clearTimeout(timeID);
        }, 1100);

        // 阻止点击video_bar时 触发父元素video_progress的点击事件
        return false;
    })

    /* 快进快退显示结束 */

    /* 记录视频播放位置页面打开或刷新时从记录位置播放开始 */
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
    v.ontimeupdate = throttle(() => {
        console.log(v.currentTime);
        localStorage.setItem('currentTime',v.currentTime)
    }, 1000,1000);
    
    // 页面一打开或刷新就触发 先拿到videoUrl 再拿到currentTime 把拿到视频播放时间设置到currentTime
    v.onloadeddata = function() {
        this.currentTime = localStorage.getItem('currentTime') || 0;
        console.log(111);
    }

    /* 记录视频播放位置页面打开或刷新时从记录位置播放结束 */
    console.log(+new Date());
})

