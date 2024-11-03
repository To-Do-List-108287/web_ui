Feature: Testing Flow of the Various Lists of the To-do List application

  Scenario: Add New Task to the To-do List
    Given a registered user
    When they visit the home page
      And select “Add Task“ button
      And fill with task valid information
    Then the new task should appear on the to-do list
      And it should display the tasks title, deadline and priority.
