//
// Interceptor that adds progressbar to all requests
//

const VueResourceProgressBarInterceptor = {
  install: (Vue, options = {}) => {

    const progress = Vue.prototype.$Progress;

    if (progress == null) {
      console.error('vue-resouce-progressbar-interceptor: vue-progress-bar is not installed. ' +
        'Please install it from https://github.com/hilongjw/vue-progressbar');
      return;
    }

    let requestsTotal = 0;
    let requestsCompleted = 0;

    const latencyThreshold = options.latencyThreshold || 100;
    const responseLatency = options.responseLatency || 50;

    function setComplete() {
      requestsTotal = 0;
      requestsCompleted = 0;
      progress.finish();
    }

    Vue.http.interceptors.push((request, next) => {

      let showProgressBar = true;
      if (request.showProgressBar != null) {
        showProgressBar = request.showProgressBar;
        delete request.showProgressBar;
      }

      let completed;

      if (showProgressBar) {
        if (requestsTotal === 0) {
          setTimeout(() => {
            progress.start();
          }, latencyThreshold);
        }
        requestsTotal++;
        completed = (requestsCompleted / requestsTotal) * 100;
        progress.set(completed);
      }

      next((response) => {
        if (!showProgressBar) {
          return response;
        }

        // Finish progress bar some time later
        setTimeout(() => {
          if (!response.ok) {
            progress.fail();
            setComplete();
          }

          requestsCompleted++;

          if (requestsCompleted >= requestsTotal) {
            setComplete();
          }
          else {
            completed = ((requestsCompleted / requestsTotal) * 100) - 10;
            progress.set(completed);
          }
        }, latencyThreshold + responseLatency);
        return response;
      });
    });
  },
};

if (typeof module === 'object' && module.exports) {
  module.exports = VueResourceProgressBarInterceptor;
}
