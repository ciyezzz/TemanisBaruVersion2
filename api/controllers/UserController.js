/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var nodemailer = require('nodemailer');
module.exports = {
	create : function(req,res,next)
	{
		var usrObj ={
			email : req.param('id'),
			password : req.param('password'),
			pilihan : req.param('pil')
		}
		if(usrObj.pilihan=="admin")
			return res.redirect('/user/admin');
		else if(usrObj.pilihan=="murid")
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
			datebirth : req.param('date')+'/'+req.param('month')+'/'+req.param('year'),
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
                html : 'Thank you for reporting problem to us<br><br>Our staff will handle it and reply soon<br><br>Best regards,<br><br>Temanis Baru'
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
	admin : function(req,res,next)
	{
		res.view();
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
		var usrObj = {
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
	createuser : function(req,res,next){
		var pil = false;
		if(req.param('pil')=='loginsekolah')
				pil = true;
		var usrObj = {
			password : req.param('password'),
			firstname : req.param('firstname'),
			lastname : req.param('lastname'),
			email : req.param('email'),
			alias : req.param('alias'),
			info : " ",
			sekolah : pil
		}
		/*User.find({'sekolah':false}, function foundUser(err,user){
			res.view({
				user:user	
			});
		})*/
		User.create(usrObj, function Usercreated(err,user){
			user.save(function(user){});
		});
		return res.redirect('/');
	},
	login: function(req,res,next){
		var usrObj = {
			email : req.param('email')
			
		}
		User.findOne(usrObj, function userFound(err,user){
			if(user.password==req.param('password'))
			{
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

