const axios = require('axios');

// Make a request for a user with a given ID
axios.get('http://hsrv.cf:8082/libvirt/domains')
  .then(function (response) {
    // handle success
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
