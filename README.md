# loglevel Message prefix plugin [![NPM Version](https://img.shields.io/npm/v/loglevel-message-prefix.svg)](https://npmjs.org/package/loglevel-message-prefix) [![Build Status](https://travis-ci.org/NatLibFi/loglevel-message-prefix.svg)](https://travis-ci.org/NatLibFi/loglevel-message-prefix) [![Test Coverage](https://codeclimate.com/github/NatLibFi/loglevel-message-prefix/badges/coverage.svg)](https://codeclimate.com/github/NatLibFi/loglevel-message-prefix/coverage)

Plugin for [loglevel](https://github.com/pimterry/loglevel) which allows defining prefixes for log messages

## Usage

### Installation

Clone the sources and install the package (In the source directory) on command line using `npm`:

```sh
npm install
```

#### AMD

```javascript

define(['loglevel', 'loglevel-message-prefix'], function(log, loglevelMessagePrefix) {

  loglevelMessagePrefix(log, {
    staticPrefixes: ['foobar']
  });

  log.warn('TEST');

});

```

#### Node.js require

```javascript

var log = require('loglevel');
var loglevelMessagePrefix = require('loglevel-message-prefix');

loglevelMessagePrefix(log, {
  staticPrefixes: ['foobar']
});

log.warn('TEST');

```

#### Browser globals

```javascript

loglevelMessagePrefix(log, {
  staticPrefixes: ['foobar']
});

log.warn('TEST');

```

### Example

**Code**:

```javascript

var log = require('loglevel-message-prefix')(require('loglevel'), {
    prefixes: ['level'],
    staticPrefixes: ['foo', 'bar'],
    separator: '/'
});

log.setLevel('info');

log.info('Testing');

```

**Output**:

```
[INFO/foo/bar]: Testing

```

## Configuration

The configuration object is passed as the second argument to the function. Following properties are supported ():

- **prefixes**: An array of predefined dynamic prefixes that are to be used. Defaults to: `['timestamp', 'level']`. Available prefixes are:
  - *timestamp*: Add locale-specific timestamp
  - *level*: Add log level prefix
- **staticPrefixes**: An array of strings that should be added after dynamic prefixes (E.g. 'foo'). Defaults to none.
- **separator**: String used to separate prefixes. Defaults to single whitespace (` `).
- **options**: Options for dynamic prefixes. Available options are:
  - *timestamp*: An object of properties for date formatting. Available properties are: *locale*, *timezone* and *hour12*. Defaults to `{hour12: false}`-

The properties are defined the [schema file](https://github.com/NatLibFi/loglevel-message-prefix/blob/master/resources/parameters-schema.json).

## License and copyright

Copyright (c) 2015-2016 **University Of Helsinki (The National Library Of Finland)**

This project's source code is licensed under the terms of **MIT License**.