module.exports = require('./lib/virthttp');

const virthttp = module.exports;

let req = virthttp.req('http://127.0.0.1:8081').libvirt().domains();

if(req.state !== 'ready')
    console.log(`error: ${req.err_msg}`);
else
    req().then(res => {
        console.log(res.data);
    }).catch(err => console.error(err));

let req2 = virthttp.req('http://127.0.0.1:8081').libvirt().domain({name: 'win10'});
if(req2.state !== 'ready')
    console.log(`error: ${req2.err_msg}`);
else
    req2().then(res => {
        console.log(res.data);
    }).catch(err => console.error(err));
