$(function () {
    const canvas = document.getElementById('huabu');
    if (!canvas.getContext) {
        console.log('浏览器不支持');
    }
    // 获得画笔 上下文对象
    let ctx = canvas.getContext('2d');
    // 找到视频图片画布 画笔
    let canvas_pic = document.querySelector('.pic');
    let ctx_pic = canvas_pic.getContext('2d');
    // 找到视频
    const v = document.getElementsByTagName('video')[0];

    var timeID4;
    $('.vdieo_state').on('click', function () {
        if (v.paused) {
            var timeID1, timeID2;
            // 播放
            v.play();
            // 切换暂停播放图标
            $(this).addClass('icon-zanting1').removeClass('icon-zanting');
            function render() {
                ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
                timeID2 = requestAnimationFrame(render);
                // 视频播放结束清除掉帧动画
                if (v.ended) {
                    cancelAnimationFrame(timeID1);
                    cancelAnimationFrame(timeID2);
                }
            }
            timeID1 = requestAnimationFrame(render);

            /*    timeID4 = setInterval(function() {
                   // console.log(v.currentTime);
               },1000); */

            // 视频第一次播放或重复开始播放得解决第一秒的问题
            if (!localStorage.getItem('video_history_currentTime') || localStorage.getItem('video_history_currentTime') == '60') {
                // 因为用了节流的方法 得解决第一秒的spot和progress显示问题
                const timeID5 = setTimeout(function () {
                    const percent = 1 / Math.round(v.duration);
                    const spot_left = $('.progress_main').width() * percent;
                    $('.spot').css({
                        'display': 'block',
                        'left': spot_left
                    });
                    $('.progress').css('width', spot_left);
                    $('.start_time').text('00:01');
                    clearTimeout(timeID5)
                }, 800)
            }

            // 节流
            v.ontimeupdate = throttle(() => {
                if (!v.ended) {
                    // console.log(v.currentTime);
                    $('.spot').css('display', 'block');
                    let start_time = Math.ceil(v.currentTime);
                    localStorage.setItem('video_history_currentTime', start_time);
                    console.log(start_time);
                    const zongShiChang = Math.round(v.duration);
                    let percent = start_time / zongShiChang;
                    let progress_width = $('.progress_main').width() * percent;
                    $('.progress').css('width', progress_width);
                    $('.spot').css('left', progress_width);
                    $('.start_time').text(transTime(start_time))
                } else {
                    $('.spot').css('display', 'none');
                    $('.progress').css('width', 0);
                    $('.vdieo_state').addClass('icon-zanting').removeClass('icon-zanting1');
                    $('.start_time').text('');
                    // 视频结束 清除节流方法
                    throttle = null;
                }
            }, 1000, 1000)
        } else {
            // 暂停
            v.pause();
            $(this).addClass('icon-zanting').removeClass('icon-zanting1');
        }
    })

    // 获取视频时长 解决视频NAN问题
    const timeID3 = setInterval(function () {
        if (v.readyState == 4) {
            // console.log(transTime(v.duration));
            const format_Time = transTime(v.duration);
            $('.zongShiChang').text(format_Time);
            clearInterval(timeID3);
        }
    }, 50);

    // 视频而言 页面刷新或打开触发
    v.onloadeddata = function () {
        // console.log(localStorage.getItem('video_history_currentTime'));
        let time = localStorage.getItem('video_history_currentTime') || 0;
        let left = $('.progress_main').width() * (+time / Math.round(v.duration));
        $('.spot').css({
            'display': 'block',
            'left': left
        })
        $('.progress').css('width', left);
        v.currentTime = time;
        // 拿到time时候的图片 渲染到画布canvas
        let img = new Image();
        img.src = `./data/images/huge_history/第${time}秒图片.png`;
        img.onload = function() {
            ctx.drawImage(img,0,0,canvas.width,canvas.height)
        }
    }

    /* 视频图片开始 */
    $('.progress_main').on('mouseenter', function (e) {
        e = e || window.event;
        // 鼠标移入时距离this的左边的距离
        let x = e.clientX - this.getBoundingClientRect().left;
        $('.pic_timeYiRu').css({
            'display': 'block',
            'left': x,
            'top': '-67px'
        })
        let percent = x / $(this).width();
        let time_yiRu = v.duration * percent;
        // console.log(time_yiRu);
        $('.timeYiRu').text(transTime(time_yiRu)).css({
            'textAlign': 'center',
            'lineHeight': '25px'
        });

        // 视频图片 外连js中的相对路径是相对于引入的html的不是相对于这个js文件 难怪高半天没有来
        let img = new Image();
        // 错误路径
        // img.src = `../data/images/huge_history/第${Math.round(time_yiRu)}秒图片.png`;
        img.src = `./data/images/huge_history/第${Math.round(time_yiRu)}秒图片.png`;
        img.onload = function () {
            ctx_pic.drawImage(img, 0, 0, canvas_pic.width, canvas_pic.height);
        }
    }).on('mouseleave', function () {
        $('.pic_timeYiRu').css('display', 'none')
    })
    /* 视频图片结束 */

})