import helium as h


def test_continuous_individual(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)
    h.click("Create a new BMDS analysis")

    h.wait_until(h.Text("Data").exists)
    h.click(("Data"))

    assert "/data" in driver.current_url

    h.wait_until(h.Text("Create").exists)
    h.click(("Create"))

    h.wait_until(h.Text("Load an example dataset").exists)
    h.click(("Load an example dataset"))

    h.click("Settings")
    driver.find_element_by_id("frequentist_unrestricted_Power").click()
    assert driver.find_element_by_id("frequentist_unrestricted_Power").is_selected()

    h.wait_until(h.Text("Save Analysis").exists)
    h.click(("Save Analysis"))

    h.wait_until(h.Text("Run Analysis").exists)
    h.click(("Run Analysis"))

    h.click(("Output"))

    assert "/output" in driver.current_url

    if can_execute:
        pass
        # click main tab
        # execute; wait until results works
        # confirm a modal popup exists

    # navigate to the read-only URL
    # click main/dataset/logic tabs and confirm all visible and content is shown
    if can_execute:
        # confirm content is shown
        pass

    h.go_to(root_url)


def test_continuous_summary(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)
    h.click("Create a new BMDS analysis")

    h.wait_until(h.Text("Data").exists)
    h.click(("Data"))

    assert "/data" in driver.current_url

    h.wait_until(h.Text("Create").exists)
    h.click(("Create"))

    h.wait_until(h.Text("Load an example dataset").exists)
    h.click(("Load an example dataset"))

    h.click("Settings")
    driver.find_element_by_id("frequentist_unrestricted_Power").click()
    assert driver.find_element_by_id("frequentist_unrestricted_Power").is_selected()

    h.wait_until(h.Text("Save Analysis").exists)
    h.click(("Save Analysis"))

    h.wait_until(h.Text("Run Analysis").exists)
    h.click(("Run Analysis"))

    h.click(("Output"))

    assert "/output" in driver.current_url

    if can_execute:
        pass
        # click main tab
        # execute; wait until results works
        # confirm a modal popup exists

    # navigate to the read-only URL
    # click main/dataset/logic tabs and confirm all visible and content is shown
    if can_execute:
        # confirm content is shown
        pass

    h.go_to(root_url)
