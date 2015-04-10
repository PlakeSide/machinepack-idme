module.exports = {


  friendlyName: 'Get Profile',


  description: 'Returns profile information for a specified end-point',


  extendedDescription: 'Clients access protected data by making API calls with the access token for a given user. Please see the OAuth Implementation page for instructions on how to retrieve an access token. The ID.me server will validate the access token to ensure it has not expired and that its scope covers the requested resource.',


  inputs: {

    access_token : {
      description : 'Access code requested from and OAuth response. See Get-Auth-Token',
      example: '3b57cc74ec7f1cf3e32527b1fa47e842a00755d643695a3dcbd0ee85885adb5c',
      required: true
    },
    end_point : {
      description: 'The specified group affiliation',
      example: 'military,student,responder,teacher,government',
      required: true
    }

  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'User Profile information:',
    },

  },


  fn: function (inputs,exits) {
    var Http = require('machinepack-http');

    Http.sendHttpRequest({

      baseUrl:'https://api.id.me',
      url: '/api/public/v2/'+inputs.end_point+'.json',
      method:'get',
      params:{
        access_token : inputs.access_token
      },
      headers: {
        'Accept':'application/json'
      }

    }).exec({

      error: function (err){
        return exits.error(err);
      },
      // 404 status code returned from server
      notFound: function (result){
        return exits.error(result);
      },
      // 400 status code returned from server
      badRequest: function (result){
        return exits.error(JSON.parse(result.body).error_description);
      },
      // 403 status code returned from server
      forbidden: function (result){
        return exits.error(result);
      },
      // 401 status code returned from server
      unauthorized: function (result){
        return exits.error(JSON.parse(result.body).message);
      },
      // 5xx status code returned from server (this usually means something went wrong on the other end)
      serverError: function (result){
        return exits.error(result);
      },
      // Unexpected connection error: could not send or receive HTTP request.
      requestFailed: function (){
        return exits.error('Unexpected connection error: could not send or receive HTTP request.');
      },
      success: function(result){
        return exits.success(JSON.parse(result.body));
      }
    });

  },



};
