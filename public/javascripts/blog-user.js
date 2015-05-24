var follow = function() {
  $.ajax({
    url: '/api/user/' + username + '/follows/' + blogId,
    type: 'put',
    success: function() {
      getFollowBtn();
    }
  });
}

var unfollow = function() {
  $.ajax({
    url: '/api/user/' + username + '/follows/' + blogId,
    type: 'delete',
    success: function() {
      getFollowBtn();
    }
  });
}

var getFollowBtn = function() {
  $.ajax({
    url: '/api/user/' + username + '/follows/' + blogId,
    type: 'get',
    success: function(res) {
      if(res.hasFollowed === true)
        $('#follow-button').text('Unfollow this blog');
      else
        $('#follow-button').text('Follow this blog');
    }
  });
}

$(document).ready(function() {

getFollowBtn();

$('#follow-button').click(function() {
  if ($('#follow-button').text() === 'Follow this blog')
    follow();
  else if ($('#follow-button').text() === 'Unfollow this blog')
    unfollow();
});

});
