const axios = require('axios');

var virthttp = {};
virthttp.req = (target, params) => {
    target = target || '';
    return {
        libvirt: () => {
            return {
                domain: (selector) => {
                    return new Promise((resolve, reject) => {
                        if (!selector)
                            reject(new SyntaxError("No selector provided"));
                        if (selector.name && selector.uuid)
                            reject(new SyntaxError("More than one selector provided"));
                        function get(target, type, selector) {
                            return(axios.get(`${target}/libvirt/domains/by-${type}/${selector}`, params));
                        }
                        if (selector.name)
                            resolve(get(target, 'name', selector.name));
                        if (selector.uuid)
                            resolve(get(target, 'uuid', selector.uuid));
                        reject(new SyntaxError("Bad selector"));
                    });
                },
                domains: () => {
                    return axios.get(`${target}/libvirt/domains`, params);
                }
            }
        }
    }
}
