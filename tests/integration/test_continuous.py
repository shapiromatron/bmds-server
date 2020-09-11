import json
from urllib.parse import urlparse

import helium as h


def test_continuousSummarized():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Data")
    assert urlparse(driver.current_url).fragment == "/data"

    h.click("Add Dataset")
    h.click("Main")
    assert urlparse(driver.current_url).fragment == "/"

    driver.find_element_by_id("enable-model").click()
    if driver.find_element_by_id("enable-model").is_selected():
        assert True

    driver.find_element_by_name("frequentist_restricted-Hill").click()
    if driver.find_element_by_name("frequentist_restricted-Hill").is_selected():
        assert True
    h.click("Save Analysis")

    h.wait_until(h.Button("Run Analysis").exists)
    h.click("Run Analysis")
    h.click("Output")
    assert urlparse(driver.current_url).fragment == "/output"


def test_CSLogic():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Data")
    assert urlparse(driver.current_url).fragment == "/data"

    h.click("Add Dataset")
    h.click("Logic")
    assert urlparse(driver.current_url).fragment == "/logic"
    driver.find_element_by_id("sufficiently_close_bmdl").clear()
    driver.find_element_by_id("sufficiently_close_bmdl").send_keys(4)
    input_value = driver.find_element_by_id("sufficiently_close_bmdl").get_attribute("value")
    assert input_value == "4"
    h.click("Main")
    assert urlparse(driver.current_url).fragment == "/"

    driver.find_element_by_id("enable-model").click()
    if driver.find_element_by_id("enable-model").is_selected():
        assert True

    driver.find_element_by_name("frequentist_restricted-Hill").click()
    if driver.find_element_by_name("frequentist_restricted-Hill").is_selected():
        assert True
    h.click("Save Analysis")

    h.wait_until(h.Button("Run Analysis").exists)
    h.click("Run Analysis")
    h.click("Output")
    assert urlparse(driver.current_url).fragment == "/output"


def test_BMD_Missing_False():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Data")
    assert urlparse(driver.current_url).fragment == "/data"

    h.click("Add Dataset")
    h.click("Logic")
    assert urlparse(driver.current_url).fragment == "/logic"
    driver.find_element_by_id("enabled_continuous").click()
    h.click("Main")
    assert urlparse(driver.current_url).fragment == "/"

    driver.find_element_by_id("enable-model").click()
    if driver.find_element_by_id("enable-model").is_selected():
        assert True

    driver.find_element_by_name("frequentist_restricted-Hill").click()
    if driver.find_element_by_name("frequentist_restricted-Hill").is_selected():
        assert True
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    if payloadJson["data"]["logic"]["rules"]["bmd_missing"]["enabled_continuous"] is False:
        assert True
    h.click("Save Analysis")

    h.wait_until(h.Button("Run Analysis").exists)
    h.click("Run Analysis")
    h.click("Output")
    assert urlparse(driver.current_url).fragment == "/output"
