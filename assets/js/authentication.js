$ = window.$;

const loginValidations = () => {
  // Login form validations
  $("#login.ui.form").form({
    fields: {
      userid: {
        identifier: "userid",
        rules: [
          {
            type: "empty",
            prompt: "Please enter your userid"
          },
          {
            type: "length[6]",
            prompt: "Your userid must be at least 6 characters"
          }
        ]
      },
      password: {
        identifier: "password",
        rules: [
          {
            type: "empty",
            prompt: "Please enter your password"
          },
          {
            type: "length[6]",
            prompt: "Your password must be at least 6 characters"
          }
        ]
      }
    }
  });
};

const signupValidations = () => {
  // Login form validations
  $("#signup.ui.form").form({
    fields: {
      userid: {
        identifier: "userid",
        rules: [
          {
            type: "empty",
            prompt: "Please enter your userid"
          },
          {
            type: "length[6]",
            prompt: "Your userid must be at least 6 characters"
          }
        ]
      },
      username: {
        identifier: "username",
        rules: [
          {
            type: "empty",
            prompt: "Please enter your username"
          },
          {
            type: "length[6]",
            prompt: "Your username must be at least 6 characters"
          }
        ]
      },
      password: {
        identifier: "password",
        rules: [
          {
            type: "empty",
            prompt: "Please enter your password"
          },
          {
            type: "length[6]",
            prompt: "Your password must be at least 6 characters"
          }
        ]
      },
      email: {
        identifier: "email",
        rules: [
          {
            type: "email",
            prompt: "Please enter your email"
          }
        ]
      }
    }
  });
};

$(document).ready(function() {
  loginValidations();
  signupValidations();
});
