// JavaScript Document
!(function ($) {
  $.preload = function (settings) {
    settings = $.extend({}, $.preload.defaults, settings);
    var preLoader = {
      init: function () {

        //this.item = $('.preload');
        settings.maxItem = settings.arr.length;
        $.each(settings.arr, function (index, value) {

          var img = new Image();
          img.onload = function () {
            preLoader.callBack();

          };
          img.onerror = function () {

            preLoader.callBack();

          };
          img.src = value;

        });
      },
      callBack: function () {

        settings.loadedItems++;

        var loadedPer = (settings.loadedItems / settings.maxItem);
        loadedPer = Math.min(loadedPer, 1);
        settings.onLoading(loadedPer);
        if (settings.loadedItems == settings.maxItem) {

          this.onReadyLoaded();
        }
      },
      onLoading: function (loadper) {

      },
      onReadyLoaded: function () {

        //settings.onLoading();
        settings.isLoaded = true;
        settings.onLoaded();

      },
      onLoaded: function () {

      }

    };

    return {
      init: preLoader.init(),
      onLoading: preLoader.onLoading(),
      onLoaded: preLoader.onLoaded


    };
  };
  $.preload.defaults = {
    arr: null,
    loadedItems: 0,
    maxItem: 0,
    isLoaded: false,
    onLoading: null,
    onLoaded: null
  };

})(jQuery);
