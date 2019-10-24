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

                function pm_handler(req, method, flags) {
                    request.config.method = method;
                    request.config.data = {
                        power_mgt: {
                            request: req,
                            type: flags
                        }
                    }
                    request.state = 'ready';
                    return request;
                }

                // GET Methods =======================================

                request.xml_desc = () => {
                    request.config.method = 'get';
                    request.config.url += '/xml_desc';
                    request.state = 'ready';
                    return request
                }

                // PATCH Methods =======================================

                request.start = (flags) => {
                    return(pm_handler('start', 'patch', flags))
                }
                request.shutdown = (flags) => {
                    return(pm_handler('shutdown', 'patch', flags));
                }
                request.destroy = (flags) => {
                    return(pm_handler('destroy', 'patch', flags));
                }
                request.reboot = (flags) => {
                    return(pm_handler('reboot', 'patch', flags));
                }
                request.reset = () => {
                    return(pm_handler('reset', 'patch'));
                }
                request.suspend = () => {
                    return(pm_handler('suspend', 'patch'));
                }
                request.resume = () => {
                    return(pm_handler('resume', 'patch'));
                }

                // DELETE Methods =======================================

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
