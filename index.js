const axios = require('axios');

var virthttp = {};
virthttp.req = (target) => {
    if (!target)
        target = '';
    return {
        libvirt: () => {
            return {
                domain: (selector) => {
                    if (!selector)
                        throw "No selector provided";
                    if (selector.name && selector.uuid)
                        throw "Only one selector must be set";
                    if (selector.name)
                        return axios.get(`${target ? target : ''}/libvirt/domains/by-name/${selector.name}`);
                    if (selector.uuid)
                        return axios.get(`${target}/libvirt/domains/by-uuid/${selector.uuid}`);
                },
                domains: () => {
                    return axios.get(`${target}/libvirt/domains`);
                }
            }
        }
    }
}

let req = virthttp.req().libvirt().domains;
var result = req();
result
    .then((res) => {
        console.log(res.data);
    })
    .catch((err) => {
        console.log(err);
    })

