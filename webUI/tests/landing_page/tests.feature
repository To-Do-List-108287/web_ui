Feature: Testing Flow of the Landing Page and login

  Scenario: Landing Page Contains Login Button that redirects to login page
    Given a new user,
    When they visit the landing page
      And select “Sign In“ button,
    Then the user should be redirected to the login page.

  Scenario: Landing Page Contains Register Button that redirects to sign-up page
    Given a new user,
    When they visit the landing page
      And select “Register“ button,
    Then the user should be redirected to the sign-up page.

  Scenario: Sign Up
    Given a new user,
    When they visit the sign-up page
      And provide valid information,
      And select the “signUpButton“ button,
      And fill code verification,
      And select the “confirm“ button,
    Then the user should be redirected to the home page.

  Scenario: Login
    Given a new user,
    # just reusing the step
    When they visit the login page
      And provide valid information,
      And select the “signInSubmitButton“ button,
    Then the user should be redirected to the home page.
