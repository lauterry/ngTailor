
/**
 * Variables
 */

var cliWidth = 79, step, length, total, prefix, suffix = '', ended = false, stepper, autoStepTime = 500, symbol, barLength = 0, progress;
var defaults = {
	length: 30,
	type: '%'
};


/**
 * Private methods
 */

makeBar = function() {
	var i, str = '';
    for (i = 0; i < length; i++) {
        str += i < barLength ? symbol : ' ';
    }
    return str;
};

barCalculator = function() {
	if (progress < 0 || progress > total || isNaN(progress)) return false;
	if (ended && progress < total) ended = false;
    barLength = Math.floor(length * (progress / total));
    if (barLength == 0 && progress > 0) barLength = (total >= 10 ? 1 : 0);
    return true;
};

checkEnded = function() {
	if (ended || (ended = (progress >= total))) {
    	if (stepper) clearInterval(stepper);
    	return '\n';
    } else {
    	return'\u000D';
    }
};


/**
 * Step methods for different status types.
 */

stepPercent = function(prog) {
	if (progress === prog) return;
	progress = prog;
	if (!barCalculator()) return;

	process.stdout.write(' ' + prefix + ' [' + makeBar() + '] ' + Math.floor((progress / total) * 100) + '% ' + suffix + checkEnded());
};

stepFraction = function(prog) {
	if (progress === prog) return;
	progress = prog;
    if (!barCalculator()) return;

    process.stdout.write(' ' + prefix + ' [' + makeBar() + '] ' + progress + '/' + total + ' ' + suffix + checkEnded());
};

stepEllipsis = function() {
    process.stdout.write(' ' + prefix + ' ' + (ended ? '...\n' : makeBar() + '\u000D'));

    if (++barLength > length) barLength = 0;
};


/**
 * Public methods
 */

/**
 * Configure `cli-status` with various options:
 *
 * - `type` [none]
 *  none:
 *		- `length`
 *		- `symbol`
 *		- `prefix`
 *		- `suffix`
 *	'fraction':
 *	'/':
 *	 	- `length` [30]
 *		- `symbol` ['=']
 *		- `prefix` ['Progress']
 *		- `suffix` ['']
 *		- `total` [1]
 *	'percent':
 *	'%':
 *	 	- `length` [30]
 *		- `symbol` ['=']
 *		- `prefix` ['Progress']
 *		- `suffix` ['']
 *		- `total` [100]
 *	'ellipsis':
 *	'...':
 *		- `length` [3]
 *		- `symbol` ['.']
 *		- `prefix` ['Working']
 *
 * - `autoStepTime` [500 (ms)]
 *
 * @param {Object} options
 * @return {Object} chainable module.exports
 * @api public
 */
configure = function(options) {
	options = options || defaults;

	autoStepTime = options.autoStepTime || autoStepTime;

	switch (options.type) {
		case 'fraction':
		case '/':
			exports.step = step = stepFraction;
			length = options.length || defaults.length;
			symbol = options.symbol || '=';
			prefix = options.prefix || 'Progress:';
			suffix = options.suffix || '';
			total = options.total || 1;
			var addLen = prefix.toString().length + suffix.toString().length + (total.toString().length * 2) + 7
			length = length + addLen > cliWidth ? cliWidth - addLen : length;
			break;

		case 'percent':
		case '%':
			exports.step = step = stepPercent;
			length = options.length || defaults.length;
			symbol = options.symbol || '=';
			prefix = options.prefix || 'Progress:';
			suffix = options.suffix || '';
			total = options.total || 100;
			var addLen = prefix.toString().length + suffix.toString().length + 10;
			length = length + addLen > cliWidth ? cliWidth - addLen : length;
			break;

		case 'ellipsis':
		case '...':
			exports.step = step = stepEllipsis;
			length = options.length || 3;
			symbol = options.symbol || '.';
			prefix = options.prefix || 'Working';
			barLength = progress = 0;
			var addLen = prefix.toString().length + 5;
			length = length + addLen > cliWidth ? cliWidth - addLen : length;
			break;

		default:
			var i, str = '';
			length = options.length || length;
			symbol = options.symbol || symbol;
			prefix = options.prefix || prefix;
			suffix = options.suffix || suffix;
		    for (i = 0; i < cliWidth - prefix.length; i++) {
		        str += ' ';
		    }
			process.stdout.write(prefix + str + '\u000D');
			break;
	}

	return exports;
};

/**
 * Start automatically stepping with an interval as set by `autoStepTime`.
 *
 * @param {Function} polling
 * @return {Object} chainable module.exports
 * @api public
 */
start = function(polling) {
	if (stepper && (stepper._onTimeout || stepper.ontimeout)) end();
	ended = false;
	if (polling) {
		stepper = setInterval(function() {
			step(polling());
		}, autoStepTime);
	} else {
		stepper = setInterval(step, autoStepTime);
	}

	return exports;
};

/**
 * Stop automatically stepping.
 *
 * @return {Object} chainable module.exports
 * @api public
 */
end = function() {
	var finalize;
	// Hack to fix a backwards-compatibility issue introduced in node v0.10.7
	if (finalize = stepper._onTimeout || stepper.ontimeout) {
		ended = true;
		clearInterval(stepper);
		finalize();
	}

	return exports;
};


/**
 * Set the configuration to default.
 */

configure();


/**
 * Export the public stuffs.
 */

exports.configure = configure;
exports.defaults = defaults;
exports.start = start;
exports.end = end;
