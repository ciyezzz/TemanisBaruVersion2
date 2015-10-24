/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */


var nodemailer = require('nodemailer');
module.exports = {
	verify :function(req,res,next){
    if(req.session.authenticated)
    {
          return res.redirect('/');
    }
    if(typeof req.param('code')=="undefined" || req.param('code').length==0)
    {
        return res.redirect('/');
    }
    var usrObj = {
        encriptedId: req.param('code')
    }
    User.findOne({'id': usrObj.encriptedId}, function foundUser(err,user){
        var usr ={
          verification : true
        }
        console.log(user);
        User.update(user.id,usr,function userUpdated(err,user1){
            //   var requireLoginError = ['Your account has been activated. Please login'];
            //  req.session.flash = {
            //   success: requireLoginError
            // }
            return res.redirect('/');
        });
 
    });
  },
	create : function(req,res,next)
	{
		var usrObj ={
			email : req.param('id'),
			password : req.param('password'),
			pilihan : req.param('pil')
		}
		if(usrObj.pilihan=="murid")
			return res.redirect('/user/siswa');
		else if(usrObj.pilihan=="sekolah")
			return res.redirect('/user/sekolah');
	},
	editprofile : function(req,res,next)
	{
		var usrObj = {
			email : req.param('email'),
			firstname : req.param('firstname'),
			lastname : req.param('lastname'),
			placebirth : req.param('placebirth'),
			datebirth : req.param('date'),
			addr : req.param('addr')
		}
		User.update(req.session.User.id, usrObj, function updateUser(err,user){
			
			return res.redirect('/user/siswa');
		});
	},
	changepass : function(req,res,next){
		var usrObj = {
			password : req.param('password')
		}
		if(req.session.User.password==req.param('old'))
		{
			User.update(req.session.User.id, usrObj, function updatedUser(err,user){
				res.send("New password is updated")
			});
		}
		else
			res.send("Old password is wrong. Please try again");
	},
	sendemail : function(req,res,next){
		var transporter = nodemailer.createTransport({
              service:'Gmail',
              auth:{
                user:'christianyaputra@gmail.com',
                pass:'kri55tian'
              }
            });
            var host=req.get('host');
            var link="http://"+req.get('host')+"/user/verify?code="+user.encryptedPassword;
            var MailOptions = {
                from: req.session.User.email,
                to : '<christianyaputra@gmail.com>',
                subject : 'Temanis Baru - Report Problem',
                html : 'Thank you for reporting problem to us<br></a><br>Our staff will handle it and reply soon<br><br>Best regards,<br><br>Temanis Baru'
            };
            transporter.sendMail(MailOptions,function(error,info){
              if (error) {
                console.log(error);
              } else {
                console.log('Message sent: '+info.response);
              }
            });
	},
	createList : function(req,res,next){
		var usrObj = {
			iduser : req.session.User.id,
			grade : req.param('grade'),
			pending : true,
			action : false
		}
		List.create(usrObj, function createList(err,list){
			return res.redirect('/user/siswa');
		});
	},
	approve : function(req,res,next) {
		var usrObj = {
			id : req.param('id'),
			state : req.param('a')
		}
		List.findOne(usrObj.id, function foundList(err,list){
			if(usrObj.state=='1')
			{
				var Obj = {
					pending : false,
					action : true
				}
				List.update(list.id,Obj,function listupdated(){});
				list.pending = false;
				list.action = true;
			}
			else
			{
				var Obj = {
					pending : false,
					action : false
				}
				List.update(list.id,Obj,function listupdated(){});				
				list.pending = false;
				list.action = false;
			}
			return res.redirect('/user/pendingsekolah');
		});
	},
	siswa : function(req,res,next)
	{
		res.view();
	},
	sekolah : function(req,res,next)
	{
		res.view();
	},
	editsiswa:function(req,res,next)	
	{
		res.view();
	},	
	listsiswa:function(req,res,next)	
	{
		User.find({'sekolah' : true}, function foundUser(err,users){
			res.view({
				users : users
			});
		});
	},
	dotainfo:function(req,res,next)	
	{
		User.findOne(req.param("id"), function foundUser(err,user){
			List.findOne({'iduser' : req.session.User.id}, function foundList(err,list){
				var x;
				if(!list)
					x = true;
				else 
					x = false;
				var usrObj = {
					x : x
				}
				res.view({
					user:user,
					usrObj : usrObj
				});
			});
		});
	},	
	editinfo : function(req,res,next){
		var filename = "";
		if(typeof req.param('filename')!="undefined")
			filename = req.param('filename');
		if(req.param('filename').length!=0)
			filename = req.param('filename');
		console.log(filename);
		var usrObj = {
			filename : filename,
			info : req.param('info')
		}
		User.update(req.session.User.id,usrObj, function userupdated(){
			return res.redirect('/user/sekolah');
		});
	},
	changepwsiswa:function(req,res,next)	
	{
		res.view();
	},	
	reportsiswa:function(req,res,next)	
	{
		res.view();
	},
	editsekolah:function(req,res,next)	
	{
		res.view();
	},
	changepwsekolah:function(req,res,next)	
	{
		res.view();
	},
	reportsekolah:function(req,res,next)	
	{
		res.view();
	},
	pendingsekolah:function(req,res,next)	
	{
		var usrObj = {
			filter : req.param('filter')
		}
		if(typeof usrObj.filter=="undefined" || usrObj.filter=="filterby")
		{
			List.find(function foundList(err,lists){
				User.find(function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
		else if(usrObj.filter=="name")
		{
			List.find(function foundList(err,lists){
				User.find({sort:'firstname asc'},function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
		else if(usrObj.filter=="age")
		{
			List.find(function foundList(err,lists){
				User.find({sort:'age asc'},function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
		else if(usrObj.filter=="sex")
		{
			List.find(function foundList(err,lists){
				User.find({sort:'sex asc'},function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
		else if(usrObj.filter=="grade")
		{
			List.find(function foundList(err,lists){
				User.find({sort:'grade asc'},function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
	},
	viewapplsekolah:function(req,res,next)	
	{
		var usrObj = {
			filter : req.param('filter')
		}
		if(typeof usrObj.filter=="undefined" || usrObj.filter=="filterby")
		{
			List.find(function foundList(err,lists){
				User.find(function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
		else if(usrObj.filter=="name")
		{
			List.find(function foundList(err,lists){
				User.find({sort:'firstname asc'},function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
		else if(usrObj.filter=="age")
		{
			List.find(function foundList(err,lists){
				User.find({sort:'age asc'},function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
		else if(usrObj.filter=="sex")
		{
			List.find(function foundList(err,lists){
				User.find({sort:'sex asc'},function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
		else if(usrObj.filter=="grade")
		{
			List.find(function foundList(err,lists){
				User.find({sort:'grade asc'},function foundUsers(err,users){
					res.view({
						lists : lists,
						users : users
					});
				})
			});
		}
	},
	uploadto : function(req,res,next){
		var usrObj={
			name : req.param('name'),
			email : req.param('email')
		};
		if(typeof req.param('file_name')=="undefined")
			 usrObj.filename = "";
		else
			 usrObj.filename = req.param('file_name');
		if(typeof req.param('file_url')=="undefined")
	 		usrObj.fileurl = "";
	 	else
	 		usrObj.fileurl = req.param('file_url');
	 	var transporter = nodemailer.createTransport({
				 		service:'Gmail',
						auth:{
							user:'tunetify@gmail.com',
							pass:'kampoengboy@1994'
						}
				});
				if(usrObj.fileurl!="")
				{
						var MailOptions = {
										from:'Tunetify<tunetify@gmail.com>',
										to : 'mike.visualsoft@gmail.com',
										subject : 'Apply Startup',
										html : 'Hai, Admin. Seseorang mengirimkan profil startupnya dengan informasi sebagai berikut : <br><br>Nama Startup: '+usrObj.name+'<br>Website URL : '+ usrObj.url+'<br>Email : '+ usrObj.email +'<br>No. Telepon : '+ usrObj.phone+'<br>Deskripsi Startupnya adalah : <br><pre>'+usrObj.description+'</pre>',
										attachments : [
											{
													filename : usrObj.filename,
													path : usrObj.fileurl
											}
										]
						};
				}
				else {
					var MailOptions = {
									from:'Tunetify<tunetify@gmail.com>',
									to : usrObj.email,
									subject : 'Apply Startup',
									html : 'Hai, Admin. Seseorang mengirimkan profil startupnya dengan informasi sebagai berikut : <br><br>Nama Startup: '+usrObj.name+'<br>Website URL : '+ usrObj.url+'<br>Email : '+ usrObj.email +'<br>No. Telepon : '+ usrObj.phone+'<br>Deskripsi Startupnya adalah : <br><pre>'+usrObj.description+'</pre>',
					};
				}
				transporter.sendMail(MailOptions,function(error,info){
							if (error) {
								console.log(error);
							} else {
								console.log('Message sent: '+info.response);
							}
				});
				return res.redirect('/user/siswa');
	},
	createuser : function(req,res,next){
		var pil = false;
		if(req.param('pil')=='loginsekolah')
				pil = true;
		var usrObj = {
			name : req.param('name'),
			email : req.param('email'),
			password : req.param('password'),
			reenterpassword : req.param('reenterpassword'),
			sekolah : pil,
			info : "",
		}
		User.create(usrObj, function Usercreated(err,user){
			var transporter = nodemailer.createTransport({
              service:'Gmail',
              auth:{
                user:'christianyaputra@gmail.com',
                pass:'kr1557ian1478'
              }
            });
            var host=req.get('host');
            var link="http://"+req.get('host')+"/user/verify?code="+user.id;
            var MailOptions = {
                from: '<christianyaputra@gmail.com>',
                to : usrObj.email,
                subject : 'Temanis Baru - Confirm Email',
                html : 'Please click the link below to verify your account'+'<a href="'+link+'">'+link+'</a><br><br>Best regards,<br><br>Temanis Baru'
            };
            transporter.sendMail(MailOptions,function(error,info){
              if (error) {
                console.log(error);
              } else {
                console.log('Message sent: '+info.response);
              }
            });
            return res.redirect('/');
		});
	},
	login: function(req,res,next){
		var usrObj = {
			email : req.param('email')
		}
		User.findOne(usrObj, function userFound(err,user){
			if(!user) return res.redirect('/');
			if(user.password==req.param('password'))
			{
				console.log(user);
				if(!user.verification)
				{
					return res.redirect('/');
				}
				if(user.sekolah)
				{
					req.session.User = user;
					return res.redirect('/user/sekolah');
				}
				else
				{
					req.session.User = user;
					return res.redirect('/user/siswa');
				}
			}
				
			else
				res.send("The email / password you entered is not valid. Please try again");	
		});
	}
};

