const axios = require('axios');

module.exports = (target, params) => {

    let request = function () {
        if (request.state === 'ready')
            return axios.request(request.config);
        if (request.state === 'incomplete')
            throw new Error("Incomplete request");
        if (request.state === 'error')
            throw new Error(request.err_msg);
        throw new Error("Invalid state");
    };
    request.state = 'incomplete';

    if (params)
        request.config = params;
    else
        request.config = {};
    if (target)
        request.config.baseURL = target;
    request.config.url = ''; // MUST be empty, otherwise the url won't match with virthttp server
    request.config.responseType = 'json' // virthttp always send JSON, so responseType will always be JSON 


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

                // GET Method =======================================

                request.xml_desc = () => {
                    request.config.method = 'get';
                    request.config.url += '/xml_desc';
                    request.state = 'ready';
                    return request
                }

                // PATCH Method =======================================

                request.start = (flags) => {
                    request.config.method = 'patch';
                    request.config.data = {
                        power_mgt: {
                            request: 'start',
                            type: flags
                        }
                    }
                    request.state = 'ready'
                    return request;
                }
                request.shutdown = (flags) => {
                    request.config.method = 'patch';
                    request.config.data = {
                        power_mgt: {
                            request: 'shutdown',
                            type: flags
                        }
                    }
                    request.state = 'ready'
                    return request;
                }
                request.destroy = (flags) => {
                    request.config.method = 'patch';
                    request.config.data = {
                        power_mgt: {
                            request: 'destroy',
                            type: flags
                        }
                    }
                    request.state = 'ready'
                    return request;
                }
                request.reboot = (flags) => {
                    request.config.method = 'patch';
                    request.config.data = {
                        power_mgt: {
                            request: 'reboot',
                            type: flags
                        }
                    }
                    request.state = 'ready'
                    return request;
                }
                request.reset = (flags) => {
                    request.config.method = 'patch';
                    request.config.data = {
                        power_mgt: 'reset'
                    }
                    request.state = 'ready'
                    return request;
                }
                request.suspend = (flags) => {
                    request.config.method = 'patch';
                    request.config.data = {
                        power_mgt: 'suspend'
                    }
                    request.state = 'ready'
                    return request;
                }
                request.resume = (flags) => {
                    request.config.method = 'patch';
                    request.config.data = {
                        power_mgt: 'resume'
                    }
                    request.state = 'ready'
                    return request;
                }

                // PATCH Method =======================================

                request.delete = (flags) => {
                    request.config.method = 'delete';
                    if (flags) {
                        if (Array.isArray(flags)) {
                            request.config.params = {
                                options: ''
                            }
                            let bFirst = true;
                            flags.forEach((flag) => {
                                if (!bFirst)
                                    request.config.params.options += ',';
                                request.config.params.options += flag;
                                bFirst = false;
                            })
                        } else {
                            request.config.params = {
                                options: flags
                            }
                        }
                    }
                    request.state = 'ready';
                    return request;
                }
                request.state = 'ready';
                return request;
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
