M.block_system_messages = {}

M.block_system_messages.attachall = function(Y) {
    M.block_system_messages.Y = Y;

    var DELETEICON = {
        pix: "t/delete",
        component: 'moodle'
    };
    var UNDOICON = {
        pix: "e/undo",
        component: 'moodle'
    };

    YUI().use('node', function(Y) {
        list = Y.Node.all('.block_system_messages .messagebox');
        list.each(function(node, k) {
            if (node) {
                // Replace move link and image with move_2d image.
                var imagenode = node.one('.controls');
                if (imagenode) {
                    imagenode.setAttribute('src', M.util.image_url(DELETEICON.pix, DELETEICON.component));
                    imagenode.addClass('cursor2');
                    imagenode.setStyle('opacity', 1);

                    imagenode.once('click', M.block_system_messages.clickdelete, node, Y);
                }
            };
        });
    });
}

M.block_system_messages.clickundo = function(e, Y, timer) {
    DELETEICON = {
        pix: "t/delete",
        component: 'moodle'
    };

    Y.use('transition', 'node');

    if (timer) {
        timer.cancel();
    }
    e.preventDefault();

    message = this.one('.messagecontent');
    hidden = this.one('.hiddenmessage');
    imagenode = this.one('.controls');

    message.show(true);
    hidden.hide(true);

    this.transition({
        borderColor: Y.Node.one('#block_system_messages_message_box').getComputedStyle('borderColor')
    });
    this.transition({
        height: message.get('clientHeight') + 'px',
        backgroundColor: Y.Node.one('#block_system_messages_message_box').getComputedStyle('backgroundColor')
    }, function() {
        imagenode.setAttribute('src', M.util.image_url(DELETEICON.pix, DELETEICON.component));
        imagenode.once('click', M.block_system_messages.clickdelete, this, Y);
    });
}

M.block_system_messages.clickdelete = function(e, Y) {
    UNDOICON = {
        pix: "e/undo",
        component: 'moodle'
    };

    Y.use('transition', 'yui-later', 'node');

    e.preventDefault();

    message = this.one('.messagecontent');
    hidden = this.one('.hiddenmessage');
    imagenode = this.one('.controls');

    message.hide(true);
    hidden.show(true);

    this.transition({
        borderColor: Y.Node.one('#block_system_messages_hidden_box').getComputedStyle('borderColor')
    });
    this.transition({
        height: hidden.get('clientHeight') + 'px',
        backgroundColor: Y.Node.one('#block_system_messages_hidden_box').getComputedStyle('backgroundColor')
    }, function() {
        imagenode.setAttribute('src', M.util.image_url(UNDOICON.pix, UNDOICON.component));

        timer = Y.later(1000, this, function () {
            idnum = this.getAttribute('idnum');
            M.block_system_messages.save(idnum, 1);

            hidden = this.one('.hiddenmessage');
            imagenode = this.one('.controls');

            imagenode.transition({
                opacity: 0,
                height: 0,
                witdh: 0
            });
            hidden.transition({
                opacity: 0,
                height: 0,
                witdh: 0
            });

            block = this.ancestor('.block_system_messages');
            list = block.all('.hiddenmessage');

            // For some reason, padding and border cause the transition to never end.
            // Putting them in a seperate transition.
            this.transition({
                margin: 0,
                padding: 0,
                border: 0
            });
            this.transition({
                easing: 'ease',
                opacity: 0,
                height: 0,
                width: 0
            }, function() {
                if (list.size() > 1) {
                    this.empty(true);
                    this.remove(true);
                    this.destroy(true);
                }
            });
            if (list.size() <= 1) {
                if (block) {
                    block.transition({
                        minHeight: 0,
                        margin: 0,
                        padding: 0
                    });
                    block.transition({
                        height: 0,
                        opacity: 0
                    }, function() {
                        block.empty(true);
                        block.remove(true);
                        block.destroy(true);
                    });
                }
            }
        });

        imagenode.once('click', M.block_system_messages.clickundo, this, Y, timer);
    });
}

M.block_system_messages.save = function(id, h) {
    var Y = M.block_system_messages.Y;

    var params = {
        messageid : id,
        hide : h
    };
    Y.io(M.cfg.wwwroot + '/blocks/system_messages/save.php', {
        method: 'POST',
        data: build_querystring(params),
        context: this
    });
}
