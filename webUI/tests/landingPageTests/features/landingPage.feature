Feature: Landing Page Items

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
