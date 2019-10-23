const axios = require('axios');

module.exports = (target, params) => {

    let request = function() {
        if(request.state === 'ready')
            return axios.request(request.config);
        if(request.state === 'incomplete')
            throw new Error("Incomplete request");
        if(request.state === 'error')
            throw new Error(request.err_msg);
        throw new Error("Invalid state");
    };

    request.state = 'incomplete';
    request.config = {
        url: ''
    };
    if(target)
        request.config.baseURL = target;
    if(params && params.method)
        request.config.method = params.method;

    request.libvirt = () => {
        delete request.libvirt;
        request.config.url += '/libvirt';
        request.domain = (selector) => {
            delete request.domains;
            delete request.domain;
            let error = msg => {
              request.err_msg = msg;
              request.state = 'error';
              return request;
            };
            if (!selector)
                return error("No selector provided");
            if (selector.name && selector.uuid)
                return error("More than one selector provided");

            let alter_target = (type, sel) => {
                request.config.url += `/domains/by-${type}/${sel}`;
                request.state = 'ready';
                return target;
            };
            if (selector.name)
                return alter_target('name', selector.name);
            if (selector.uuid)
                return alter_target('uuid', selector.uuid);

            return error("Bad domain selector");
        };
        request.domains = () => {
            delete request.domains;
            delete request.domain;
            request.config.url += '/domains';
            request.state = 'ready';
            return request;
        };
        return request;
    };
    return request;
};
