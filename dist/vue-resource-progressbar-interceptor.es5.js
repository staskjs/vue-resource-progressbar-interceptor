'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//
// Interceptor that adds progressbar to all requests
//

var VueResourceProgressBarInterceptor = {
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var progress = Vue.prototype.$Progress;

    if (progress == null) {
      console.error('vue-resouce-progressbar-interceptor: vue-progress-bar is not installed. ' + 'Please install it from https://github.com/hilongjw/vue-progressbar');
      return;
    }

    var requestsTotal = 0;
    var requestsCompleted = 0;

    var latencyThreshold = options.latencyThreshold != null ? options.latencyThreshold : 100;
    var responseLatency = options.responseLatency != null ? options.responseLatency : 50;

    function setComplete() {
      requestsTotal = 0;
      requestsCompleted = 0;
      progress.finish();
    }

    Vue.http.interceptors.push(function (request, next) {

      var showProgressBar = true;
      if (request.showProgressBar != null) {
        showProgressBar = request.showProgressBar;
        delete request.showProgressBar;
      }

      var completed = void 0;

      if (showProgressBar) {
        if (requestsTotal === 0) {
          if (latencyThreshold === 0) {
            progress.start();
          } else {
            setTimeout(function () {
              // If not all requests finished during latency time, then start progressbar
              if (requestsTotal !== requestsCompleted) {
                progress.start();
              }
            }, latencyThreshold);
          }
        }
        requestsTotal++;
        if (progress.$vm.RADON_LOADING_BAR.options.show) {
          completed = requestsCompleted / requestsTotal * 100 + 1;
          progress.set(completed);
        }
      }

      next(function (response) {
        if (!showProgressBar) {
          return response;
        }

        // Finish progress bar some time later
        setTimeout(function () {
          if (!response.ok) {
            progress.fail();
            setComplete();
          }

          requestsCompleted++;

          if (requestsCompleted >= requestsTotal) {
            setComplete();
          } else {
            completed = requestsCompleted / requestsTotal * 100 - 10;
            progress.set(completed);
          }
        }, responseLatency);
        return response;
      });
    });
  }
};

if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
  module.exports = VueResourceProgressBarInterceptor;
}