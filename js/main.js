let swiper = null;
let xperiaTimer = null;
let phoneLightInterval = null;
let phonePlayInterval = null;
let productPage = [
  'camera1', 'earphone1', 'bluetooth1',
  'camera2', 'earphone2', 'bluetooth2',
];
// 资源加载
let assetsArr = [];
$('.preload').each(function () {
  assetsArr.push($(this).attr('src'));
});

$.preload({
  arr: assetsArr,
  onLoading: function (loadper) {
    var perc = Math.ceil(loadper * 100);
    $('.percent').html(perc);
  },
  onLoaded: function () {
    $('.preload').each(function (index, element) {
      var imgpath = $(this).data('src');
      $(this).attr('src', imgpath);
    });
    setTimeout(function () {
      $('#loadingbg').fadeOut();
      // 入口ID
      startSwiper('page1');
    }, 0);
  }
});


/**
 * 播放gif
 */
function playXperia(t) {
  $('img#xperia').show();
  // 动画播放完成就切换走
  xperiaTimer = setTimeout(function () {
    startSwiper('prod');
  }, 2000);
}

/**
 * 展示页面
 * @param from
 * @param to
 */
function startSwiper(to, index) {
  clearTimeout(xperiaTimer);
  swiper && swiper.destroy(false);
  const toEl = $(`#${to}`);

  // 清空当前效果
  toEl.removeClass('moveOut');
  toEl.removeClass('animated');
  toEl.removeClass('index-up');

  setTimeout(function () {
    toEl.siblings().addClass('moveOut');
  }, 0);
  setTimeout(function () {
    toEl.addClass('index-up').siblings().removeClass('index-up');
  }, 10);

  setTimeout(function () {
    swiper = new Swiper(`.swiper-${to}`, {
      // 一定要配置 class="swiper-container" 的宽高，找个报错气死你
      direction: 'vertical',
      noSwiping: true,
      allowSlidePrev: false,
      on: {
        init: function () {
          //隐藏动画元素
          swiperAnimateCache(this);
          console.log(this);
          //初始化完成开始动画
          swiperAnimate(this);

          phoneLightInterval && clearInterval(phoneLightInterval);
          if (to.indexOf('product') > -1) {
            setTimeout(function () {
              phoneLightInterval = setInterval(function () {
                if ($('.phone-light-c', `#${to}`).is(':visible')) {
                  $('.phone-light-c', `#${to}`).fadeOut(600);
                } else {
                  $('.phone-light-c', `#${to}`).fadeIn(600);
                }
              }, 1200);
            }, 2500);
          }

          // 圣诞页，延缓雪花出现的时间
          $('.christmastree-snow1').fadeOut();
          $('.christmastree-snow2').fadeOut();
        },
        slideChangeTransitionEnd: function () {
          //每个slide切换结束时也运行当前slide动画
          console.log('to => ', to, 'active index => ', this.activeIndex);
          if (this.activeIndex === 1 && to === 'page1') {
            // 播放gif
            playXperia(this);
          } else {
            xperiaTimer && clearTimeout(xperiaTimer);
          }
          // 圣诞页，延缓雪花出现的时间
          if (productPage.includes(to) && this.activeIndex === 2) {
            setTimeout(function () {
              $('.christmastree-snow1').fadeIn(1000);
              $('.christmastree-snow2').fadeIn(1000);
            }, 2000);
          }
          swiperAnimate(this);
        }
      }
    });
  }, 100);
  // 除了page1 都自动向下翻1页
  if (to !== 'page1' || index) {
    setTimeout(function () {
      swiper.slideTo(index ? index : 1);
    }, 200);
  }
}

$('.to-product', '#prod').bind('click', function () {
  const productNo = $(this).data('product-no');
  startSwiper(`product${productNo}`);
  // 显示彩色界面
  $('.tip', `#product${productNo}`).show();
  $('.page2bg1colorful', `#product${productNo}`).hide();
  $('.producttext', `#product${productNo}`).hide();
  $('.click-earphone').hide();
  $('.click-phone').hide();
  $('.click-bluetooth').hide();
  $('.click-camera').hide();

});

// 点击手机背光事件
$('.phone-light').bind('click', function () {
  const productNo = $(this).data('product-no');
  // 显示按钮
  setTimeout(function () {
    $('.click-earphone', `#product${productNo}`).show();
  }, 500);
  setTimeout(function () {
    $('.click-phone', `#product${productNo}`).show();
  }, 1500);
  setTimeout(function () {
    $('.click-bluetooth', `#product${productNo}`).show();
  }, 2000);
  setTimeout(function () {
    $('.click-camera', `#product${productNo}`).show();
  }, 2500);
  $('.tip').hide();

  setTimeout(function () {
    $('.producttext', `#product${productNo}`).fadeIn(1500).delay(1500);
  }, 2800);
  // 显示彩色界面
  $('.page2bg1colorful', `#product${productNo}`).fadeIn(1500);

});
$('.click-earphone').bind('click', function () {
  const productNo = $(this).data('product-no');
  startSwiper(`earphone${productNo}`);
});
$('.click-phone').bind('click', function () {
  const productNo = $(this).data('product-no');
  playMedia('all');
});
$('.click-bluetooth').bind('click', function () {
  const productNo = $(this).data('product-no');
  startSwiper(`bluetooth${productNo}`);
});
$('.click-camera').bind('click', function () {
  const productNo = $(this).data('product-no');
  startSwiper(`camera${productNo}`);
});


let videoType = null;

/**
 * 播放音频
 */
function playMedia(type) {
  $('.media-container').css('display', 'flex');
  $(`#video-${type}`).show();
  setTimeout(function () {
    $(`#video-${type}`).trigger('play');
  }, 300);
  videoType = type;
}

// 退出播放
$('.media-container').bind('click', function () {
  $('.media-container').css('display', 'none');
  $(`#video-${videoType}`).trigger('pause').hide();
});

// 进入下一页
$('.pull-down', '#page1').bind('click', function () {
  swiper.slideTo(1);
});

// 进入尾页
// $('.pull-down.tofinal').bind('click', function () {
//   startSwiper('final');
// });

// 商品页返回按钮
$('.naviback').bind('click', function () {
  // const backTo = $(this).data('back-to');
  startSwiper('prod');
});

// 刷新效果
$('.navirefresh').bind('click', function () {
  location.reload();
});

// 具体产品关闭
$('.naviclose').bind('click', function () {
  const closeTo = $(this).data('close-to');
  startSwiper(closeTo);
});

// 播放商品视频
$('.pull-view').bind('click', function () {
  const videoType = $(this).data('video-type');
  playMedia(videoType);
});
// 具体商品详情
$('.pull-detail').bind('click', function () {
  const productId = $(this).data('product-id');
  t_func(productId);
});
// 关闭视频
$('.video-close').bind('click', function () {
  $('.media-container').css('display', 'none');
  $(`#video-${videoType}`).trigger('pause').hide();
});

// 将圣诞页追加到各个产品页的后面
productPage.forEach(pageId => {
  const finalPage = $('.swiper-slide', '#final')[1];
  console.log(pageId, $('.swiper-wrapper', `.swiper-${pageId}`)[0], finalPage);
  $(finalPage).clone(true).appendTo($($('.swiper-wrapper', `.swiper-${pageId}`)[0]));
});

// 分享图片
let productType = '';
$('.navishare').bind('click', function () {
  // 闪烁屏幕-达到截屏效果
  $('.share-shotscreen').addClass('index-up').fadeIn().fadeOut();

  const product = $(this).data('product-type');

  window.click_fx && window.click_fx(product);

  productType = product;
  $('.share-container').addClass('index-up');
  $('.share-image').hide();

  $(`#share-${product}`).fadeIn(1000);
});

// 关闭分享图片
$('.share-close').bind('click', function () {
  $('.share-container').removeClass('index-up');
  $(`#share-${productType}`).fadeOut('slow');
});
