# [cli-status](https://npmjs.org/package/cli-status)


#### Highly configurable status indicators for your node.js cli.


## Local Installation:

`cli-status` is an [npm](https://npmjs.org/) module. Once you have npm, you can run this to locally install `cli-status` into the current directory.

    $> npm install cli-status

Or, add this as a dependency in your project's `package.json`

```json
"dependencies": {
	"cli-status": "0.1.x"
}
```

## How to use:

[Configuration options](https://github.com/Fishrock123/cli-status/blob/master/index.js#L75)

#### Manual stepping:
```js
var status = require('cli-status');

status.configure({
	// See options
});

while (something) {
	status.step(progress);
}
```

#### Automatic polling:
```js
var status = require('cli-status');
var files = [];

status.configure({
	// See options
	type: '/',
    total: server.numFiles()
}).start(function() {
	return files.length;
});

while (files.length < server.numFiles()) {
	var data = server.getNext();
	files.push(data);
}

status.end();
// Optional if files.length >= options.total is guaranteed.
```

### Testing:

Install or clone the repo, then run:

    $> npm test
