import os
from behave import given, step, then, when
from selenium import webdriver
from selenium.webdriver.common.by import By

LOGIN_URL = os.environ.get("LOGIN_URL")
SIGN_UP_URL = os.environ.get("SIGN_UP_URL")

pages = {
    "login": LOGIN_URL,
    "sign-up": SIGN_UP_URL
}


@given("a new user,")
def given_a_new_user(context):
    context.driver = webdriver.Chrome()


@when("they visit the landing page")
def they_visit_the_landing_page(context):
    context.driver.get("http://localhost:4200/")


@step("select “{button_text}“ button,")
def select_button_with_text(context, button_text):
    login_button = context.driver.find_element(By.XPATH, f"//button[text()='{button_text}']")
    login_button.click()


@then("the user should be redirected to the {page_name} page.")
def the_user_should_be_redirected_to_the_following_page(context, page_name):
    current_url = context.driver.current_url
    expected_url = pages[page_name]
    print(expected_url)
    assert expected_url is not None
    assert current_url == expected_url



