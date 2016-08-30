# vue-resource-progressbar-interceptor

Module attaches interceptors to vue instance which controls progressbar on top of the screen.

Your vue instance should have [this](https://github.com/hilongjw/vue-progressbar) `vue-progressbar` plugin installed and connected.

## Installation

    $ npm i vue-resource-progressbar-interceptor

Then in your code:

    const Vue = require('vue');
    const VueResource = require('vue-resource');
    const VueProgressBar = require('vue-progress-bar');
    const VueResourceProgressBarInterceptor = require('vue-resource-progressbar-interceptor');

    Vue.use(VueResource);
    Vue.use(VueProgressBar);
    Vue.use(VueResourceProgressBarInterceptor);

## Configuration

By default progressbar shows for every single request.

In order not to use progressbar for certain requests, use `showProgressBar` parameter in request.

Like this:

    Vue.http.get('/url', { showProgressBar: false })

Configuration options:

    Vue.use(VueResourceProgressBarInterceptor, {
      latencyThreshold: 100, // Number of ms before progressbar starts showing, 100 is default
    });

## Notes

This plugin was inspired by [this angular.js version](https://github.com/chieffancypants/angular-loading-bar).
