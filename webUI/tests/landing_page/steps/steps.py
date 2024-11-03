import os
import time

import pytest
from behave import given, step, then, when
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

load_dotenv()

LOGIN_URL = os.environ.get("LOGIN_URL")
SIGN_UP_URL = os.environ.get("SIGN_UP_URL")
EMAIL = os.environ.get("EMAIL")
PASSWORD = os.environ.get("PASSWORD")

pages = {
    "login": LOGIN_URL,
    "sign-up": SIGN_UP_URL,
    "landing": "http://localhost:4200",
    "home": "http://localhost:4200/home"
}


@given("a new user,")
def given_a_new_user(context):
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1200,1200")
    context.driver = webdriver.Chrome(options=options)


@when("they visit the {page_name} page")
def they_visit_the_landing_page(context, page_name):
    url = pages[page_name]
    assert url is not None
    context.driver.get(url)


@step("select “{button_text}“ button,")
def select_button_with_text(context, button_text):
    login_button = context.driver.find_element(By.XPATH, f"//button[text()='{button_text}']")
    login_button.click()


@then("the user should be redirected to the {page_name} page.")
def the_user_should_be_redirected_to_the_following_page(context, page_name):
    expected_url = pages[page_name]
    WebDriverWait(context.driver, 10).until(
      EC.url_to_be(expected_url)
    )
    current_url = context.driver.current_url
    assert expected_url is not None
    assert current_url == expected_url


@step("provide valid information,")
def step_impl(context):
    email_input = context.driver.find_element(By.NAME, "username")
    password_input = context.driver.find_element(By.NAME, "password")
    email_input.send_keys(EMAIL)
    password_input.send_keys(PASSWORD)


@step("select the “{button_name}“ button,")
def step_impl(context, button_name):
    button = context.driver.find_element(By.NAME, button_name)
    button.click()


@step("fill code verification,")
def step_impl(context):
    code = input("Enter the verification code: ")
    code_input = context.driver.find_element(By.ID, "verification_code")
    code_input.send_keys(code)


@step("enter valid credentials (email and password),")
def step_impl(context):
    email_input = context.driver.find_element(By.ID, "signInFormUsername")
    password_input = context.driver.find_element(By.ID, "signInFormPassword")
    email_input.send_keys(EMAIL)
    password_input.send_keys(PASSWORD)



