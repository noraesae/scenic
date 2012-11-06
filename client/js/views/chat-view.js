var ChatView = Backbone.View.extend({
    object: null,
    initialize: function() {
        this.render();
    },
    render: function() {
        var _this = this; // for handlers
        var chat = ich.chat_template({});
        this.object = $(chat);

        // set chat handlers
        this.object.click(function(e) {
            _this.focusInput();
        });

        $('body').append(this.object);

        // set mouse wheel handler
        $('.scroll-box', this.object).mousewheel(function(e, delta, deltaX, deltaY) {
            $(this).scrollTop($(this).scrollTop() - (deltaY * 10));
            e.preventDefault();
        });

        // handle 'enter' and 'esc' key for show or hide chat view.
        $(document).bind('keyup.chat', function(e) {
            if(e.which == 13) {
                // enter
                if(_this.isHidden()) {
                    _this.show();

                    // update button text
                    $('#ChatButton').addClass('on');
                    $('#ChatButton').removeClass('off');
                }
                else {
                    _this.focusInput();
                }
            }
            else if(e.which == 27) {
                // esc
                if(!_this.isHidden()) {
                    _this.hide();

                    // update button text
                    $('#ChatButton').addClass('off');
                    $('#ChatButton').removeClass('on');
                }
            }
        });
    },
    focusInput: function() {
        if(this.object) {
            $("input.chat-input", this.object).focus();
        }
    },
    show: function() {
        if(this.object) {
            this.object.removeClass('hidden');
            this.focusInput();
        }
    },
    hide: function() {
        if(this.object) {
            this.object.addClass('hidden');
        }
    },
    isHidden: function() {
        if(this.object) {
            return this.object.hasClass('hidden');
        }
        else {
            return false;
        }
    },
    remove: function() {
        if(this.object) {
            this.object.remove();
        }

        // unbind document handler
        $(document).unbind('keyup.chat');
    },
    setNick: function(nick) {
        if(!this.object) return;

        $('.input-box .nick', this.object).text(nick);
    },
    chatlog: function(from, msg, from_me) {
        if(!this.object) return;

        var chatlog = $(ich.chatlog_template({from: from, msg: msg}));
        if(from_me) chatlog.addClass('from_me');

        $('.chat-log', this.object).append(chatlog);

        // scroll to bottom
        $('.scroll-box', this.object).scrollTop($('.chat-log', this.object).height());
    },
    notice: function(msg) {
        if(!this.object) return;

        $('.chat-log', this.object).append(ich.notice_template({msg: msg}));
    },
    onChatInput: function(handler) {
        var _this = this;
        var chat_input = $("input.chat-input", this.object);
        chat_input.keyup(function(e) {
            if(e.which == 13 && !_this.isHidden()) {
                // enter
                var msg = chat_input.val();
                if(msg) {
                    chat_input.val('');
                    handler(msg);
                    _this.focusInput();
                }
            }
        });
    }
});
