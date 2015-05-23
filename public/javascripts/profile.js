$(document).ready(function() {

$('#change-info')
.submit(function(event) {
  event.preventDefault();
  $.ajax({
    url: $(this).attr('url'),
    type: 'put',
    data: $('#change-info').serialize(),
    dataType: 'json',
    statusCode: {
      200: function() { window.location.reload(true); },
      400: function() { alert('Missing name or password'); }, 
      403: function() { alert('No access'); },
      404: function() { alert('User does not exist'); }
    }
  });
});

}); // document ready
