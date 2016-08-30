'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

//
// Interceptor that adds progressbar to all requests
//

var VueResourceProgressBarInterceptor = {
  install: function install(Vue) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];


    var progress = Vue.prototype.$Progress;

    if (progress == null) {
      console.error('vue-resouce-progressbar-interceptor: vue-progress-bar is not installed. ' + 'Please install it from https://github.com/hilongjw/vue-progressbar');
      return;
    }

    var requestsTotal = 0;
    var requestsCompleted = 0;

    var latencyThreshold = options.latencyThreshold || 100;

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
          setTimeout(function () {
            progress.start();
          }, latencyThreshold);
        }
        requestsTotal++;
        completed = requestsCompleted / requestsTotal * 100;
        progress.set(completed);
      }

      next(function (response) {
        if (!showProgressBar) {
          return response;
        }

        if (!response.ok) {
          progress.fail();
          setComplete();
        }
        // Finish progress bar 50 ms later
        setTimeout(function () {
          requestsCompleted++;

          if (requestsCompleted >= requestsTotal) {
            setComplete();
          } else {
            completed = requestsCompleted / requestsTotal * 100 - 10;
            progress.set(completed);
          }
        }, latencyThreshold + 50);
        return response;
      });
    });
  }
};

if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
  module.exports = VueResourceProgressBarInterceptor;
}