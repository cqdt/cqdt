var ChatApp = function(user,socket,option){ // tap trung xu ly, dong bo du lieu,
    var CHATBOX_SEND_MESSAGE = "sendmessage",
        CHATBOX_VIEW_MESSAGE = "view message",
        CHATBOX_TYPING = "typing message",
        CHATBOX_END_TYPING = "end typing message",
        CHATBOX_CLOSE = "chatbox close",
        CHATBOX_UPDATE_CONTACT = "chatbox update contact",
        CHATCONTACT_CALL_INSTANCE = "call instance",
        CHATCONTACT_SET_STATE = "chat contact set state",
        CHATCONTACT_CREATEGROUP = "chat contact create group",
        CHATCONTACT_RELOAD = "reload",
        GET_AVATAR = "get avatar",

        AVATAR_DEFAULT = option.avatar||"/img/male.png",

        SOCKET_SEND_MESSAGE = "socket send message",
        SOCKET_GET_MESSAGE = "socket get message",
        SOCKET_SEND_TYPING = "socket send typing",
        SOCKET_GET_TYPING = "socket get typing",
        SOCKET_SEND_END_TYPING = "socket send end typing",
        SOCKET_GET_END_TYPING = "socket get end typing",
        SOCKET_SEND_CONNECT = "socket send connect",
        SOCKET_GET_CONNECT = "socket get connect",
        SOCKET_SEND_DISCONECT = "socket send disconnect",
        SOCKET_GET_DISCONNECT = "socket get disconnect",
        SOCKET_SEND_READ_MESSAGE = "socket send read message",
        SOCKET_SEND_DEL_MESSAGE = "scoket send del message",
        SOCKET_GET_READ_MESSAGE = "socket get read message",
        SOCKET_GET_SEND_MESSAGE = "socket get send message",
        SOCKET_GET_DEL_MESSAGE = "socket get del message",
        SOCKET_SEND_UPDATE_GROUP = "socket send update group",
        SOCKET_GET_UPDATE_GROUP = "socket get update group",
        SOCKET_GET_REMOVE_GROUP = "socket get remove group",
        SOCKET_SEND_UPDATE_USER = "socket send update user",
        SOCKET_GET_UPDATE_USER = "socket get update user", 
        SOCKET_BROADCAST_CONNECT = "socket broadcast connect",
        SOCKET_BROADCAST_DISCONNECT = "socket broadcast disconnect";
    var CREATE_GROUP = "creat group",
        UPDATE_GROUP = "update group",
        REMOVE_GROUP = "remove group",
        LEAVE_GROUP = "leave group",
        UPDATE_GROUP_LOCAL = "update group local",
        UPDATE_USER_LOCAL = "update user local",
        ADD_CONTACT = "add contact",
        REMOVE_CONTACT = "remove contact",
        OUT_GROUP = "out group",
        UPDATE_AVATAR = "update avatar";
    var MESSAGE_OLD = "old",
        MESSAGE_NEW = "new",
        MESSAGE_READ = "read",
        MESSAGE_SENDER = "visitor_chat",
        MESSAGE_RECEIVER = "supporter_chat",
        MESSAGE_LIMIT = 10;
    var STORAGE_USER = "chat_user", // {userId,id}
        STORAGE_VERSION = "chat_version",
        STORAGE_PHANCAP = "chat_phancap", // luu cay phan cap danh muc
        STORAGE_CONTACT = "chat_contact", // luu tat ca cac contact: gan 2000 contact
        STORAGE_CURRENT = "chat_current", // [{id,type,title,state:{}}]
        STORAGE_RESET = true;
    var ONLINE = "online",
        OFFLINE = "offline";
    var CHAT_SERVER = option.server || "";
        MAX_LENGTH_FILE_UPLOAD = option.mlf || 10000000,
        CHAT_CONTACT_LEVEL = option.level || false;
    var TIMEOFFSET = 0;
    var GET_CONTACT_BY_ID = "get contact by id";
    var EMOTICON_BASIC_SHORTCUT     = ["(angel)","(laugh)","(smile)","(rofl)","(giggle)","(blush)","(cool)","(evilgrin)","(envy)",
                                        "(happy)","(kiss)","(hi)","(inlove)","(makeup)","(devil)","(clapping)","(crying)","(call)",
                                        "(talking)","(thinking)","(wait)","(headbang)","(rock)","(worried)","(yawn)","(heart)", "(brokenheart)",
                                        "(sun)","(rain)","(music)","(coffee)","(phone)", "(handshake)","(yes)", "(no)","(bomd)"],
        

        EMOTICON_BASIC_IMAGE        = ["angel","laugh","smile","rofl","giggle","blush","cool","evilgrin","envy",
                                        "happy","kiss","hi","inlove","makeup","devil","clapping","crying","call",
                                        "talking","thinking","wait","headbang","rock","worried","yawn","heart","brokenheart",
                                        "sun","rain","music","coffee","phone","handshake","yes","no","bomd"];
    

    var NOTIFY_FILE_LENGTH = " dung l&#432;&#7907;ng l&#7899;n h&#417;n 10M, file kh&ocirc;ng &#273;&#432;&#7907;c g&#7917;i &#273;i!",
        NOTIFY_ERROR_TAO_NHOM = "C&oacute; s&#7921; c&#7889; x&#7843;y ra khi t&#7841;o nh&oacute;m, vui l&ograve;ng th&#7917; l&#7841;i sau!",
        NOTIFY_ERROR_SUA_USER = "C&oacute; s&#7921; c&#7889; x&#7843;y ra khi c&#7853;p nh&#7853;t ng&#432;&#7901;i d&ugrave;ng, vui l&ograve;ng th&#7917; l&#7841;i sau!",
        NOTIFY_LEAVE_NHOM = "B&#7841;n &#273;&atilde; r&#7901;i kh&#7887;i nh&oacute;m ",
        NOTIFY_LEAVED_NHOM = " &#273;&atilde; r&#7901;i kh&#7887;i nh&oacute;m ",
        NOTIFY_JOIN_NHOM = "B&#7841;n &#273;&atilde; &#273;&#432;&#7907;c m&#7901;i v&agrave;o nh&oacute;m ",
        NOTIFY_JOINED_NHOM = " &#273;&atilde; &#273;&#432;&#7907;c m&#7901;i v&agrave;o nh&oacute;m ",
        NOTIFY_DELETE_NHOM = "Nh&oacute;m &#273;&atilde; b&#7883; x&oacute;a: ",
        NOTIFY_CHANGED_NAME = " &#273;&atilde; &#273;&#432;&#7907;c &#273;&#7893;i t&ecirc;n th&agrave;nh ",
        
        ASK_ERASE_MESSAGE_GROUP = "B&#7841;n c&oacute; mu&#7889;n x&oacute;a tin nh&#7855;n trong nh&oacute;m ",
        ASK_ERASE_MESSAGE_USER  = "B&#7841;n c&oacute; mu&#7889;n x&oacute;a tin nh&#7855;n v&#7899;i ",
        ACCEPT = "&#272;&#7891;ng &yacute;",
        REJECT = "H&#7911;y",
        CLOSE = "&#272;&oacute;ng",

        ADD_FRIEND_TO_CONTACT               = "Th&ecirc;m v&agrave;o danh s&aacute;ch c&aacute; nh&acirc;n",
        REMOVE_FRIEND_FROM_CONTACT          = "X&oacute;a kh&#7887;i danh s&aacute;ch c&aacute; nh&acirc;n",
        REMOVE_MESSAGE                      = "X&oacute;a tin nh&#7855;n",
        DELETE_GROUP                        = "Xo&aacute; nh&oacute;m",
        LEAVING_GROUP                       = "R&#7901;i nh&oacute;m",
        VIEW_INFO                           = "Xem th&ocirc;ng tin",
        LIST_GROUP                          = "Danh s&aacute;ch nh&oacute;m",
        UPDATE_MEMBER_GROUP                 = "C&#7853;p nh&#7853;t nh&oacute;m",
        REFRESH_GROUP                       = "L&agrave;m m&#7899;i nh&oacute;m",
        CANCEL_UPDATE_GROUP                 = "H&#7911;y c&#7853;p nh&#7853;t nh&oacute;m",
        UP_CHATBOX                          = "M&#7903; l&ecirc;n",
        DOWN_CHATBOX                        = "H&#7841; xu&#7889;ng",
        CLOSE_CHATBOX                       = "&#272;&oacute;ng",
        EDIT_NAME_GROUP                     = "Click &#273;&uacute;p &#273;&#7875; edit",
        FILE_ATTACH                         = "File &#273;&iacute;nh k&egrave;m",
        BTN_SEND_MESSAGE                    = "",
        CREATE_GROUP_TITLE                  = "T&#7841;o nh&oacute;m";

    var tooltipTemplate = '<div class="tooltip" role="tooltip" style="position:absolute"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
    var FILE_TYPE_FA = [
      ["fa-file-o","fa-file-word-o","fa-file-text-o","fa-file-pdf-o","fa-file-powerpoint-o","fa-file-excel-o","fa-file-image-o","fa-file-zip-o"],
      ["application/msword","application/rtf","application/vnd.oasis.opendocument.text","application/vnd.oasis.opendocument.spreadsheet"],
      ['text/plain','text/html','text/html','text/html','text/css','application/javascript','application/json','application/xml'],//text
      ['application/pdf'],//pdf
      ['application/vnd.ms-powerpoint'],//powerpoint
      ['application/vnd.ms-excel'],// excel
      ['image/png','image/jpeg','image/jpeg','image/jpeg','image/gif','image/bmp','image/vnd.microsoft.icon','image/tiff','image/tiff','image/svg+xml','image/svg+xml'],// image
      ['application/zip','application/x-rar-compressed','application/x-msdownload','application/x-msdownload','application/vnd.ms-cab-compressed']// zip
    ]
    var _user = user;
    var _timeoffline = function(offline) { 
        try {
            if(!offline)
                return '';
            var currentdate = new Date();
            var timeoff = parseInt((currentdate - offline) / 1000);
            if (timeoff >= 31536000) {// year
                return parseInt(timeoff / 31536000) + " n&#259;m";
            } else if (timeoff >= 2592000) { //month
                return parseInt(timeoff / 2592000) + " th&aacute;ng";
            } else if (timeoff >= 86400) { // day
                return parseInt(timeoff / 86400) + " ng&agrave;y";
            } else if (timeoff >= 3600) { // hour
                return parseInt(timeoff / 3600) + " gi&#7901;";
            } else if (timeoff >= 60) { // minute
                return parseInt(timeoff / 60) + " ph&uacute;t";
            } else { // second
                return parseInt(timeoff) + " gi&acirc;y";
            }
        } catch (exceptions) {
        return "";
        }
    };
    var _locdau = function(str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/^\-+|\-+$/g, "");k
        return str;
    };
    var _randomstring = function(L) {
        var s = '';
        var randomchar = function () {
            var n = Math.floor(Math.random() * 62);
            if (n < 10) return n; //1-10
            if (n < 36) return String.fromCharCode(n + 55); //A-Z
            return String.fromCharCode(n + 61); //a-z
        }
        while (s.length < L) s += randomchar();
        return s;
    };
    var _formatDate = function(date) {
        date = typeof date === 'number' ? new Date(date) : date;
        var ngay = ["Ch&#7911; nh&#7853;t", "Th&#7913; hai", "Th&#7913; ba", "Th&#7913; t&#432;", "Th&#7913; n&#259;m", "Th&#7913; s&aacute;u", "Th&#7913; b&#7843;y"];
        return ngay[date.getDay()] + ", ng&agrave;y " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    };
    var _formatTime = function(date) {
        date = typeof date === 'number' ? new Date(date) : date;
        var ngay = ["Ch&#7911; nh&#7853;t", "Th&#7913; hai", "Th&#7913; ba", "Th&#7913; t&#432;", "Th&#7913; n&#259;m", "Th&#7913; s&aacute;u", "Th&#7913; b&#7843;y"];
        return date.getHours()+":"+(date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());
    };
    var _compareDate = function(d,d2){
        d = typeof d === 'number' ? new Date(d) : d;
        d2 = typeof d2 === 'number' ? new Date(d2) : d2;
        return d.toDateString() === d2.toDateString();
    };
    var _localStorage = function(key,object){
        if(!localStorage)
            localStorage = {};
        localStorage[key] = JSON.stringify(object);
    };
    var _get_localStorage = function(key){
        if(!localStorage)
            localStorage = {};
        if(STORAGE_RESET && localStorage[key])
            return JSON.parse(localStorage[key]);
        return undefined;
    };
    var _queryGraphql = function(url,query,variables, callback){//'query={phancap{id,phancap{TenDonViCap1}}}'
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
        xhr.setRequestHeader("Access-Control-Allow-Credentials",true);
        xhr.setRequestHeader("Accept-Language","en-US,en;q=0.5");
        xhr.setRequestHeader("Access-Control-Allow-Origin","http://chatqlvb.mic.gov.vn/");
        xhr.onload = function () {
            callback(xhr.response);
        }
        xhr.send(JSON.stringify({query: query,variables:variables}));
    };
    var _uploadFileAttach = function(fd,callback){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('POST', CHAT_SERVER+'/api/upload', true);
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
            }
        };
        xhr.onload = function() {
            if (this.status == 200) {
                var resp = JSON.parse(this.response);
            };
        };
        xhr.send(fd);
    }
    var _updateGroup = function(group,action,callback){
        group.action = action;
        var variable = {"g":group};
        var query = "mutation UpdateGroup($g:groupInput){updateGroup(g:$g) {id,member,name,creater}}";
        _queryGraphql(CHAT_SERVER+"/graphql",query,variable,function(data){
            if(data.data.updateGroup){
                callback(data.data.updateGroup);
            }else{
                _callNoTify(NOTIFY_ERROR_TAO_NHOM);
            }
        })
    };
    var _updateUser = function(user,action,callback){
        user.action = action;
        var variable = {"u":user};
        var query = "mutation UpdateUser($u:userInput){updateUser(u:$u){id,userId,nickName,avatar,friends}}";
        _queryGraphql(CHAT_SERVER+"/graphql",query,variable,function(data){
            if(data.data.updateUser){
                callback(data.data.updateUser);
            }else{
                _callNoTify(NOTIFY_ERROR_SUA_USER);
            }
        })
    }
    var _loadData = function(user, contacts, online,recently,phancap,friends,groups,callback){ // true/false load thong tin tuong ung.
        var _this = this;
        var query = [];
        if(user){
                    query.push('user(q:\"'+user+'\"){id,userId,nickName,avatar,friends,recent{id,unread,last,type,del}}');
                }
        if(contacts)
            query.push('users(q:\"'+JSON.stringify({query:{},limit:3000}).replace(/"/g, '\\"')+'\"){id,nickName,last,avatar,last}')
        if(online)
            query.push('online');
        if(phancap)
            query.push('phancap{phanCap{TenDonVi,ThanhVien, DonViCon{TenDonVi,ThanhVien, DonViCon{TenDonVi,ThanhVien, DonViCon{TenDonVi,ThanhVien, DonViCon{TenDonVi,ThanhVien, DonViCon{TenDonVi,ThanhVien, DonViCon{TenDonVi,ThanhVien, DonViCon{TenDonVi,ThanhVien}  } }}}}}} }');
        if(groups)
            query.push('group(user:\"'+user+'\"){id,name,member,creater}')
        _queryGraphql(CHAT_SERVER+"/graphql","{"+query.join()+"}",undefined,function(data){
            callback(data.data);
        })
    };
    var _linkSource = function(link){
        return CHAT_SERVER+link;
    }
    var _imgEmoticon = function(emoticon){
        return "<img src=\""+_linkSource("/img/emoticon/"+emoticon+".gif")+"\"/>"
    }
    var _getFileTypeFA = function(mimetype){
        var r = "fa-file-o";
          for(var i =1;i<FILE_TYPE_FA.length;i++)
            for(var j=0;j<FILE_TYPE_FA[i].length;j++)
              if(FILE_TYPE_FA[i][j] == mimetype)
                r = FILE_TYPE_FA[0][i];
          return r;
    }
    var _showContentMessage = function(content){
        var dom = $("<div class=\"line_message\"><div class=\"content_message\"></div></div>");
        for(var i = 0;i<EMOTICON_BASIC_SHORTCUT.length;i++){
            var img = _imgEmoticon(EMOTICON_BASIC_IMAGE[i]);
            var ar = content.split(EMOTICON_BASIC_SHORTCUT[i]);
            content = ar.join(img);
        }
        dom.find(".content_message").append(content);
        
        if(dom.find(".content_message").text().trim() == '')
            dom.find(".content_message").css("background-color","white");
        if(dom.find("a.fileattach").length > 0 || dom.find("a.filetemp").length > 0){
            dom.find(".content_message").css("background-color","white");
            var link = dom.find("a.fileattach").attr("href");
            dom.find("a.fileattach").attr("href",CHAT_SERVER+link);
        }
        return dom;
    }
    var _loadUserNameFromId = function(id){
        var query = '{userById(q:\"'+id+'\"){userId}}';
        _queryGraphql(CHAT_SERVER+"/graphql",'{userById(q:\"'+id+'\"){userId}}',{},function(data){
            var username = data.data.userById.userId;
            window.open('http://thongtinnoibo.mic.gov.vn/Pages/thongtincanhan.aspx?taikhoan=' + username + '', 'name', 'height=400,width=600');
        });
    }
    var _sortText = function(a,b){
        if(_.last(a.split(' ')) < _.last(b.split(' '))){
            return -1;
        }else if(_.last(a.split(' ')) === _.last(b.split(' '))){
            if(a<b){
                return -1;
            }else{
                return 1;
            }
        }else{
            return 1;
        }
    }
    var _getAllThanhVien = function(donvi){
            if(donvi.DonViCon && donvi.DonViCon.length > 0){
                for(var i = 0; i < donvi.DonViCon.length; i ++){
                    donvi.ThanhVien.push(_getAllThanhVien(donvi.DonViCon[i]))
                }
            }
            return donvi.ThanhVien
        }
    var _contacts = {}; // contactId:{id, nickName, last, avatar, last, state}
    var _phancap = {}; // phancap:{ThanhVien,DonViCon}
    var _userOnline = [];
    var _groups = []; // [{id,name, member,creater}]
    var _dom = $("<div id='chatapp' class='chat-app'></div>");
    var modal = $("<div class='modal fade' tabindex='-1' role='dialog' data-backdrop=\"false\" aria-labelledby='mySmallModalLabel' style='top:100px'>"+
                "<div class='modal-dialog' role='document'>"+
                    "<div class='modal-content'>"+
                        "<div class='modal-body' style='padding: 10 20'>"+
                            "<p class='messageContent'></p>"+
                          "</div>"+
                      "<div class='modal-footer'>"+
                        "<a id='submitfocus' href=\"javascript:void(0)\" class='btn btn-default accept' data-dismiss='modal'>"+CLOSE+"</a>"+
                      "</div>"+
                "</div> </div> </div>");
    var modalConfirm = $("<div class='modal fade' tabindex='-1' role='dialog' data-backdrop=\"false\" style='top:100px'>"+
                              "<div class='modal-dialog' role='document'>"+
                                "<div class='modal-content'>"+
                                  "<div class='modal-body'>"+
                                    "<p class='messageContent'></p>"+
                                  "</div>"+
                                  "<div class='modal-footer'>"+
                                    "<a href=\"javascript:void(0)\" class='btn btn-default accept' data-dismiss='modal'>"+ACCEPT+"</a>"+
                                    "<a href=\"javascript:void(0)\" class='btn btn-default reject' data-dismiss='modal'>"+REJECT+"</a>"+
                                  "</div>"+
                                "</div>"+
                              "</div>"+
                            "</div>");
    var ChatBox = function(box, state) {
        this.box = box; // {id:"",type:"group|user",title:"",member:[]}
        this.membertemp = [];
        this.state = state ||   {
                                    show:true,
                                    full:true,
                                    online:false,
                                    new:0,
                                    title:"",
                                };
        this.box_head = $("<div class=\"live-hd\">"+
                                "<div class=\"pull-left visitor-name\"></div>"+
                                "<div class=\"pull-right\">"+
                                    "<a href=\"javascript:void(0)\" style=\"margin-right:7px\"><i class=\"fa fa-chevron-down\" title=\""+DOWN_CHATBOX+"\"></i></a>"+
                                    "<a href=\"javascript:void(0)\" style=\"margin-right:7px\"><i class=\"fa fa-chevron-up\" title=\""+UP_CHATBOX+"\"></i></a>"+
                                    "<a href=\"javascript:void(0)\"><i class=\"fa fa-remove\" title=\""+CLOSE_CHATBOX+"\"></i></a>"+
                                "</div>"+
                                "<div class=\"clearfix\"></div>"+
                            "</div>");
        this.box_content_top = $("<div class=\"live-ct-top\"></div>");
        this.btn_add_contact = $("<a href=\"javascript:void(0)\" title=\""+ADD_FRIEND_TO_CONTACT+"\"><i class=\"fa fa-plus fa-lg\"></i></a>");
        this.btn_info_contact = $("<a href=\"javascript:void(0)\" title=\""+VIEW_INFO+"\"><i class=\"fa fa-info fa-lg\"></i></a>");
        this.btn_minus_contact = $("<a href=\"javascript:void(0)\" title=\""+REMOVE_FRIEND_FROM_CONTACT+"\"><i class=\"fa fa-minus fa-lg\"></i></a>");
        this.btn_leave_group = $("<a href=\"javascript:void(0)\" title=\""+LEAVING_GROUP+"\"><i class=\"fa fa-sign-out fa-lg\"></i></a>");
        this.btn_remove_group = $("<a href=\"javascript:void(0)\" title=\""+DELETE_GROUP+"\"><i class=\"fa fa-trash-o fa-lg\"></i></a>");
        this.btn_erase_message = $("<a href=\"javascript:void(0)\" title=\""+REMOVE_MESSAGE+"\"><i class=\"fa fa-eraser fa-lg\"></i></a>");
        this.box_content_search = $("<div class=\"live-search\">"+
                                        "<i class=\"fa fa-search\"></i>"+
                                        "<input type=\"text\" placeholder=\"T&igrave;m ki&#7871;m\">"+
                                    "</div>");
        this.box_content_emoticon = $("<div class=\"live-emoticon\"></div>");
        this.emoticon_box = $("<div class=\"emoticon-box\">"+
                                "<div class=\"box-detail\"><span class=\"shortcut\"/></div>"+
                                "<div class=\"box-list\"></div>"+
                            "</div>");
        this.box_content_input = $("<div class=\"live-chat-ft\">"+
                                        "<div class=\"textarea\">"+
                                            "<textarea placeholder=\"Nh&#7853;p n&#7897;i dung\"></textarea>"+
                                        "</div>"+
                                        "<button class=\"btn-submit\">G&#7917;i</button>"+
                                        "<a href=\"javascript:void(0)\" class=\"btn-attach\" title=\""+FILE_ATTACH+"\"><i class=\"fa fa-paperclip fa-lg\"></i></a>"+
                                        "<input type=\"file\" class=\"fu\" style=\"display:none\" name=\"fileattach\" multiple/>"+
                                    "</div>");
        this.box_content = $("<div class=\"live-ct\"></div>");
        this.box_content_chat = $("<div class=\"live-chat\"></div>");
        this.box_group_add_user = $("<div class=\"content-adduser\">"+
                                        "<a href=\"javascript:void(0)\" class=\"btn-creategroup\" title=\""+LIST_GROUP+"\"><i class=\"fa fa-check fa-lg ga\"></i></a>"+
                                        "<a href=\"javascript:void(0)\" class=\"btn-refresh\" title=\""+REFRESH_GROUP+"\"><i class=\"fa fa-refresh fa-lg ga\"></i></a>"+
                                        "<a href=\"javascript:void(0)\" class=\"btn-cancel\" title=\""+CANCEL_UPDATE_GROUP+"\"><i class=\"fa fa-close fa-lg ga\"></i></a>"+
                                        "<a href=\"javascript:void(0)\" class=\"btn-add\" title=\""+UPDATE_MEMBER_GROUP+"\"><i class=\"fa fa-group fa-lg\"></i></a>"+
                                        "<div class=\"content\">"+
                                            "<div class=\"select-box\">"+
                                                "<select class=\"js-multiple\" data-placeholder=\"Th&ecirc;m th&agrave;nh vi&ecirc;n...\" multiple tabindex=\"3\"></select>"+
                                            "</div>"+
                                        "</div>"+
                                    "</div>");
        this.wrap = $("<div class=\"chat-box\"></div>");
        this.dom = $("<div class=\"chat-div\"></div>");
        this.search_btnRefresh = {};
        this.messages = [];// { from: _user.id, toGroup: _this.box.id, content: content };
        this.messageTemp = {};
        this.dates = []; // {date: "", dom: $};
        this._typeEmoticon = "";
        this.setState = function(state){ // set state for object.
            var _this = this;
            _this.state = _.assign(_this.state,state);
            _this.dom.removeClass("hidden");
            if(_this.state.show == false){
                _this.dom.addClass("hidden");
            }
            _this.box_content.removeClass("in");
            _this.box_head.find("a i.fa-chevron-down").addClass("hidden")
            _this.box_head.find("a i.fa-chevron-up").removeClass("hidden");
            _this.box_head.find(".btnclose-min").removeClass("open");
            if(_this.state.full){
                _this.box_content.addClass("in");
                _this.box_head.find("a i.fa-chevron-up").addClass("hidden")
                _this.box_head.find("a i.fa-chevron-down").removeClass("hidden");
            };
            _this.box_head.find(".online").remove();
            if(_this.state.online){
                _this.box_head.prepend("<span class=\"online pull-left\"></span>")
            }
        };
        this.displayMessage = function(message,idtemp, scroll){
            var _this = this;
            if(message.idtemp){
                _this.messageTemp[idtemp] = message;
            }
            if(idtemp && _this.messageTemp[idtemp]){ // update message exist by idtemp.
                _this.messageTemp[idtemp].dom = _showContentMessage(message.content);
                return;
            }
            message.time = message.time || new Date() - TIMEOFFSET;
            var date = _formatDate(message.time);
            
            var indexDate = _.findIndex(_this.dates, function(d){
                return _compareDate(d.date,message.time);
            });
            if(indexDate == -1){
                var dateDom = $("<time class=\"text-right\">"+date+"</time>");
                if(!_.last(_this.dates) || message.time > _.last(_this.dates).date){  
                    _this.box_content_chat.append(dateDom);
                    _this.dates.push({date:message.time,dom:dateDom});
                }else{
                    _this.box_content_chat.prepend(dateDom);
                    _this.dates.splice(0,0,{date:message.time,dom:dateDom});
                }
            }

            if(!message.dom){// make dom.
                if(message.from === "system")
                    message.dom = $("<span class=\"system-notify\">"+message.content+"</span>");
                else
                    message.dom = _showContentMessage(message.content);
            }
            message.dom.find(".content_message").tooltip({"title":_formatTime(message.time),"placement":"left"})
            
            // find index message in messages.
            var indexMessage = _.findIndex(_this.messages,function(m){
                return m.time > message.time;
            });
            var lineSender = $("<div class=\"line_message\"><div class=\"content_message\" style=\"background-color: white; padding: 0px; color: gray; font-style: italic; \">"+_contacts[message.from].nickName+"</div></div>")
            if( indexMessage == -1){ // new message
                if(_.last(_this.messages) && _.last(_this.messages).from == message.from && indexDate !== -1){ 
                    _.last(_this.messages).dom.after(message.dom);
                }else{ // index == -1
                    // tao 1 domarea message moi
                    if(message.from == _user.id){
                        var d = $("<div class=\""+MESSAGE_SENDER+"\"></div>");
                        d.append(message.dom);
                        _this.box_content_chat.append(d);
                    }else if(message.from === "system"){
                        _this.box_content_chat.append(message.dom);
                    }else{
                        var d = $("<div class=\""+MESSAGE_RECEIVER+"\">"+
                                    "<div class=\"avatar\">"+
                                        "<img src=\""+(_contacts[message.from].avatar || AVATAR_DEFAULT)+"\">"+
                                    "</div> </div>");
                        if(_this.box.type === "group")
                            d.append(lineSender)
                        
                        d.append(message.dom);
                        _this.box_content_chat.append(d);
                    }
                }
                
                _this.messages.push(message);
            }
            else{ // old message 
                if(_this.messages[indexMessage].from === message.from && indexDate !== -1){
                    _this.messages[indexMessage].dom.before(message.dom);
                }else{
                    if(message.from == _user.id){
                        var d = $("<div class=\""+MESSAGE_SENDER+"\"></div>");
                        d.append(message.dom);
                        _this.dates[0].dom.after(d);
                    }else if(message.from === "system"){
                        _this.dates[0].dom.after(message.dom);
                    }
                    else{
                        var d = $("<div class=\""+MESSAGE_RECEIVER+"\">"+
                                    "<div class=\"avatar\">"+
                                        "<img src=\""+(_contacts[message.from].avatar || AVATAR_DEFAULT)+"\">"+
                                    "</div> </div>");
                        if(_this.box.type === "group")
                            d.append(lineSender)
                        d.append(message.dom);
                        _this.dates[0].dom.after(d);
                    }
                }
                _this.messages.splice(indexMessage,0,message);
            }
            if(scroll){// scroll
                _this.box_content_chat.scrollTop(10000000000);
            }else{
                
            }
        };
        this.scrollMessage = function(messageId){ // calculate offset of message in box_content_chat
        };
        this.createMessage = function (content,idtemp) { // 
            var _this = this;
            if(_this.box.type == "group")
                return { idtemp: idtemp||_randomstring(8), from: _user.id, toGroup: _this.box.id, content: content };
            return { idtemp: idtemp||_randomstring(8), from: _user.id, toUser: _this.box.id, content: content};    
        };
        this.loadMessage = function(messageOld){
            var _this = this;
            var time = undefined;
            var sort = {time : -1};

            if(messageOld){ // load message old. history 
                var date = _.first(_this.messages) ? _.first(_this.messages).time : undefined;
                time = {$lt:date};
            }
            if(_user.recent && _user.recent.length > 0){
                var i = _.findIndex(_user.recent,{id:_this.box.id});
                if(i != -1 && _user.recent[i].del){
                    time = _.assign(time,{$gt:_user.recent[i].del});
                }
            }
            if(_this.box.type == "group"){ // load messages group.
                var query = {query:{ toGroup: _this.box.id},page:0,limit:MESSAGE_LIMIT};
                if(time) 
                    query.query.time = time;
                query.sort = sort;
                var field = "id, content, time, state, from, toGroup"; // full
                _queryGraphql(CHAT_SERVER+"/graphql",'{message(q:\"'+JSON.stringify(query).replace(/"/g, '\\"')+'\"){'+field+'}}',{},function(data){

                    var messages = data.data.message || [];
                    messages.forEach(function(message){
                        message.time = parseInt(message.time);
                        var scroll = messageOld ? false : true;
                        _this.displayMessage(message,undefined,scroll);
                    });
                });
            }else{// load messages user
                var query = {query:{ $or:[{toUser:_user.id,from:_this.box.id},{toUser:_this.box.id,from:_user.id}]},page:0,limit:MESSAGE_LIMIT};
                if(time) 
                    query.query.time = time;
                query.sort = sort;
                var field = "id, content, time, state, from, toUser"; // full
                _queryGraphql(CHAT_SERVER+"/graphql",'{message(q:\"'+JSON.stringify(query).replace(/"/g, '\\"')+'\"){'+field+'}}',undefined,function(data){
                    var messages = data.data.message || [];
                    messages.forEach(function(message){
                        message.time = parseInt(message.time);
                        var scroll = messageOld ? false : true;
                        _this.displayMessage(message,undefined,scroll);
                    });
                });
            }
        };
        this.delRefresh = function(data){
            var _this = this;
            _this.messages = [];// { from: _user.id, toGroup: _this.box.id, content: content };
            _this.messageTemp = {};
            _this.dates = []; // {date: "", dom: $};
            _this.dom.find(".live-chat").empty();

            if(_user.recent && _user.recent.length > 0){
                var i = _.findIndex(_user.recent,{id:_this.box.id});
                if(i != -1){
                    _user.recent[i].del = data.time;
                }else{
                    _user.recent.push({id:_this.box.id,del: data.time,type:_this.box.type});
                }
            }
            _this.loadMessage();
        }
        this.updateBox = function(box){
            var _this = this;
            _this.box = _.clone(box);
            _this.box_head.find(".visitor-name").html(_this.box.title);
            if(box.type === "group"){
                _this.search_btnRefresh.click();
            }
        };
        this.loadEmoticonBox = function(typeEmoticon){
            var _this = this;
            if(_this._typeEmoticon == typeEmoticon)
                return;
            if(typeEmoticon == "base"){
                var eList = _this.emoticon_box.find(".box-list");
                var eImage = _this.emoticon_box.find(".box-detail").find("img");
                var eShortcut = _this.emoticon_box.find(".shortcut");
                for(var i = 0; i< EMOTICON_BASIC_IMAGE.length;i++){
                    var em = $("<img src=\""+_linkSource("/img/emoticon/"+EMOTICON_BASIC_IMAGE[i]+".png")+"\" class=\"emoticon-item\"/>");
                    em.hover(function(){
                        var el = _.last($(this).attr("src").split('/')).split('.')[0];
                        var en = _.indexOf(EMOTICON_BASIC_IMAGE,el);
                        $(this).css("border","1px solid #3584d1");
                        _this.emoticon_box.find(".box-detail").find("img").remove();
                        _this.emoticon_box.find(".box-detail").prepend(_imgEmoticon(el));
                        eShortcut.html(EMOTICON_BASIC_SHORTCUT[en]);
                    },function(){
                        $(this).css("border","none");
                    });
                    em.click(function(){
                        
                        var el = _.last($(this).attr("src").split('/')).split('.')[0];
                        var en = _.indexOf(EMOTICON_BASIC_IMAGE,el);
                        var textinput = _this.box_content_input.find("textarea");
                        textinput.val(textinput.val()+EMOTICON_BASIC_SHORTCUT[en]);
                        
                        _this.emoticon_box.toggle();
                        textinput.focus();
                    });
                    eList.append(em);
                }
                _this._typeEmoticon = typeEmoticon;
            }
        };
        this.init = function () {
            var _this = this;
            _this.box_head.find("i").tooltip({"placement":"left","template":tooltipTemplate});


            _this.btn_add_contact.tooltip({"placement":"bottom"});
            _this.btn_minus_contact.tooltip({"placement":"bottom"});
            _this.btn_info_contact.tooltip({"placement":"bottom"});
            _this.btn_erase_message.tooltip({"placement":"bottom"});
            _this.btn_leave_group.tooltip({"placement":"bottom"});
            _this.btn_remove_group.tooltip({"placement":"bottom"});


            _this.wrap.append(_this.box_head)
            _this.box_content.append(_this.box_content_top);
            _this.box_content.append(_this.box_content_chat);
            // _this.box_content.append(_this.box_content_search);
            _this.box_content.append(_this.box_content_emoticon);
            _this.box_content.append(_this.box_content_input);
            if(_this.box.type === "group"){
                var selectBox = _this.box_group_add_user.find(".js-multiple");
                
                _this.membertemp = _.clone(_this.box.member);
                // init group option
                _.forEach(_contacts,function(u,k){
                    var selected = "";
                    if(_this.box.member.indexOf(u.id) !== -1){
                        selected = "selected=\"true\"";
                    }
                    selectBox.append("<option value=\""+u.id+"\" "+ selected +">"+ u.nickName+ "</option>");
                });
                var chosenOpt = {
                    disable_search_threshold: 10,
                    no_results_text: "Kh&ocirc;ng ph&ugrave; h&#7907;p!",
                    width: "100%"
                }
                var creater = false;
                if(_this.box.creater && _this.box.creater === _user.id){
                    var groupName =_this.box_head.find(".visitor-name");
                    groupName.on('dblclick',function(){
                        $(this).attr("contenteditable",true);
                        var bn = $(this).html();
                        $(this).addClass("edit-title");
                        $(this).off('keydown');
                        $(this).keydown(function (e) { 
                            if (e.which == 13) {
                                e.preventDefault();
                                if ($(this).html().trim() !== '' ) {
                                    _updateGroup({id:_this.box.id,title:$(this).text().trim()},UPDATE_GROUP,function(group){});
                                    $(this).attr("contenteditable","false");
                                    $(this).removeClass("edit-title");
                                }else{
                                    $(this).html(bn);
                                    $(this).attr("contenteditable","false");
                                    $(this).removeClass("edit-title");
                                }
                            }
                        });
                        $(this).focus();
                    });
                    this.box_group_add_user.find("a").tooltip({"placement":"bottom"});
                    chosenOpt.allow_single_deselect = true;
                    creater = true;
                }
                else{
                    this.box_group_add_user.find(".content").addClass("no-remove-user");
                }
                selectBox.chosen(chosenOpt);
                selectBox.chosen().change(function(root,oc){
                    if(oc.selected){
                        _this.membertemp.push(oc.selected);
                    }
                    if(oc.deselected){
                        _.pull(_this.membertemp,oc.deselected);
                    }
                });
                var search_adduser = _this.box_group_add_user.find(".btn-add");
                var search_content = _this.box_group_add_user.find(".content");
                var search_btnCancle = _this.box_group_add_user.find(".btn-cancel");
                var search_btnUpdate = _this.box_group_add_user.find(".btn-creategroup");
                _this.search_btnRefresh = _this.box_group_add_user.find(".btn-refresh");

                search_adduser.click(function(){
                    search_content.addClass("view-adduser");
                    _this.box_content_top.find(".ga").fadeIn(1000).css("display","inline-block");
                });
                search_btnCancle.click(function(){
                    search_content.removeClass("view-adduser");
                    _this.box_content_top.find(".ga").fadeOut(1000);
                    _this.membertemp = _.clone(_this.box.member);
                    selectBox.find("option").each(function(){
                        $(this).removeAttr("selected");
                        if(_this.box.member.indexOf($(this).val()) !== -1)
                            $(this).prop("selected", true);
                    });
                    selectBox.trigger("chosen:updated");
                });
                search_btnUpdate.click(function(){
                    search_content.removeClass("view-adduser");
                    _this.box_content_top.find(".ga").fadeOut(1000); 
                    var memberUpdate = creater?_this.membertemp:_.union(_this.membertemp,_this.box.member);
                    _updateGroup({id:_this.box.id,member:memberUpdate},UPDATE_GROUP,function(g){
                        search_content.removeClass("view-adduser");
                        _this.box_content_top.find(".ga").fadeOut(1000); 
                    });
                });
                _this.search_btnRefresh.click(function(){
                    _this.membertemp = _.clone(_this.box.member);
                    selectBox.find("option").each(function(){
                        $(this).removeAttr("selected");
                        if(_this.box.member.indexOf($(this).val()) !== -1)
                            $(this).prop("selected", true);
                    });
                    selectBox.trigger("chosen:updated");
                });
                _this.btn_leave_group.click(function(){
                    _this.box.member.splice(_.indexOf(_this.box.member,_user.id),1);
                    _updateGroup({id:_this.box.id,member:_this.box.member},UPDATE_GROUP,function(g){
                        _this.state.show = false; // an box chat.
                        _callback(LEAVE_GROUP,g);
                    });
                });

                _this.box_content_top.append(_this.btn_leave_group);
                if(creater){
                    _this.btn_remove_group.click(function(){
                        _updateGroup({id:_this.box.id},REMOVE_GROUP,function(g){});
                    });
                    _this.box_content_top.append(_this.btn_remove_group);    
                }
                _this.box_content_top.append(_this.box_group_add_user);

                _this.btn_erase_message.click(function(){
                    _callConfirm(ASK_ERASE_MESSAGE_GROUP+_this.box_head.find(".visitor-name").text().trim(),function(){
                        _callback(SOCKET_SEND_DEL_MESSAGE,{id:_user.id,boxId:_this.box.id});
                    })
                });
                _this.box_content_top.append(_this.btn_erase_message);
            }else{
                _this.box.title = _contacts[_this.box.id].nickName;
                _this.btn_info_contact.click(function(){
                    _loadUserNameFromId(_this.box.id);
                    // window.open('http://thongtinnoibo.mic.gov.vn/Pages/thongtincanhan.aspx?taikhoan=' + _loadUserNameFromId(_this.box.id) + '', 'name', 'height=400,width=600');
                });
                _this.box_content_top.append(_this.btn_info_contact);
                _this.btn_minus_contact.click(function(){
                    _updateUser({id:_user.id,contactId:_this.box.id},REMOVE_CONTACT,function(user){
                        _callback(CHATBOX_UPDATE_CONTACT,user);
                        _this.btn_minus_contact.fadeOut(1000);
                        _this.btn_add_contact.fadeIn(1000).css("display","inline-block");
                    });
                });
                _this.btn_add_contact.click(function(){
                    _updateUser({id:_user.id,contactId:_this.box.id},ADD_CONTACT,function(user){
                        _callback(CHATBOX_UPDATE_CONTACT,user);
                        _this.btn_add_contact.fadeOut(1000);
                        _this.btn_minus_contact.fadeIn(1000).css("display","inline-block");
                    });
                });
                _this.box_content_top.append(_this.btn_minus_contact);
                _this.box_content_top.append(_this.btn_add_contact);
                if(_user.friends.indexOf(_this.box.id) !== -1){
                    _this.btn_add_contact.css("display","none");
                }else{
                    _this.btn_minus_contact.css("display","none");
                }
                _this.btn_erase_message.click(function(){
                    _callConfirm(ASK_ERASE_MESSAGE_USER+_contacts[_this.box.id].nickName,function(){
                        _callback(SOCKET_SEND_DEL_MESSAGE,{id:_user.id,boxId:_this.box.id});
                    })
                });
                _this.box_content_top.append(_this.btn_erase_message);
            }
            _this.box_head.find(".visitor-name").html(_this.box.title);
            _this.wrap.append(_this.box_content);
            _this.dom.append(_this.wrap);
            _this.setState();

            _this.box_content_chat.scroll(function(){
                if ($(this).scrollTop() === 0) {
                    _this.loadMessage(true);
                }
            });
            var btnUp = _this.box_head.find("a i.fa-chevron-up");
            btnUp.on('click',function(){
                _this.state.full = true;
                _this.setState();
                _callback(CHATBOX_CLOSE);
            });
            var btnDown = _this.box_head.find("a i.fa-chevron-down");
            btnDown.on('click',function(){
                _this.state.full = false;
                _this.setState();
                _callback(CHATBOX_CLOSE);
            });

            var btnClose = _this.box_head.find("a .fa-remove");

            btnClose.on('click',function(e){
                _this.state.show = false;
                _this.setState();
                _callback(CHATBOX_CLOSE);
            });
            //emoticon
            var emoticonBasic = $("<img src=\""+_linkSource("/img/emoticon/smile.png")+"\" class=\"emotion-bar\" />");
            emoticonBasic.click(function(){
                _this.loadEmoticonBox("base");
                _this.emoticon_box.toggle();
            });
            _this.box_content_emoticon.append(emoticonBasic);
            _this.box_content_emoticon.append(_this.emoticon_box);

            var textinput = _this.box_content_input.find("textarea");
            textinput.keydown(function (e) { 
                if (e.keyCode == 13 && e.shiftKey) {
                    var html = $(this).val();
                    $(this).val(html + "\n");
                    e.stopPropagation();
                    return;
                }
                if (e.which == 13) {
                    e.preventDefault();
                    if ($(this).val() !== '' ) {
                        var data = _this.createMessage($(this).val());
                        _callback(CHATBOX_SEND_MESSAGE, data);
                        $(this).val("");
                        _this.displayMessage(data,undefined,true);   
                    }
                }
            });
            textinput.focus(function () {
                if(_user.recent && _user.recent.length > 0){
                    var i = _.findIndex(_user.recent,{id:_this.box.id});
                    if(i != -1 && _user.recent[i].unread > 0){
                        _callback(SOCKET_SEND_READ_MESSAGE,{id:_user.id,boxId:_this.box.id});
                    }
                }
            });
            textinput.focus();
            var btnGui = _this.box_content_input.find("button.btn-submit");
            btnGui.click(function(e) {
                e.preventDefault();
                if (textinput.val() !== '' ) {
                    var data = _this.createMessage(textinput.val());
                    _callback(CHATBOX_SEND_MESSAGE, data);
                    textinput.val("");
                    _this.displayMessage(data,undefined,true);   
                }
            });
            var fileInput = _this.box_content_input.find('input[type="file"]');
            fileInput.change(function(){
                var __this = this;
                var files = $(__this).prop('files');
                var fd = new FormData();
                var fc =0;
                for(var i =0; i < files.length; i ++){
                    if(files[i].size <= MAX_LENGTH_FILE_UPLOAD){
                        var temp = _randomstring(8);
                        fd.append("recfiles", files[i]);
                        fd.append("temp",temp);
                        fc ++;
                    }else{
                        _callNoTify(files[i].name + NOTIFY_FILE_LENGTH)
                    }
                }
                if(fc >  0)
                    {
                        fd.append('from',_user.id);
                        if(_this.box.type == "group")
                            fd.append('toGroup',_this.box.id)
                        else
                            fd.append('toUser',_this.box.id);
                        _uploadFileAttach(fd,function(){
                            
                        })
                    }
                $(__this).val("");
            })
            var btnFileAttach = _this.box_content_input.find(".btn-attach");
            btnFileAttach.click(function(e){
                fileInput.click();
            });
            _this.loadMessage();
            return _this;
        };
        return this.init();
    };
    var ChatContact = function(state, title){
        this.state = state || {
                                tab:0,
                                full: false
                                };
        this.title = title;
        // this.recentlyLocal = {};
        this.contactDom = {};//contactId:{online:$,recently:$,friends:$,phancap:[$],nhom:[$]}};
        this.onlineDom = {};
        this.friendDom = {};
        this.recentDom = {};
        this.nhomDom = {}; // nhomId:{[contactId]}
        this.listDom = {};
        // *** contructor ChatContact DOM
        this.contact_head = $("<div class=\"live-hd\">"+
                                "<div class=\"pull-left visitor-name\">"+this.title+"</div>"+
                                "<div class=\"pull-right\">"+
                                    "<a href=\"javascript:void(0)\" class=\"btn-addgroup\" style=\"margin-right:10px\"><i class=\"fa fa-plus\" title=\""+CREATE_GROUP_TITLE+"\"></i></a>"+
                                    "<a href=\"javascript:void(0)\" class=\"btnclose-min\"><i class=\"fa fa-chevron-down\" title=\""+DOWN_CHATBOX+"\"></i><i class=\"fa fa-chevron-up\" title=\""+UP_CHATBOX+"\"></i></a>"+
                                "</div>"+
                                "<div class=\"clearfix\"></div>"+
                            "</div>");
        this.contact_content = $("<div class=\"live-ct\"></div>");

        this.contact_tab_nav = CHAT_CONTACT_LEVEL ?
                                $("<ul class=\"nav nav-tabs\">"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-online\">Online</a></li>"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-recently\">G&#7847;n &#273;&acirc;y</a></li>"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-phancap\">Ph&acirc;n c&#7845;p</a></li>"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-friend\">C&aacute; nh&acirc;n</a></li>"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-nhom\">Nh&oacute;m</a></li>"+
                                "</ul>"):
                                $("<ul class=\"nav nav-tabs\">"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-online\">Online</a></li>"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-recently\">G&#7847;n &#273;&acirc;y</a></li>"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-danhsach\">Danh s&aacute;ch</a></li>"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-friend\">C&aacute; nh&acirc;n</a></li>"+
                                    "<li><a data-toggle=\"tab\" href=\"#tab-nhom\">Nh&oacute;m</a></li>"+
                                "</ul>");
        this.contact_tab_content = $("<div class=\"tab-content\"></div>");
        this.contact_tab_online = $("<div id=\"tab-online\" class=\"tab-pane fade\"></div>");
        this.contact_tab_recent = $("<div id=\"tab-recently\" class=\"tab-pane fade\"></div>");
        
        this.contact_tab_phancap = $("<div id=\"tab-phancap\" class=\"tab-pane fade\"></div>");

        this.contact_tab_danhsach = $("<div id=\"tab-danhsach\" class=\"tab-pane fade\"></div>");

        this.contact_tab_friend = $("<div id=\"tab-friend\" class=\"tab-pane fade\"></div>");
        this.contact_tab_nhom = $("<div id=\"tab-nhom\" class=\"tab-pane fade\"></div>");
        // this.tab = [this.contact_tab_online,this.contact_tab_phancap,this.contact_tab_friend,this.contact_tab_nhom];
        this.tab = CHAT_CONTACT_LEVEL ?
        [this.contact_tab_online,
        this.contact_tab_recent,this.contact_tab_phancap,this.contact_tab_friend,this.contact_tab_nhom]:
        [this.contact_tab_online,
        this.contact_tab_recent,this.contact_tab_danhsach,this.contact_tab_friend,this.contact_tab_nhom];
        this.contact_content_search = $("<div class=\"live-search\">"+
                                            "<i class=\"fa fa-search\"></i>"+
                                            "<input type=\"text\" placeholder=\"T&igrave;m ki&#7871;m\">"+
                                        "</div>");
        this.wrap = $("<div class=\"chat-box\"></div>");
        this.dom = $("<div class=\"chat-div\"></div>");
        this.domStore = $("<div></div>");
        this.setState = function(state){
            var _this = this;
            _this.state = _.assign(_this.state,state);
            _this.contact_content.removeClass("in");
            _this.contact_head.find(".btnclose-min").removeClass("open");
            if(_this.state.full){
                _this.contact_content.addClass("in");
                _this.contact_head.find(".btnclose-min").addClass("open");
            }
            _this.contact_tab_nav.find("li").eq(_this.state.tab).click();
            if(!_this.contact_tab_nav.find("li").eq(_this.state.tab).hasClass("active")){
                _this.contact_tab_nav.find("li").eq(_this.state.tab).addClass("active");
                _this.tab[_this.state.tab].removeClass("fade").addClass("active");
            }
        };
        this.getState = function(){
            var _this = this;
            return _this.state;
        };
        // *** contructor element
        this.createContactor = function(id,pc){
            var _this = this;
            var contact = _contacts[id]
            if(!contact || (id == _user.id && pc != "phancap")){
                return undefined;
            }
            var avatar = contact.avatar && contact.avatar != "" ? contact.avatar : AVATAR_DEFAULT;
            var contactor = $("<div class=\""+MESSAGE_RECEIVER+"\">"+
                                "<div class=\"avatar\"><img src=\""+avatar+"\"></div>"+
                                "<div class=\"status\"><span class=\""+contact.state+"\">"+_timeoffline(contact.last)+"</span></div>"+
                                "<div class=\"supporter\">"+
                                    "<div class=\"name\">"+contact.nickName+"</div>"+
                                    "<div class=\"text\">"+contact.status||""+"</div>"+
                                "</div>"+
                            "</div>");
            contactor.click(function(){
                _callback(CHATCONTACT_CALL_INSTANCE,{type:"user",id:id,title:contact.nickName});
            });
            if(!_this.contactDom[id])
                _this.contactDom[id] = [];
            _this.contactDom[id].push(contactor);
            return contactor;
        };
        this.contactor = function(id,tab){ // create or update contactor.
            var _this = this;
            var contact = _contacts[id]
            if(!contact || (id == _user.id && tab != "phancap")){
                return undefined;
            }
            if(tab == "online"){
                if(_this.onlineDom[id])
                    _this.updateContactor(id,_this.onlineDom[id]);
                else
                    _this.onlineDom[id] = _this.createContactor(id);
                return _this.onlineDom[id];
            }
            if(tab == "friend"){
                if(_this.friendDom[id])
                    _this.updateContactor(id,_this.friendDom[id]);
                else
                    _this.friendDom[id] = _this.createContactor(id);
                return _this.friendDom[id];
            }
            if(tab == "list"){
                if(_this.listDom[id])
                    _this.updateContactor(id,_this.listDom[id]);
                else
                    _this.listDom[id] = _this.createContactor(id);
                return _this.listDom[id];
            }
            if(tab == "recent"){
                if(_this.recentDom[id])
                    _this.updateContactor(id,_this.recentDom[id]);
                else
                    _this.recentDom[id] = _this.createContactor(id);
                return _this.recentDom[id];
            }
            var dom = _this.createContactor(id,tab);
            if(tab == "phancap" && id == _user.id)
                dom.addClass("hidden");
            return dom;
        };
        this.nhomContactor = function(id,idmember,recent){
            var _this = this;
            var contact = _contacts[idmember]
            if(!contact || idmember == _user.id){
                return undefined;
            }
            if(recent){
                if(_this.recentDom[id][idmember]){
                    _this.updateContactor(idmember,_this.recentDom[id][idmember]);}
                else{
                    _this.recentDom[id][idmember] = _this.createContactor(idmember);
                }
                return _this.recentDom[id][idmember];
            }else if(_this.nhomDom[id]){
                if(_this.nhomDom[id][idmember]){
                    _this.updateContactor(idmember,_this.nhomDom[id][idmember]);}
                else{
                    _this.nhomDom[id][idmember] = _this.createContactor(idmember);
                }
                return _this.nhomDom[id][idmember];
            }
        };
        this.groupDom = function(group,recent){ // {id,member,title}
            var _this = this;
            if(recent){
                if(!_this.recentDom[group.id])
                    _this.recentDom[group.id] = {};
            }else if(!_this.nhomDom[group.id]){
                _this.nhomDom[group.id] = {};
            }
            var groupDom = _this.panelCollapor(group.name);
            group.member.forEach(function(m){
                groupDom.panelContent.append(_this.nhomContactor(group.id,m,recent));
            });
            groupDom.panel.dblclick(function(){
                _callback(CHATCONTACT_CALL_INSTANCE,{type:"group",id:group.id,title:group.name,member:group.member,creater:group.creater});
            });
            return groupDom.panel;
        };
        this.panelCollapor = function(title, id){
            var _this = this;
            var pid = id || _randomstring(19);
            var panel = $("<div class=\"panel panel-default guid-blok\">"+
                                "<div class=\"panel-heading\">"+
                                    "<a class=\"collapsed\" data-toggle=\"collapse\" data-parent=\"#expan\" href=\"#"+pid+"\" aria-expanded=\"true\" aria-controls=\"collapseOne\">"+
                                        "<i class=\"fa fa-group fa-lg\"></i>"+
                                        "<strong>"+title+"</strong>"+
                                    "</a>"+
                                "</div></div>");
            var panelContent = $("<div id=\""+pid+"\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingOne\" aria-expanded=\"true\"></div>");
            panel.append(panelContent);
            return {panel:panel,panelContent:panelContent};
        };
        this.updateContactor = function(id,dom){
            var _this = this;
            var avatar = _contacts[id].avatar && _contacts[id].avatar != "" ?_contacts[id].avatar : AVATAR_DEFAULT;
            dom.find(".avatar img").attr("src",avatar);
            dom.find(".status span").remove();
            dom.find('.status').append("<span class=\""+_contacts[id].state+"\">"+_timeoffline(_contacts[id].last)+"</span>");
            dom.find(".supporter .name").html(_contacts[id].nickName);
            dom.find(".supporter .text").html(_contacts[id].status);
        };
        this.updateContact= function(id){
            var _this = this;
            if(_this)
            if(_this.contactDom[id]){
                _this.contactDom[id].forEach(function(dom){
                    _this.updateContactor(id,dom)
                });
                if(_contacts[id].state == ONLINE){// update tab online
                    _this.contact_tab_online.find(".live-chat.list.contact-chat").prepend(_this.contactor(id,"online"));
                }else{
                    if(_this.onlineDom[id])
                        _this.domStore.append(_this.onlineDom[id]);
                }
            }
        };
        this.loadRecent = function(recent){ // [{id,type:"group|user"}]
            var _this = this;
            _this.wrap.find(".number").remove();
            for(var key in _this.recentDom){
                if(_this.recentDom[key] instanceof $){// contact
                    _this.domStore.append(_this.recentDom[key]);
                }else{// group
                    for(var k in _this.recentDom[key])
                        _this.domStore.append(_this.recentDom[key][k]);
                }
            }
            if(_this.contact_tab_recent.find(".live-chat").length == 0)
                _this.contact_tab_recent.append("<div class=\"live-chat chat-group contact-chat\">");
            var recentlyDom = _this.contact_tab_recent.find(".live-chat");
            recentlyDom.empty(); // remove ten nhom
            var unread = 0;
            if(recent){
                recent.forEach(function(r){
                    if(r.type == 'group'){
                        var nhom = _groups[_.findIndex(_groups,{id:r.id})];
                        if(nhom){
                            var rD = _this.groupDom(nhom,"recent");
                            recentlyDom.append(rD);
                            if(r.unread > 0){
                                rD.find("a").append("<span class=\"number\">"+r.unread+"</span>");
                            }
                        }
                    }else{
                        var rD = _this.contactor(r.id,"recent");
                        recentlyDom.append(rD);
                        if(r.unread > 0){
                            rD.append("<span class=\"number\">"+r.unread+"</span>");
                        }
                    }
                    unread+=r.unread>0?1:0;
                });
            }
            if(unread > 0)
                _this.contact_tab_nav.find("li").eq(1).append("<span class=\"number\">"+unread+"</span>");
        };
        this.loadFriend = function(friends){// [id]
            var _this = this;
            for(var key in _this.friendDom)
                _this.domStore.append(_this.friendDom[key]);
            if(_this.contact_tab_friend.find(".live-chat").length == 0)
                _this.contact_tab_friend.append("<div class=\"live-chat list contact-chat\">");
            var friendDom = _this.contact_tab_friend.find(".live-chat");
            if(friends){
                friends.forEach(function(f){
                    friendDom.append(_this.contactor(f,"friend"));
                });
            }
        };
        this.loadOnline = function(onl){ //add contactor online.
            var _this = this;
            for(var key in _this.onlineDom)
                _this.domStore.append(_this.onlineDom[key]);
            if(_this.contact_tab_online.find(".live-chat").length == 0)
                _this.contact_tab_online.append("<div class=\"live-chat list chat-group contact-chat\">");
            var oD = _this.contact_tab_online.find(".live-chat");
            if(onl)
                onl.forEach(function(o){
                    _contacts[o].state = ONLINE;
                    
                    _this.updateContact(o);
                });

        };
        this.loadNhom = function(nhoms){//[{id,name,members}]
            var _this = this;
            for(var key in _this.nhomDom){
                if(_this.nhomDom[key])
                    for(var k in _this.nhomDom[key])
                        _this.domStore.append(_this.nhomDom[key][k]);
                else
                    _this.nhomDom[key] = {};
            }
            if(_this.contact_tab_nhom.find(".live-chat").length == 0)
                _this.contact_tab_nhom.append("<div class=\"live-chat chat-group contact-chat\"></div>");
            var nhomDom = _this.contact_tab_nhom.find(".live-chat");
            nhomDom.empty();
            if(nhoms){
                nhoms.forEach(function(nhom){
                    nhomDom.append(_this.groupDom(nhom));
                });
            }
        };
        this.loadPhanCap = function(phancap,first){ // {ThanhVien,DonViCon}
            var _this = this;
            if(first){
                var node = $("<div class=\"live-chat chat-group contact-chat\"></div>");
                if(phancap.DonViCon){
                    phancap.DonViCon.forEach(function(sub){
                        node.append(_this.loadPhanCap(sub).panel);
                    });
                }
                if(phancap.ThanhVien){
                    phancap.ThanhVien.forEach(function(member){
                        var dom = _this.contactor(member,"phancap");
                        node.append(dom);
                    });
                }
                //expand
                var expand = {}
                node.find(".hidden."+MESSAGE_RECEIVER).parentsUntil(".live-chat").map(function(){
                    expand = $(this);
                    if(expand.hasClass("guid-blok")){
                        expand.parent().prepend(expand);
                        expand.find(".panel-collapse.collapse").first().addClass("in");
                        expand.find(".panel-heading").first().find("a").removeClass("collapsed");
                    }
                });
                // refresh
                _this.contact_tab_phancap.find(".live-chat").remove();
                _this.contact_tab_phancap.append(node);
            }else{
                var node = _this.panelCollapor(phancap.TenDonVi||_randomstring(19));
                if(phancap.DonViCon){
                    phancap.DonViCon.forEach(function(sub){
                        node.panelContent.append(_this.loadPhanCap(sub).panel);
                    });
                }
                if(phancap.ThanhVien){
                    phancap.ThanhVien.forEach(function(member){
                        var dom = _this.contactor(member,"phancap");
                        node.panelContent.append(dom);
                    });
                }
                return node;
            }
        };
        this.loadDanhSach = function(){
            var _this = this;
            for(var key in _this.listDom)
                _this.domStore.append(_this.listDom[key]);
            if(_this.contact_tab_danhsach.find(".live-chat").length == 0)
                _this.contact_tab_danhsach.append("<div class=\"live-chat list contact-chat\">");
            var listDom = _this.contact_tab_danhsach.find(".live-chat");
            for(var key in _contacts){
                listDom.append(_this.contactor(key,"list"));
            }
            var lds = _this.contact_tab_danhsach.find(".supporter_chat");
            for(var i=lds.length - 1;i> 0;i--){
                if($(lds[i]).find(".status .online").length > 0)
                    _this.contact_tab_danhsach.find(".live-chat").prepend($(lds[i]));
            }
        };
        this.phanCapLevel = function(phancap,level){
            var _this = this;
            var result = {TenDonVi:phancap.TenDonVi};
            if(level == 0){
                result.ThanhVien = _.union(_getAllThanhVien(phancap));
            }else{
                result.ThanhVien = phancap.ThanhVien;
                if(phancap.DonViCon && phancap.DonViCon.length > 0){
                    result.DonViCon = phancap.DonViCon;
                    for(var i = 0; i < phancap.DonViCon.length; i ++ )
                        result.DonViCon[i] = _this.phanCapLevel(phancap.DonViCon[i],level - 1);
                }
            }
            return result;
        }
        this.init = function(){
            var _this = this;
            _this.contact_head.find("i").tooltip({"placement":"left","template":tooltipTemplate});
            _(_this.tab).forEach(function(tab){
                _this.contact_tab_content.append(tab);    
            });
            _this.contact_content.append(_this.contact_tab_nav);
            _this.contact_content.append(_this.contact_tab_content);
            _this.contact_content.append(_this.contact_content_search);
            // add header
            _this.wrap.append(_this.contact_head);
            _this.wrap.append(_this.contact_content);
            _this.dom.append(_this.wrap);
            _this.setState();
            var btnToggle = _this.contact_head.find("a.btnclose-min");
            btnToggle.click(function(){
                _this.state.full = _this.state.full == false;
                _this.setState();
                _callback(CHATCONTACT_SET_STATE,_this.state);
            });
            _this.contact_tab_nav.find("li").click(function(){
                _this.state.tab = $(this).index();
                _callback(CHATCONTACT_SET_STATE,_this.state);
            });
            var btn_addgroup = _this.contact_head.find(".btn-addgroup");
            btn_addgroup.click(function(){
                _updateGroup({creater: _user.id},CREATE_GROUP,function(g){
                    _groups.push(g);
                    _this.loadNhom(_groups);
                    var bg = {id:g.id,title:g.name,type:"group",member:g.member,creater:g.creater};
                    _callback(CHATCONTACT_CALL_INSTANCE,bg);
                })
            });
            _this.loadOnline(_userOnline);
            // load tab content;
            if(CHAT_CONTACT_LEVEL){
                _this.loadPhanCap(_this.phanCapLevel(_phancap,CHAT_CONTACT_LEVEL),true);
            }
            else{
                _this.loadDanhSach();
                // console.log("dâd");
            }
            _this.loadFriend(_user.friends);
            _this.loadNhom(_groups);
            _this.loadRecent(_user.recent);
            
            
            return _this;
        };
        return this.init();
    };
    var _callback = function(type,data){
        if(type === CHATCONTACT_CALL_INSTANCE){// call 1 chat box from chatContact by click or dblclick
            var state = {};
            _listBox = _listBox || {};
            if(!_listBox[data.id]){ 
                _listBox[data.id] = new ChatBox(data,{show:true, full:true});
                _dom.append(_listBox[data.id].dom);
            }
            _showBox(data.id,true);
        }
        if(type === CHATBOX_UPDATE_CONTACT){
            _user = _.assign(_user,data);
            _chatContact.loadFriend(_user.friends);
        }
        if(type === CHATCONTACT_SET_STATE){
            _boxs = _.assign(_boxs,{state:data});
            _localStorage(STORAGE_CURRENT,_boxs);
        }
        if (type === CHATBOX_SEND_MESSAGE) { // send 1 message. data = { sender: "", receiver: "", contentmessage: "content" };
            socket.emit(SOCKET_SEND_MESSAGE, data);
        }
        if (type === SOCKET_SEND_READ_MESSAGE){
            socket.emit(SOCKET_SEND_READ_MESSAGE,data);
        }
        if (type === SOCKET_SEND_DEL_MESSAGE){
            socket.emit(SOCKET_SEND_DEL_MESSAGE,data);
        }
        if (type === CHATBOX_CLOSE){
            _showBox();
        }
    };
    var _boxs = _get_localStorage(STORAGE_CURRENT);
    var _version = _get_localStorage(STORAGE_VERSION);
    var _listBox = {}; //{"id": new ChatBox(user,box,callback,state,messages)} box:{id:"",type:"group|user",title:""}
    var _chatContact = {};
    var _receiveMessage = function(message,idtemp) { // message{id: from,toUser,toGroup,content,state,time}.
        _listBox = _listBox || {};
        
        if(message.from === _user.id){ // tin nhan cua this.user
            if(message.toUser){
                if(_listBox[message.toUser]){ // da co chatBox
                    _listBox[message.toUser].displayMessage(message,idtemp,true);
                }else{
                    _listBox[message.toUser] = new ChatBox({id:message.toUser,type:"user"},{show:false, full:true});
                    _dom.append(_listBox[message.toUser].dom);
                    _showBox(message.toUser,false);
                }
            }
            if(message.toGroup){
                if(_listBox[message.toGroup]){
                    _listBox[message.toGroup].displayMessage(message,idtemp,true);
                }else{
                    _listBox[message.toGroup] = new ChatBox({id:message.toGroup,type:"group"},{show:false, full:true});
                    _dom.append(_listBox[message.toGroup].dom);
                    _showBox(message.toGroup,false);
                }
            }
        }else if(message.toUser && message.toUser == _user.id){// tin den this.user
            if(_listBox[message.from]){ // da co chatBox
                _listBox[message.from].displayMessage(message,idtemp,true);
            }else{
                _listBox[message.from] = new ChatBox({id:message.from,type:"user"},{show:false, full:true});
                _dom.append(_listBox[message.from].dom);
                _showBox(message.from,false);
            }
        }else{// tin nhan den group which this.user join
            if(_listBox[message.toGroup]){
                _listBox[message.toGroup].displayMessage(message,idtemp,true);
            }else{
                _listBox[message.toGroup] = new ChatBox({id:message.toGroup,type:"group"},{show:false, full:true});
                _dom.append(_listBox[message.toGroup].dom);
                _showBox(message.toGroup,false);
            }
        }
    };
    var _showBox = function(boxId,priority){
        var count = priority ? 1 : 0;
        _boxs = {time:new Date().getTime(),item:[],state:_chatContact.getState()}; // reset this.boxs
        for(var key in _listBox){
            var show = _listBox[key].state.show;
            var full = _listBox[key].state.full;
            if(show && count == 2)
                show = false;
            if(show)
                count ++;
            if(boxId && priority && key == boxId)
                show = true;
            var state = {show:show,online:(_userOnline.indexOf(key) !== -1),full:full};
            _listBox[key].setState(state);
            if(_listBox[key].state.show){
                _boxs.item.push(_.assign(_listBox[key].box,{state:_listBox[key].state}));

            }
        }
        if(boxId && count < 2){
            var state = {show:true,online:(_userOnline.indexOf(boxId) !== -1)};
            _listBox[boxId].setState({show:true});
            _boxs.item.push(_.assign(_listBox[boxId].box,{state:_listBox[boxId].state}));   
        }
        _localStorage(STORAGE_CURRENT,_boxs);
    };
    var _setSocket = function(){
        socket.on(SOCKET_GET_CONNECT,function(version,time){ // userOnline:["id"]
            if(version != _version){ // load lai contact va phan cap khi co du lieu moi
                _localStorage(STORAGE_VERSION,version);
                _loadData(_user.userId,"contacts",undefined,undefined,undefined,undefined,undefined,function(data){
                    _user = _.assign(_user,data.user);
                    _contacts = {};
                    data.users.forEach(function(c){
                        _contacts[c.id] = c;
                    });
                });
            }
            TIMEOFFSET = new Date() - time;
        });
        socket.on(SOCKET_BROADCAST_DISCONNECT, function(contactId){
            try{
                _contacts[contactId].state = OFFLINE;
                _.remove(_userOnline,function(n){
                    return n === contactId;
                })
                if(CHAT_CONTACT_LEVEL){
                    _chatContact.loadDanhSach();
                }
                _chatContact.updateContact(contactId);
                if(_listBox[contactId])
                    _listBox[contactId].setState({online:false});
            }catch(err){
                console.log(err);
            }
        });
        socket.on(SOCKET_BROADCAST_CONNECT,function(contactId){
            _contacts[contactId].state = ONLINE;
            _userOnline.push(contactId);
            if(CHAT_CONTACT_LEVEL){
                _chatContact.loadDanhSach();
            }
            _chatContact.updateContact(contactId);
            if(_listBox[contactId])
                _listBox[contactId].setState({online:true});
        });
        socket.on(SOCKET_GET_MESSAGE, function (data,idtemp) { // data: message. nhan 1 tin nhan truc tuyen.
            if(_user.recent && data.from != _user.id){
                var id = data.toGroup || data.from;
                var u = false;
                var i = _.findIndex(_user.recent,{id:id});
                if(i == -1){
                    _user.recent.push({id:id,unread:1,last:data.time});
                }
                else{
                    _user.recent[i].unread++;
                    _user.recent[i].last = data.time;
                }
                _user.recent.sort(function(r1,r2){
                    return r1.last < r2.last;
                  });
            }
            _chatContact.loadRecent(_user.recent);
            if(idtemp){
                
            }
            _receiveMessage(data,idtemp);
        });
        socket.on(SOCKET_GET_UPDATE_GROUP,function(data){
            var i = _.findIndex(_groups,{id:data.group.id});
            if(i !== -1){
                if(data.leave && _.indexOf(data.leave, _user.id) != -1){ // nguoi nay roi khoi nhom
                    _callNoTify(NOTIFY_LEAVE_NHOM+_groups[i].name);
                    if(_user.recent){
                        _user.recent.splice(_.findIndex(_user.recent,function(r){
                            return r.id == data.group.id;
                        }),1);
                    }
                    _groups.splice(i,1);// xoa nhom tai local
                    _chatContact.loadNhom(_groups);
                    _chatContact.loadRecent(_user.recent);
                    if(_listBox[data.group.id]){
                        _listBox[data.group.id].setState({show:false});
                        _showBox();
                    }
                }else{ // nguoi nay van trong nhom. thong bao cac thanh vien dc them vao nhom, thanh vien phai ra khoi nhom.
                    var mnotify = "";
                    if(data.leave){
                        var dsLeave = [];
                        for(var li=0;li<data.leave.length;li++)
                            dsLeave.push(_contacts[data.leave[li]].nickName);
                        if(dsLeave.length>0)
                            mnotify += dsLeave.join(' ,')+NOTIFY_LEAVED_NHOM+"<br/>";
                    }
                    if(data.join){
                        var dsJoin = [];
                        for(var ji=0;ji<data.join.length;ji++)
                            dsJoin.push(_contacts[data.join[ji]].nickName);
                        if(dsJoin.length>0)
                            mnotify += dsJoin.join(' ,')+NOTIFY_JOINED_NHOM;
                    }
                    if(!mnotify && _groups[i].name != data.group.name){ // nhom chi doi ten
                        mnotify = NOTIFY_CHANGED_NAME + data.group.name;    
                    }
                    _callNoTify(_groups[i].name+": "+mnotify);
                    _groups[i] = data.group;

                    _chatContact.loadNhom(_groups);
                    _chatContact.loadRecent(_user.recent);
                    if(_listBox[data.group.id]){
                        _listBox[data.group.id].updateBox({id:data.group.id,type:"group",creater:data.group.creater,title:data.group.name,member:data.group.member})
                        _showBox();
                    }
                }
            }else{
                if(data.join && _.indexOf(data.join, _user.id) != -1){
                    _callNoTify(NOTIFY_JOIN_NHOM + data.group.name);
                    _groups.push(data.group);
                    _chatContact.loadNhom(_groups);
                }
            }
        });
        socket.on(SOCKET_GET_REMOVE_GROUP,function(data){
            var i = _.findIndex(_groups,{id:data});
            if(i != -1){
                _callNoTify(NOTIFY_DELETE_NHOM + _groups[i].name);
                if(_user.recent){
                    _user.recent.splice(_.findIndex(_user.recent,function(r){
                        return r.id == data;
                    }),1);
                }
                _groups.splice(i,1);// xoa nhom tai local
                if(_listBox[data])
                    _listBox[data].setState({show:false});
                _chatContact.loadNhom(_groups);
                _chatContact.loadRecent(_user.recent);
            }
        });
        socket.on(SOCKET_GET_UPDATE_USER,function(data){

        });
        socket.on(SOCKET_GET_READ_MESSAGE,function(data){
            if(_user.recent){
                var i = _.findIndex(_user.recent,{id:data.boxId});
                if(i != -1){
                    _.assign(_user.recent[i],{unread:0});
                    _chatContact.loadRecent(_user.recent);
                }
            }
        });
        socket.on(SOCKET_GET_DEL_MESSAGE,function(data){
            if(_listBox[data.boxId])
                _listBox[data.boxId].delRefresh(data);
        })
        socket.emit(SOCKET_SEND_CONNECT, _user);
    };
    var _interval;
    var _title;
    var _setTitleBlur = function(title,type){
        _interval = setInterval(function(){ 
            title = _runTitle(title,type);
            document.title = title;
        }, 1000);
    };
    var _runTitle = function(title,type){
        return title.substring(1) + title[0];
    };
    var _clearTitle = function(){
        clearInterval(_interval);
        document.title = _title;
    };
    var _getNameContact = function(fullname){
        return _.last(fullname.trim().split(' '));
    };
    var _callNoTify = function(message){
        modal.find(".messageContent").empty();
        modal.find(".messageContent").append(message);
        modal.modal("show",function(){
            $("#submitfocus").focus();
        });
    };
    var _callConfirm = function(confirm,callback){
        modalConfirm.find(".messageContent").empty();
        modalConfirm.find(".messageContent").append(confirm);
        modalConfirm.modal("show");
        modalConfirm.find(".accept").off("click");
        modalConfirm.find(".accept").on("click",callback);
    };
    this.dom = _dom;
    this.init = function(){
        var _this = this;      
        _title = document.title;
        var state = {full:false,tab:0};
        _loadData(_user.userId,"contacts","online","recently",CHAT_CONTACT_LEVEL ? "phancap": undefined ,"friend","group",function(data){
            console.log(data);
            _user = _.assign(_user,data.user);
            _contacts = {};
            data.users.forEach(function(c){
                _contacts[c.id] = c;
            });
            _userOnline = data.online;
            if(CHAT_CONTACT_LEVEL){
                _phancap = data.phancap.phanCap || {};
            }

            _groups = data.group;
            _chatContact = new ChatContact(state,_contacts[_user.id].nickName);
            _dom.append(_chatContact.dom);
            _boxs = {time:new Date().getTime(),item:[],state:{full:false,tab:0}};
            _setSocket();
        });
        
        $(window).unload(function() {
          _showBox();
        });
        modal.modal({show:false});
        _dom.append(modal);
        modalConfirm.modal({show:false});
        _dom.append(modalConfirm);
        return _this;
    }
    return this.init();
};