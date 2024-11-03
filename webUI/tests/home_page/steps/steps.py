import os
import time

from behave import given, step, then, when
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

load_dotenv()

token = os.environ.get("TOKEN")

pages = {
  "landing": "http://localhost:4200",
  "home": "http://localhost:4200/home"
}

button_ids = {
  # name : id
  "add_task": "add_task_button"
}


@given("a registered user")
def step_impl(context):
  driver = webdriver.Chrome()
  driver.get(pages["landing"])
  driver.execute_script(f"window.localStorage.setItem('token', '{token}')")
  context.driver = driver


@when("they visit the {page_name} page")
def they_visit_the_landing_page(context, page_name):
  url = pages[page_name]
  assert url is not None
  context.driver.get(url)


@step("select “Add Task“ button")
def step_impl(context):
  login_button = context.driver.find_element(By.ID, button_ids["add_task"])
  login_button.click()


@step("fill with task valid information")
def step_impl(context):
  title_input = context.driver.find_element(By.ID, "input_task_title")
  title_input.send_keys("Title")
  description_input = context.driver.find_element(By.ID, "input_task_description")
  description_input.send_keys("Description")
  deadline_input = context.driver.find_element(By.ID, "input_task_deadline")
  deadline_input.send_keys("12/12/2024")
  priority_select_input = context.driver.find_element(By.ID, "input_task_select")
  priority_select_input.click()
  priority_high_option_input = context.driver.find_element(By.ID, "input_task_option_high")
  priority_high_option_input.click()
  confirm_button = context.driver.find_element(By.ID, "task_confirm_button")
  confirm_button.click()




@then("the new task should appear on the to-do list")
def step_impl(context):
  title = WebDriverWait(context.driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "[id$='_task_todo_Title']"))
  )
  assert title is not None


@step("it should display the tasks title, deadline and priority.")
def step_impl(context):
  title = WebDriverWait(context.driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "[id$='_task_todo_Title']"))
  )
  deadline = WebDriverWait(context.driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "[id$='_deadline_todo_Title']"))
  )
  priority = WebDriverWait(context.driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, "[id$='_task_todo_Title_icon_high'"))
  )

  assert title is not None
  assert deadline is not None
  assert deadline.text == "2024-12-12"
  assert priority is not None
