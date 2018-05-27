window.onload = function() {

    var $toBtn = $('#_to');
    var $unreadChat = $('#_chatStatusTypeUnread');
    var $allChat = $('#_chatStatusAll');

    var hideMode = false;
    var showUnread = false;
    
    const CHATWORK_CLASS = {
    		TIMELINE_MESSAGE : '.timelineMessage',
    		TIMELINE_MESSAGE_USER_NAME : '.timelineMessage__userName',
    }
    
    _init();
    
    /*---------------------------*/
    function _init() {
    	_bindShortCutEvents();
   $('#_roomListItems').on('click', function(event) {
        setTimeout(_bindDblClick, 500);
    });
    }

    /**
     * Bind Event on shortcut.js {@see http://www.openjs.com/scripts/events/keyboard_shortcuts/index.php}
     */
    function _bindShortCutEvents() {
        // 未読のあるチャットの表示
        shortcut.add("Ctrl+Alt",function() {
            if (!showUnread) {
               $unreadChat.click();
               showUnread = true;
            } else { 
               $allChat.click();
               showUnread = false;
            }
        });

        // TOポップアップ表示
        shortcut.add("Ctrl+Space",function() {
    	    $toBtn.click();
        });

        // 自分のメッセージを非表示
        shortcut.add("Ctrl+q",function() {
             _changeMessage(_getLoginUserName(), false);
        });

        // 自分のメッセージのみ表示
        shortcut.add("Ctrl+Shift",function() {
//             _changeMessage(_getLoginUserName(), true);
        	_showMinMessage();
        });
    }


    // ダブルクリックしたユーザーのみ表示
    function _bindDblClick() {
        $('.timelineMessage--border').on('dblclick', function(event) {
           var targetUserName = $(this).find('.timelineMessage__userName').text();
           if (!targetUserName || targetUserName === '') {
               return;
           }
           var reply = $(this).find('._replyMessage').text();
           if (!reply || reply === '') {
               return;
           }
           _showThreadMessage($(this).find('._replyMessage').data('mid'));
           // _changeMessage(targetUserName, true);
           // _showMinMessage(targetUserName, true);
        });
    }

    function _showThreadMessage(messageId) {
    	$('body').append('<div id="message_row" style="position:fixed; top:0px; right:0px; z-index:9999999; background:#F3F3F3; width:300px; overflow:scroll;"></div>');
    	var $messageLow = $('#message_row');
    	
        var messageList = $(CHATWORK_CLASS.TIMELINE_MESSAGE);
        var appendHTML = '';
        for (i=0; i < messageList.length; i++) {
          var $targetMessage = $(messageList[i]); 
          if ($targetMessage.data('mid') === messageId) {
             appendHTML += $targetMessage.html();
          }
        }
        $messageLow.append(appendHTML);
    }

    function _showMinMessage() {
    	$('body').append('<div id="message_row" style="position:fixed; top:0px; right:0px; z-index:9999999; background:#F3F3F3; width:300px; overflow:scroll;"></div>');
    	var $messageLow = $('#message_row');
    	
        var messageList = $(CHATWORK_CLASS.TIMELINE_MESSAGE);
        var appendHTML = '';
        var loginUserName = _getLoginUserName();
        for (i=0; i < messageList.length; i++) {
          var $targetMessage = $(messageList[i]);
          var messageText = $targetMessage.find('.timelineMessage__message').text();
          if (messageText.match(loginUserName)) {
             appendHTML += $targetMessage.html();
          }
        }
        $messageLow.append(appendHTML);
    }
    
    /**
     * @return {String} loginUserName
     */
    function _getLoginUserName() {
    	return $('#_myStatusName').text().trim();
    }
    
    /**
     * @param {String} targetName
     * @param {boolean} isShowSelf
     */
    function _changeMessage(targetName, isShowSelf) {
    	var prevUserName = '';
        var messageList = $(CHATWORK_CLASS.TIMELINE_MESSAGE);
        for (i=0; i < messageList.length; i++) {
          var $targetMessage = $(messageList[i]);
          var userName = _getUserName($targetMessage);
          if (_isChangeTarget(isShowSelf, userName, targetName, prevUserName)) {
        	  _changeDisplay($targetMessage);
          }
          prevUserName = userName;
        }

        if (hideMode) {
          hideMode = false;
        } else {
          hideMode = true;
        }
    }

    /**
     * @param {Element} $message
     * @return {String} userName
     */
    function _getUserName($message) {
        var $userName = $message.find(CHATWORK_CLASS.TIMELINE_MESSAGE_USER_NAME);
        return $userName ? $userName.text() : '';
    }
    
    /**
     * @param {Element} $target
     */
    function _changeDisplay($target) {
        if (!hideMode) {
           $target.hide();                 
        } else {
           $target.show();
        }   
    }

    /**
     * @param {boolean} isShowSelf
     * @param {String} userName
     * @param {String} targetName
     * @param {String} prevUserName
     * 
     * @return {boolean} isChangeTarget
     */
    function _isChangeTarget(isShowSelf, userName, targetName, prevUserName) {
         if (isShowSelf && userName !== targetName) {
             return true;
         } else if (userName === '' && prevUserName === targetName) { // 連続投稿メッセージ
             return true;
         } else if (!isShowSelf && userName === targetName) {
             return true;
         } else {
             return false;
         }
    }
};


