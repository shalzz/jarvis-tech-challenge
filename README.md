## [Jarvis blockchain challenge][1]

### Run

To run we need to have a few dependencies
```
npm install -g truffle ganache-cli
```

Start a ganache-cli process in another terminal.
```
ganache-cli --debug
```

Deploy the contracts and generate the ABI's used by the client
```
truffle migrarte
```

Start the client with
```
npm run dev
```

### Contract tests
```
truffle test
```

### Client tests
```
npm run test
```

[1]: https://jarvis.exchange/tech-challenges/blockchain
