module.exports = {


  friendlyName: 'Get auth token',


  description: 'Retrive access_token from using ID.me',


  extendedDescription: '',


  inputs: {

    code: {
      description: 'the exact code that you received during the authorization request.',
      required: true,
      example: ''
    },
    client_id : {
      description: 'your client id',
      required: true,
      example: ''
    },
    client_secret : {
      description: 'your client secret',
      required: true,
      example: ''
    },
    redirect_uri : {
      description: 'your redirect URI',
      required: true,
      example: ''      
    },
    grant_type : {
      description: 'The only supported value is currently `authorization_code`',
      required: false,
      example: ''
    }
  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    success: {
      description: 'Returns the authorization token.',
      example: { 
        access_token: '3b57cc74ec7f1cf3e32527b1fa47e842a00755d643695a3dcbd0ee85885adb5c',
        token_type: 'bearer',
        expires_in: 300,
        refresh_token: 'edab2746ff2dd6863d84e5b7c88840a26f5727c8a0900a11f73fb6e508dc1bcc',
        scope: 'military' 
      }
    },

  },


  fn: function (inputs,exits) {

    var Http = require('machinepack-http');

    Http.sendHttpRequest({

      baseUrl:'https://api.id.me',
      url: '/oauth/token',
      method:'post',
      params:{
        code : inputs.code,
        client_id : inputs.client_id,
        client_secret : inputs.client_secret,
        redirect_uri : inputs.redirect_uri,
        grant_type : inputs.grant_type || 'authorization_code'

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
        return exits.error(result);
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


    
  }



};
