# @neoskop/UGL

A Javascript implementation of the [UGL Interface][ugl-description] _(german only)_.

Master
[![Travis master][travis-master-image]][travis-master-url]
[![Test coverage master][coveralls-master-image]][coveralls-master-url]
[![Known Vulnerabilities master][snyk-master-image]][snyk-master-url]

Develop
[![Travis develop][travis-develop-image]][travis-develop-url]
[![Test coverage develop][coveralls-develop-image]][coveralls-develop-url]
[![Known Vulnerabilities develop][snyk-develop-image]][snyk-develop-url]

## Installation

```sh
yarn add @neoskop/ugl
```

# Usage

```typescript
import { ugl, RequestType } from '@neoskop/ugl';
  
const builder = ugl(); // equivalent for new UGLBuilder(new UGLMemoryWriter(), Mode.Craftsman);  
  
builder.kop({ 
    requestType: RequestType.AB, 
    deliveryDate: new Date(2017, 8, 16),
    name: 'Mark Wecke'
});
  
const articles = [
    [ '0014211241', 'Article A', 123.32 ],
    [ '0084353327', 'Article B', 23.87 ],
    [ '0034267322', 'Article C', 74.52 ],
]
  
for(let [ articleNumber, name, gross ] of articles) {
    builder.poa({ articleNumber, name, gross })
}

builder.end();
  
console.log(builder.getWriter().toString());
```

## Testing

```sh
yarn test
```

## Building

```sh
yarn run build
```

## License

[MIT](./LICENSE)

## Sponsor

[![Neoskop GmbH][neoskop-image]][neoskop-url]

[travis-master-image]: https://img.shields.io/travis/neoskop/neoskop-ugl/master.svg
[travis-master-url]: https://travis-ci.org/neoskop/neoskop-ugl
[travis-develop-image]: https://img.shields.io/travis/neoskop/neoskop-ugl/develop.svg
[travis-develop-url]: https://travis-ci.org/neoskop/neoskop-ugl
[snyk-master-image]: https://snyk.io/test/github/neoskop/neoskop-ugl/master/badge.svg
[snyk-master-url]: https://snyk.io/test/github/neoskop/neoskop-ugl/master

[coveralls-master-image]: https://coveralls.io/repos/github/neoskop/neoskop-ugl/badge.svg?branch=master
[coveralls-master-url]: https://coveralls.io/github/neoskop/neoskop-ugl?branch=master
[coveralls-develop-image]: https://coveralls.io/repos/github/neoskop/neoskop-ugl/badge.svg?branch=develop
[coveralls-develop-url]: https://coveralls.io/github/neoskop/neoskop-ugl?branch=develop
[snyk-develop-image]: https://snyk.io/test/github/neoskop/neoskop-ugl/develop/badge.svg
[snyk-develop-url]: https://snyk.io/test/github/neoskop/neoskop-ugl/develop

[ugl-description]: http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
[neoskop-image]: ./neoskop.png
[neoskop-url]: https://www.neoskop.de/

