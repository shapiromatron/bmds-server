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
