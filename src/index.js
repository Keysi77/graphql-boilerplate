import '@babel/polyfill/noConflict' 
import server from './server'

server.start({ port: process.env.PORT || 4000 }, ({ port }) => {
	console.log(`The server is up at port ${port}`);
});