﻿window.onload = function() {

    var $toBtn = $('#_to');
    var $unreadChat = $('#_chatStatusTypeUnread');
    var $allChat = $('#_chatStatusAll');
    var $messageLow;

    var hideMode = false;
    var showUnread = false;
    var showMessageLow = false;

    const CHATWORK_CLASS = {
    		TIMELINE_MESSAGE : '.timelineMessage',
    		TIMELINE_MESSAGE_USER_NAME : '.timelineMessage__userName',
    }
    
    _init();
    
    /*---------------------------*/
    function _init() {
    	_bindShortCutEvents();
        _bindDblClick();
        _addElements();
        _bindOptionEvents();
    }

    function _addElements() {
       var meButton = '<li role="button" class="_showDescription" id="_showToMe" aria-label="自分宛のメッセージを表示します" style="display: inline-block;"><span class="" style="color:#FFF; background-color:#66A300; padding: 3px 4px; font-size: 10px; border-radius: 3px; position: relative; top: -2px;">&nbsp;ME&nbsp;</span></li>';
       $('#_chatSendTool').append(meButton);

       $('body').append('<div id="message_row" style="height:100%; display:none; position:fixed; top:0px; right:0px; z-index:9999999; background:#F3F3F3; width:300px; overflow:scroll;"></div>');
       $messageLow = $('#message_row');
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
             _changeMessage(_getLoginUserName(), true);
        });
    }

    function _bindOptionEvents() {

       $('#_roomListItems').on('click', function(event) {
          _initMessageLow();
          setTimeout(_bindDblClick, 500);
       });
       
       $('#_showToMe').on('click', _showToMeMessage);
    }


    // ダブルクリックしたユーザーのみ表示
    function _bindDblClick() {
        $('.timelineMessage--border').on('dblclick', function(event) {
           var targetUserName = $(this).find('.timelineMessage__userName').text();
           if (!targetUserName || targetUserName === '') {
               return;
           }
           _changeMessage(targetUserName, true);
           // _showMinMessage(targetUserName, true);
        });
    }

    function _initMessageLow() {
           $messageLow.hide();
           $messageLow.empty();
           showMessageLow = false;
    }

    // 自分宛のメッセージを表示する
    function _showToMeMessage() {
        if (showMessageLow) {
           _initMessageLow();
           return;
        }
    	var prevUserName = '';
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
        if (appendHTML === '') {
          appendHTML = '自分宛のメッセージはありません';
        }
        $messageLow.append(appendHTML);
        $messageLow.show();
        showMessageLow = true;
    }

    function _showMinMessage(targetName, isShowSelf) {
    	
    	var $messageLow = $('#message_row');
    	var prevUserName = '';
        var messageList = $(CHATWORK_CLASS.TIMELINE_MESSAGE);
        var appendHTML = '';
        for (i=0; i < messageList.length; i++) {
          var $targetMessage = $(messageList[i]);
          var userName = _getUserName($targetMessage);
          if (!_isChangeTarget(isShowSelf, userName, targetName, prevUserName)) {
        	  appendHTML += $targetMessage.html();
          }
          prevUserName = userName;
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


