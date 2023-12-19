$(function () {
  let canvas = $('canvas')[0];
  // 获得画笔上下文对象
  let ctx = canvas.getContext('2d');
  // 画布兼容性检测
  if (!canvas.getContext) {
    return console.log('请升级浏览器 当前不支持canvas');
  }
  // 气泡框起始点
  ctx.moveTo(140, 125);
  ctx.quadraticCurveTo(100, 125, 100, 75);
  ctx.quadraticCurveTo(100, 25, 150, 25);
  ctx.quadraticCurveTo(200, 25, 200, 75);
  ctx.quadraticCurveTo(200, 125, 160, 125);
  ctx.quadraticCurveTo(160, 135, 150, 135);
  ctx.quadraticCurveTo(150, 135, 140, 125);
  ctx.stroke();

  // 封装方法x 请求天气数据
  function x({ city, type }) {
    //给按钮设置一个 loading 类, 为了有加载效果
    $('.input_sub').addClass('loading');
    $.ajax({
      type: 'get',
      url: 'http://121.41.100.222:5555/getWeather',
      data: {
        city,
        type
      },
      dataType: 'json',
      success: async backData => {
        if (backData.code !== 200) {
          $('.input_sub').removeClass('loading')
          $('.input_txt').val('')
          return alert(backData.msg)
        }
        backData = backData.data

        // 延迟2s渲染数据
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve()
          }, 2000);
        })
        // console.log(backData.forecasts[0].city);
        // console.log(backData.forecasts[0].casts);

        // 调用模版前将city加入到casts数组中的每个对象中
        let data = backData.forecasts[0].casts;
        let new_data = data.map((el, i, self) => {
          // 增加city
          el.city = backData.forecasts[0].city;
          // 修改el的week为大写
          switch (el.week) {
            case '1': {
              el.week = '一';
              break
            };
            case '2': {
              el.week = '二';
              break
            };
            case '3': {
              el.week = '三';
              break
            };
            case '4': {
              el.week = '四';
              break
            };
            case '5': {
              el.week = '五';
              break
            };
            case '6': {
              el.week = '六';
              break
            };
            case '7': {
              el.week = '日';
              break
            }
          };
          // 修改最高温度 daytemp
          el.daytemp = el.daytemp + '°C';
          //修改最低温度 nighttemp
          el.nighttemp = el.nighttemp + '°C';
          return el
        })
        // console.log(new_data);
        //调用模板方法
        var resHtml = template('tmp_weather', new_data);
        // console.log(resHtml);
        //替换class为weather_list的ul中的html
        $('.weather_list').html(resHtml);

        // console.log($('.info_date').children('b').text().length);
        // 城市名字大于3个 b和span改用定位显示样式 不然挤不下 一个汉字等于四个字母
        if ($('.info_date').children('b').text().length > 12) {
          $('.info_date').children('b').css({
            'position': 'absolute',
            'left': '-10px'
          }).next().css({
            'position': 'absolute',
            'right': '-10px'
          })
        }

        // 移入span.iconfont前先给气泡框第一天的天气和日期
        // console.log($('.info_type').children().attr('data-weather'));
        // 清空气泡框内容 避免文字重叠
        ctx.clearRect(110, 58, 80, 55);
        let weather = $('.info_type').children().attr('data-weather');
        let date = $('.info_type').children().attr('data-date');
        // console.log(weather,date);
        ctx.font = '15px 宋体';
        // console.log(ctx.measureText(that.dataset.weather));
        ctx.fillText(weather, 120, 105);
        ctx.fillText(date, 110, 70)

        // 结构显示后鼠标移入span.iconfont 后显示天气
        $('.iconfont').on('mouseenter', function () {
          // 天气
          console.dir(this.dataset.weather);
          // 日期
          console.log(this.dataset.date);
          // 保存正移入的span.iconfont
          let that = this;
          // 文字的宽度
          let weather_width = ctx.measureText(that.dataset.weather).width;
          let date_width = ctx.measureText(that.dataset.date).width;
          console.log(weather_width);
          console.log(date_width);
          ctx.clearRect(110, 58, 80, 55);
          // 天气dayweather 保存到span.iconft自定义属性中 方便取用
          // console.dir(this.dataset.weather);
          ctx.font = '15px 宋体';
          // console.log(ctx.measureText(that.dataset.weather));
          ctx.fillText(that.dataset.weather, 120, 105);
          ctx.fillText(that.dataset.date, 110, 70)
        })
        //页面渲染后,搜索按钮去掉loading类
        $('.input_sub').removeClass('loading');
      }
    })
  }
  // 页面一打开就获取
  x({ city: '余干县' })

  // 搜索
  $('.input_sub').on('click', function () {

    //点击按钮,让ul中的内容给清空.
    $('.weather_list').empty();

    //获取用户输入的要查询的城市名字.
    var cityName = $('.input_txt').val();
    x({ city: cityName })
  })


  //给热词的a标签设置点击事件.
  $('.hotkey a').on('click', function () {
    //获取点击的a标签的值,text
    var cityName = $(this).text();
    //把这个值填入到输出框.
    $('.input_txt').val(cityName);
    //调用搜索按钮的点击事件.-触发器
    $('.input_sub').trigger('click');
  });

  $('.input_txt').on('keyup', function (e) {
    if (e.keyCode == 13) {
      $('.input_sub').trigger('click');
    }
  })
  //页面一开始就搜索一下余干的天气 当日日期渲染上画布气泡框
  $('.hotkey a:last').trigger('click');
});
