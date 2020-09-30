import json
from urllib.parse import urlparse
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

import helium as h


def test_dichotomous(driver, root_url):
    h.set_driver(driver)
    h.go_to(root_url)
    h.click("Create a new BMDS session")
    h.wait_until(h.Button("Save Analysis").exists)
    driver.find_element_by_xpath(
        "//select[@id='dataset-type']/option[text()='Dichotomous']"
    ).click()
    h.click("Data")
    assert urlparse(driver.current_url).fragment == "/data"
    h.click("Add Dataset")
    h.click("Main")
    assert urlparse(driver.current_url).fragment == "/"

    driver.find_element_by_id("enable-model").click()
    assert driver.find_element_by_id("enable-model").is_selected()

    driver.find_element_by_name("frequentist_restricted-Gamma").click()
    assert driver.find_element_by_name("frequentist_restricted-Gamma").is_selected()

    h.click("Save Analysis")

    h.wait_until(h.Button("Run Analysis").exists)
    h.click("Run Analysis")
    h.click("Output")
    assert urlparse(driver.current_url).fragment == "/output"


def test_modelTypeDichotomous(driver, root_url):
    h.set_driver(driver)
    h.go_to(root_url)
    h.click("Create a new BMDS session")
    h.wait_until(h.Button("Save Analysis").exists)
    driver.find_element_by_xpath(
        "//select[@id='dataset-type']/option[text()='Dichotomous']"
    ).click()
    h.click("Data")
    h.click("Add Dataset")
    h.click("Main")
    assert urlparse(driver.current_url).fragment == "/"

    driver.find_element_by_id("enable-model").click()
    assert driver.find_element_by_id("enable-model").is_selected()
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    assert payloadJson["data"]["datasets"][0]["model_type"] == "DM"
