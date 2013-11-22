'use strict';

describe('angularMovieApp', function () {

    it('should navigate to home', function () {
        browser().navigateTo('/index.html#/');
        expect(element('.message').text()).toContain('Yeahhh ! You\'re ready !');
    });

});