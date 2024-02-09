$(document).ready(function () {
  $("#show-password").on("click", function () {
    console.log("Enter password");
    const typePassword = $('input[name="password"]').prop("type");
    if (typePassword == "password") {
      $("#show-password").html("Hide Password");
      $('input[name="password"]').prop("type", "text");
    } else {
      $("#show-password").html("Show Password");
      $('input[name="password"]').prop("type", "password");
    }
  });
});
