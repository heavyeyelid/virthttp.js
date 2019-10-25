const axios = require('axios');
const utils = require('./utils');

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

                function pm_query(req, method, flags) {
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
                    return (pm_query('start', 'patch', flags))
                }
                request.shutdown = (flags) => {
                    return (pm_query('shutdown', 'patch', flags));
                }
                request.destroy = (flags) => {
                    return (pm_query('destroy', 'patch', flags));
                }
                request.reboot = (flags) => {
                    return (pm_query('reboot', 'patch', flags));
                }
                request.reset = () => {
                    return (pm_query('reset', 'patch'));
                }
                request.suspend = () => {
                    return (pm_query('suspend', 'patch'));
                }
                request.resume = () => {
                    return (pm_query('resume', 'patch'));
                }

                // DELETE Methods =======================================

                request.delete = (flags) => {
                    request.config.method = 'delete';
                    if (flags) {
                        if (Array.isArray(flags)) {
                            request.config.params = {
                                options: utils.arr2comma(flags)
                            }
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
        request.domains = (params) => {
            delete request.domains;
            delete request.domain;
            request.config.url += '/domains';
            if (params) {
                request.config.params = params;
                if (Array.isArray(params.state)) {
                    request.config.params.state = utils.arr2comma(params.state)
                }
            }
            request.state = 'ready';
            return request;
        };
        return request;
    };
    return request;
};
