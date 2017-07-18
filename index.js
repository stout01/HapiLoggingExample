'use strict';

const Hapi = require('hapi');
const laabr = require('laabr');

const server = new Hapi.Server();
server.connection({ port: 3002, host: 'localhost' });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.start((err) => {

    laabr.format('response', ':cid - :req[x-request-id] - :time[utc], :tags :req[host] :method :url :status (:responseTime)');

    server.register({
      register: laabr.plugin,
      options: {
        colored: true,
        correlator: {
          enabled: true,
          header: 'x-request-id'
        },
        pino: {
          level: 'trace'
        },
        hapiPino: {
          logPayload: true
        }
      }
    });

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});