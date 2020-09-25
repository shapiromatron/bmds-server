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


def test_gmail():
    driver = h.start_chrome("https://gmail.com")
    h.set_driver(driver)
    h.write("bhanbish@gmail.com", into="Email or phone")
    h.click("Next")
    h.write("zlatan3725", into="password")


def test_analysisName():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    analysis_name = driver.find_element_by_id("analysis_name")
    analysis_name.send_keys("Set 1")
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    assert payloadJson["data"]["analysis_name"] == "Set 1"


def test_analysisNameFailed():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    analysis_name = driver.find_element_by_id("analysis_name")
    analysis_name.send_keys("Set 1")
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    assert payloadJson["data"]["analysis_name"] != "Set 2"


def test_analysisDescription():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    analysis_name = driver.find_element_by_id("analysis_description")
    analysis_name.send_keys("this is a new description")
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    assert payloadJson["data"]["analysis_description"] == "this is a new description"


def test_analysisDescriptionFail():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    analysis_name = driver.find_element_by_id("analysis_description")
    analysis_name.send_keys("this is a new description")
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    if payloadJson["data"]["analysis_description"] == "a different text":
        raise AssertionError


def test_dataPath():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Data")
    assert urlparse(driver.current_url).fragment == "/data"


def test_dataPathFailed():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Data")
    if urlparse(driver.current_url).fragment == "/logic":
        raise AssertionError


def test_logicPath():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Logic")
    assert urlparse(driver.current_url).fragment == "/logic"


def test_ouputPath():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Output")
    assert urlparse(driver.current_url).fragment == "/output"


def test_mainPath():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Logic")
    assert urlparse(driver.current_url).fragment == "/logic"
    h.click("Main")
    assert urlparse(driver.current_url).fragment == "/"


def test_mainPathFailed():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Logic")
    assert urlparse(driver.current_url).fragment == "/logic"
    h.click("Main")
    if urlparse(driver.current_url).fragment == "/main":
        raise AssertionError


def test_changeBMRType():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    driver.find_element_by_xpath("//select[@id='bmr_type']/option[text()='Rel. Dev.']").click()
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    assert payloadJson["data"]["options"][0]["bmr_type"] == "Rel. Dev."


def test_changeBMRTypeFailed():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    driver.find_element_by_xpath("//select[@id='bmr_type']/option[text()='Rel. Dev.']").click()
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    if payloadJson["data"]["options"][0]["bmr_type"] != "Rel. Dev.":
        raise AssertionError


def test_changeBMRType():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    h.click("Data")
    h.click("Add Dataset")
    h.click("Main")
    assert urlparse(driver.current_url).fragment == "/"

    driver.find_element_by_id("enable-model").click()
    if driver.find_element_by_id("enable-model").is_selected():
        assert True
    payload = driver.find_element_by_name("payload").text
    payloadJson = json.loads(payload)
    assert payloadJson["data"]["datasets"][0]["model_type"] == "CS"
