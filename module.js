M.block_announce = {}

M.block_announce.attachall = function(Y) {
    M.block_announce.Y = Y;

    var DELETEICON = {
        pix: "t/delete",
        component: 'moodle'
    };
    var UNDOICON = {
        pix: "e/undo",
        component: 'moodle'
    };

    YUI().use('node', function(Y) {
        list = Y.Node.all('.block_announce .messagebox');
        list.each(function(node, k) {
            if (node) {
                // Replace move link and image with move_2d image.
                var imagenode = node.one('.controls');
                if (imagenode) {
                    imagenode.setAttribute('src', M.util.image_url(DELETEICON.pix, DELETEICON.component));
                    imagenode.addClass('cursor');
                    imagenode.setStyle('opacity', 1);

                    imagenode.once('click', M.block_announce.clickdelete, node, Y);
                }
            };
        });
    });
}

M.block_announce.clickundo = function(e, Y, timer) {
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
        border: Y.Node.one('#block_announce_message_box').getComputedStyle('border')
    });
    this.transition({
        height: message.get('clientHeight') + 'px',
        backgroundColor: Y.Node.one('#block_announce_message_box').getComputedStyle('backgroundColor')
    }, function() {
        imagenode.setAttribute('src', M.util.image_url(DELETEICON.pix, DELETEICON.component));
        imagenode.once('click', M.block_announce.clickdelete, this, Y);
    });
}

M.block_announce.clickdelete = function(e, Y) {
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
        border: Y.Node.one('#block_announce_hidden_box').getComputedStyle('border')
    });
    this.transition({
        height: hidden.get('clientHeight') + 'px',
        backgroundColor: Y.Node.one('#block_announce_hidden_box').getComputedStyle('backgroundColor')
    }, function() {
        imagenode.setAttribute('src', M.util.image_url(UNDOICON.pix, UNDOICON.component));

        timer = Y.later(2000, this, function () {
            idnum = this.getAttribute('idnum');
            M.block_announce.save(idnum, 1);

            hidden = this.one('.hiddenmessage');
            imagenode = this.one('.controls');
            imagenode.detach('click', M.block_announce.clickundo);
            imagenode.removeClass('cursor');

            imagenode.transition({
                height: 0
            });

            block = this.ancestor('.block_announce');

            msgbox = Y.Node.one('#block_announce_message_box');
            count = msgbox.getAttribute('msgcount');
            count--;
            msgbox.setAttribute('msgcount', count);
            

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
                //width: 0
            }, function() {
                if (count >= 1) {
                    this.empty(true);
                    this.remove(true);
                    this.destroy(true);
                }
            });
            if (count <= 0) {
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

        imagenode.once('click', M.block_announce.clickundo, this, Y, timer);
    });
}

M.block_announce.save = function(id, h) {
    var Y = M.block_announce.Y;

    var params = {
        messageid : id,
        hide : h
    };
    Y.io(M.cfg.wwwroot + '/blocks/announce/save.php', {
        method: 'POST',
        data: build_querystring(params),
        context: this
    });
}
