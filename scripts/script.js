$(document).ready(function(){
  //NAVIGATION BAR DROP DOWN
  $('.search-button-wrapper').on('click', function(){
    $('.main-header-search').slideToggle();
  });
  
  //AJAX CALL FOR TWITCH API
  var apiStream = 'https://wind-bow.hyperdev.space/twitch-api/streams/'
  var apiChannel = 'https://wind-bow.hyperdev.space/twitch-api/channels/'
  var apiUrlTail = '?callback=?';
  var twitchList = ["ESL_SC2", "OgamingSC2", "bajheera", "freecodecamp", "brunofin",  
                    "azortharion", "fisstech", "programming", "huntercalla", "comster404"];
  
  // ============= GET STREAMS JSONP =================
  function getStream(stream) {
    $.ajax({
      type: 'GET',
      url: apiStream + stream + apiUrlTail,
      dataType: 'jsonp',
      success: function(streamData){
        var cardSelector = '#' + stream.toLowerCase();
        //if offline
        if (streamData.stream === null) {
          $(cardSelector + '_status').css('background-color', '#D64541');
          $(cardSelector + '_game').text('Offline');
          $(cardSelector + '_streamTitle').text("Check back Later");
          $(cardSelector + '-card').addClass('user-offline');
        }//end if
        else {
          $(cardSelector + '_status').css('background-color', '#2ECC71');
          $(cardSelector + '_game').text(streamData.stream.channel.game);
          $(cardSelector + '_streamTitle').text(streamData.stream.channel.status);
          $(cardSelector + '-card').addClass('user-online');
        }//end else
          
      }//end success
    });//end ajax call
  }//end getStream();
  
  
  // ============= GET CHANNELS JSONP =============
  function getChannel(channel) {
    $.ajax({
      type: 'GET',
      url: apiChannel + channel + apiUrlTail,
      dataType: 'jsonp',
      success: function(chanData){
        //Check if streamer exists
        if (chanData._links) {
          var channelId = channel.toLowerCase();
          var cardHtml = '<div id="' + channelId + '-card" class="streamer-card"><div class="streamer-card-img"><img src="' + chanData.logo + '">';
          cardHtml += '</div><h4 class="streamer-name">' + channel + '</h4><div class="stream-info">';
          cardHtml += '<p id="' + channelId + '_game" class="game-title"></p><p id="' + channelId + '_streamTitle" class="stream-title"></p>';
          cardHtml += '</div><span id="' + channelId + '_status' + '"class="stream-status"></span></div>';
          //append streamer cards to .streamers-content div
          $(cardHtml).appendTo('.streamers-content');
          //call getStream to add other data to cards
          getStream(channel);
        }//end if
        else if (chanData.status === 404 && chanData.error === "Not Found") {
          var errorStreamHtml = '<div id="' + channel + '-card" class="streamer-card user-offline"><div class="streamer-card-img">';
          errorStreamHtml += '<i id="error-logo" class="fa fa-exclamation-triangle" aria-hidden="true"></i></div><h4 class="streamer-name">';
          errorStreamHtml += channel + '</h4><div class="stream-info"><p id="' + channel + '_game" class="game-title"></p><p id="';
          errorStreamHtml += channel + '_streamTitle" class="stream-title">Channel Does Not Exist</p>'; 
          errorStreamHtml += '</div><span id="' + channel + '_status' + '"class="stream-status"></span></div>';
          //write to html
          $('.streamers-error').css('display', 'block');
          $(errorStreamHtml).appendTo('.streamers-error');
        }//end else if
      }//end success
    });//end ajax call
  }//end getChannel();
  
  
  //// ============= CALL GETCHANNEL FUNCTION ============= ////
  for (var i = 0; i < twitchList.length; i++) {
    getChannel(twitchList[i]);
  }//end forLoop
  
  //// ============= EVENTS ============= ////
  //// ============= EVENTS ============= ////
  
  //// ============= BUTTONS FOR FILTERING STREAMS ============= ////
  $('#stream-all').on('click', function(){
    $('.user-online, .user-offline').css('display', 'inline-block');
  });
  
  $('#stream-online').on('click', function(){
    $('.user-offline').css('display', 'none');
    $('.user-online').css('display', 'inline-block');
  });
  
  $('#stream-offline').on('click', function(){
    $('.user-online').css('display', 'none');
    $('.user-offline').css('display', 'inline-block');
  });
  
  //// ============= CLICKING DIVS TO CHANGE EMBEDDED VIDEO ============= ////
  //user hyphen - to split items
  $('.streamers-content').on('click', '.streamer-card', function(){
    var elId = $(this);
    var streamerId = elId.attr('id').split('-')[0];
    var streamerVidUrl = 'https://player.twitch.tv/?channel={' + streamerId + '}&muted=true';
    $('.player-video').attr('src', streamerVidUrl);
    //console.log(streamerId);
    
  });
  
     
});//document.ready function
