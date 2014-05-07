M.block_system_messages = {}

M.block_system_messages.attach = function(Y, id) {
    M.block_system_messages.Y = Y;
    var MOVEICON = {
        pix: "t/delete",
        component: 'moodle'
    };
    var nodeid = '#block_system_message_id_' + id;
    var idnum = id;

    YUI().use('node', function(Y) {
        //Static Vars
        var goingUp = false, lastY = 0;

        var node = Y.Node.one(nodeid);
        if (node) {
            // Replace move link and image with move_2d image.
            var imagenode = node.one('.controls a img');
            imagenode.setAttribute('src', M.util.image_url(MOVEICON.pix, MOVEICON.component));
            imagenode.addClass('cursor2');
            node.one('.controls a').replace(imagenode);

            Y.on('click', function(e) {
                e.preventDefault();
                M.block_system_messages.save(idnum);
                node.addClass('hide');
            }, node);
        };

        
    });
}

M.block_system_messages.attachall = function(Y) {
    M.block_system_messages.Y = Y;
    var MOVEICON = {
        pix: "t/delete",
        component: 'moodle'
    };

    YUI().use('node', function(Y) {
        //Static Vars
        var goingUp = false, lastY = 0;

        var list = Y.Node.all('.block_system_messages .coursebox');
        list.each(function(v, k) {
            // Replace move link and image with move_2d image.
            var imagenode = v.one('.controls a img');
            imagenode.setAttribute('src', M.util.image_url(MOVEICON.pix, MOVEICON.component));
            imagenode.addClass('cursor2');
            v.one('.controls a').replace(imagenode);

            /*var dd = new Y.DD.Drag({
                node: v,
                target: {
                    padding: '0 0 0 20'
                }
            }).plug(Y.Plugin.DDProxy, {
                moveOnEnd: false
            }).plug(Y.Plugin.DDConstrained, {
                constrain2node: '.course_list'
            });
            dd.addHandle('.course_title .move');*/


        });

        Y.on('click', function(e) {
            e.preventDefault();
            M.block_system_messages.save();
        }, '.controls');
    });
}


M.block_system_messages.save = function(id) {
    var Y = M.block_system_messages.Y;

    var params = {
        messageid : id
    };
    Y.io(M.cfg.wwwroot+'/blocks/system_messages/save.php', {
        method: 'POST',
        data: build_querystring(params),
        context: this
    });
}
