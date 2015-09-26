/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  		password : 'string',
  		firstname : 'string',
  		lastname : 'string',
  		email : 'string',
      datebirth : 'string',
      placebirth : 'string',
      alias : 'string',
      info : 'string',
      addr : 'string',
  		sekolah : {
  			type : 'boolean',
  			defaultsTo : false
  		}
  }
};

