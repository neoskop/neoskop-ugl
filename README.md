# @neoskop/UGL

A Javascript implementation of the [UGL Interface][ugl-description] _(german only)_.

[![Test coverage][coveralls-image]][coveralls-url]

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

[coveralls-image]: https://coveralls.io/repos/github/neoskop/neoskop-ugl/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/neoskop/neoskop-ugl?branch=master
[ugl-description]: http://www.label-software.de/wp-content/uploads/2017/03/ugl_schnittstelle.pdf
[neoskop-image]: ./neoskop.png
[neoskop-url]: https://www.neoskop.de/

