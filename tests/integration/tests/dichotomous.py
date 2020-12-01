from urllib.parse import urlparse

import helium as h


def test_dichotomous(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)
    h.click("Create a new BMDS session")

    h.wait_until(h.Text("Settings").exists)
    h.click("Settings")
    assert urlparse(driver.current_url).fragment == "/"
    h.wait_until(h.Button("Save Analysis").exists)
    driver.find_element_by_xpath(
        "//select[@id='dataset-type']/option[text()='Dichotomous']"
    ).click()

    h.click("Data")
    h.click("Add Dataset")
    assert urlparse(driver.current_url).fragment == "/data"

    h.click("Settings")
    assert urlparse(driver.current_url).fragment == "/"
    driver.find_element_by_name("frequentist_restricted-Gamma").click()
    assert driver.find_element_by_id("enable-model").is_selected()
    assert driver.find_element_by_name("frequentist_restricted-Gamma").is_selected()

    h.click("Save Analysis")
    h.wait_until(h.Button("Run Analysis").exists)
    h.click("Run Analysis")

    if can_execute:
        h.click("Output")
        assert urlparse(driver.current_url).fragment == "/output"
        h.wait_until(h.S("#results-table").exists)
        h.click(h.Text("Gamma"))
        h.wait_until(h.Text("Gamma - Details").exists)
