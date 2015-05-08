var loginOnSuccess = function(username, password) {
  var form = document.createElement('form');
  form.method = 'post';
  form.action = '/login';

  var usernameInput = document.createElement('input');
  usernameInput.name = 'username';
  usernameInput.value = username;
  form.appendChild(usernameInput);

  var passwordInput = document.createElement('input');
  passwordInput.name = 'password';
  passwordInput.value = password;
  form.appendChild(passwordInput);

  form.submit();
};

var displayMessage = function(message) {

  $('#error-message')
  .text(message);

};

$(document).ready(function() {

$('#signup')
.submit(function(event) {
  event.preventDefault();
  var username = $('#usernameField').val();
  var password = $('#passwordField').val();
  $.ajax({
    url: '/api/user',
    type: 'post',
    data: $('#signup').serialize(),
    dataType: 'json',
    statusCode: {
      201: function() { loginOnSuccess(username, password); },
      400: function() { displayMessage('Invalid Input'); },
      409: function() { displayMessage('Username already taken'); },
      500: function() { displayMessage('Server error'); }
    }
  });
});

}); // document ready
