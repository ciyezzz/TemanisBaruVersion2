/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      filename : 'string',
  		password : 'string',
      name : 'string',
  		email : 'string',
      datebirth : 'string',
      placebirth : 'string',
      info : 'string',
  		sekolah : {
  			type : 'boolean',
  			defaultsTo : false
  		},
      verification : {
        type : 'boolean',
        defaultsTo : false
      }
  }
};

