# Branch overview

Most examples try to implement an event/ticket system using different
technologies or project architetctures

## Minimal node express typescript
- Node - runtime
- Express - web framework
- Helmet - security
- Pino - logging


## postgres explorations
https://github.com/gajus/slonik
https://github.com/salsita/node-pg-migrate
https://www.npmjs.com/package/@slonik/migrator
https://github.com/adelsz/pgtyped



## Project arcitecture notes
- hanlders should only deal with the request and response
- Service should deal with domain and data access logic