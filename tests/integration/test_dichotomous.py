from urllib.parse import urlparse

import helium as h


def test_dichotomous():
    driver = h.start_chrome("http://localhost:5550")
    h.set_driver(driver)
    h.click("Create a new BMDS session")
    driver.find_element_by_xpath(
        "//select[@id='dataset-type']/option[text()='Dichotomous']"
    ).click()
    h.click("Data")
    assert urlparse(driver.current_url).fragment == "/data"
    h.click("Add Dataset")
    h.click("Main")
    assert urlparse(driver.current_url).fragment == "/"

    driver.find_element_by_id("enable-model").click()
    assert driver.find_element_by_id("enable-model").is_selected() == True

    driver.find_element_by_name("frequentist_restricted-Gamma").click()
    assert driver.find_element_by_name("frequentist_restricted-Gamma").is_selected() == True
    h.click("Save Analysis")

    h.wait_until(h.Button("Run Analysis").exists)
    h.click("Run Analysis")
    h.click("Output")
    assert urlparse(driver.current_url).fragment == "/output"
