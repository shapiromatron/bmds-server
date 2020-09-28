from urllib.parse import urlparse

import helium as h


def test_demo(driver, root_url):
    # set test to use our session-level driver
    h.set_driver(driver)

    # simple test
    h.go_to(root_url)
    h.click("Create a new BMDS session")
    h.click("Data")
    assert urlparse(driver.current_url).fragment == "/data"
