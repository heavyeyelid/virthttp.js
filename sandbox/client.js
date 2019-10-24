const axios = require('axios');
const virthttp = require('../index');

let target = 'http://127.0.0.1:8081/'
let params = { headers: { 'X-Auth-Key': 'yourapikey' } };

let req = virthttp.req(target, params).libvirt().domains();
if (req.state !== 'ready')
    console.log(`error: ${req.err_msg}`);
else
    req().then(res => {
        console.log(res.data);
    }).catch(err => console.error(err));

let req2 = virthttp.req(target, params).libvirt().domain({ name: 'win10' });
if (req2.state !== 'ready')
    console.log(`error: ${req2.err_msg}`);
else
    req2().then(res => {
        console.log(res.data);
    }).catch(err => console.error(err));
