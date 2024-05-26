# Proxy Checker

This project is a simple, yet powerful, proxy checker written in JavaScript. It uses the `got` HTTP client and `hpagent` for handling HTTPS requests through a proxy. The project is designed to be highly configurable and provides real-time feedback on the status of the proxies being checked.

## Features

- Checks both IPv4 and IPv6 proxies.
- Supports multi-threaded proxy checking.
- Provides real-time feedback on the status of the proxies being checked.
- Detects and ignores duplicate proxies.
- Configurable request timeout and maximum checks per thread.

## Installation

To install the dependencies, run:

```bash
npm install
```
or the `install.bat`

## Configuration

The configuration of the proxy checker is done through the `config.js` file. Here you can set the following options:

- `proxy`: The proxy to use for the requests. The `%SESSION%` placeholder will be replaced with a random string for each request.
- `timeout`: The timeout for the requests in milliseconds.
- `threads`: The number of threads to use for checking the proxies.
- `maxChecks`: The maximum number of checks to perform per thread.

## Usage

To start the proxy checker, simply run:

```bash
node ./src/index.js
```
or the `start.bat`

The status of the proxies being checked will be printed to the console in real-time. The process title will also be updated with the current statistics.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request on GitHub.

## Made by https://t.me/ShadowtheBan