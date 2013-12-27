#!/usr/bin/env node

// Ok, sure I "should" probably be running unit tests instead of this, but this works.

var status = require('./index');

function testPercent() {
    console.log('Testing percent (%) bar.');
    var i = 0, interval = setInterval(function() {
        status.step(++i);
        if (i >= 100) {
            clearInterval(interval);
            testFraction();
        }
    }, 25);
}

function testFraction() {
    console.log('Testing fraction (/) bar.');
    status.configure({
    	type: '/',
    	total: 24
    });

    var i = 0, interval = setInterval(function() {
        status.step(++i);
        if (i >= 24) {
            clearInterval(interval);
            testEllipsis();
        }
    }, 200);
}

function testEllipsis() {
    console.log('Testing ellipsis (...)');
    status.configure({
        type: '...'
    });

    status.start();

    setTimeout(function() {
        status.end();
        testLengthCapFrac();
    }, 6000);
}

function testLengthCapFrac() {
    console.log('Testing bar length capping and suffix.');
    status.configure({
        type: '/',
        total: 1024,
        length: 78,
        suffix: 'Files processed.'
    });

    var i = 0, interval = setInterval(function() {
        status.step(++i);
        if (i >= 1024) {
            clearInterval(interval);
            testStepper();
        }
    }, 1);
}

function testStepper() {
    console.log('Testing bar with async progress polling.');
    status.configure({
        type: '/',
        total: 13,
        length: 13,
        autoStepTime: 100
    });

    var progress = 0;

    status.start(function() {
        return progress;
    });

    var interval = setInterval(function() {
        ++progress;
        if (progress >= 13) {
            clearInterval(interval);
            status.end();
            testZeroOne();
        }
    }, 500);
}

function testZeroOne() {
    console.log('Testing bar with 0 and 1.');
    status.configure().step(0);

    setTimeout(function() {
        status.step(1);
        setTimeout(function() {
            console.log('');
            testEverything();
        }, 2000);
    }, 2000);
}

function testEverything() {
    console.log('Testing all the configurations!');
    var getTotal = function() {
        return 17;
    };
    var progress = 0;

    status.configure({
        type: '%',
        total: getTotal(),
        length: 37,
        symbol: '~',
        prefix: 'Doing',
        suffix: 'stuffs',
        autoStepTime: 79
    }).start(function() {
        return progress;
    });

    var interval = setInterval(function() {
        ++progress;
        if (progress >= getTotal()) {
            clearInterval(interval);
        } else if (progress === 6) {
            status.configure({
                length: 23,
                symbol: ':'
            }).start(function() {
                return progress;
            });
        }
    }, 500);
}

testPercent();
