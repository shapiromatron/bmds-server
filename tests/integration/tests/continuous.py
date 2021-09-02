import helium as h


def test_continuous_individual(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)
    h.click("Create a new BMDS analysis")
    h.wait_until(lambda: h.Text("Model Class").exists())
    assert "/analysis/" in driver.current_url

    dataset_selector = driver.find_element_by_xpath("//select[@name='dataset-type']")
    dataset_selector.send_keys("Continuous")

    h.wait_until(h.Text("Data").exists)
    h.click(("Data"))
    assert "/data" in driver.current_url

    datasetType_selector = driver.find_element_by_xpath("//select[@id='selectModel']")
    datasetType_selector.send_keys("Individual")

    h.wait_until(h.Text("Create").exists)
    h.click(("Create"))

    h.wait_until(h.Text("Load an example dataset").exists)
    h.click(("Load an example dataset"))

    h.click("Logic")
    decision_table_row = driver.find_elements_by_xpath("//*[@id='decision-logic']/tbody/tr")
    assert len(decision_table_row) == 4

    decision_table_row = driver.find_elements_by_xpath("//*[@id='rule-table']/tbody/tr")
    assert len(decision_table_row) == 22

    h.click(("Settings"))

    h.wait_until(h.Text("Save Analysis").exists)
    h.click(("Save Analysis"))

    if can_execute:
        h.click("Run Analysis")
        h.wait_until(lambda: not h.Text("Executing, please wait...").exists())
        h.click("Output")
        assert "/output" in driver.current_url

    if can_execute:
        row = driver.find_elements_by_xpath("//*[@id='frequentist-model-result']/tbody/tr")
        assert len(row) == 10

        driver.find_element_by_id("Hill").click()
        row = driver.find_elements_by_xpath("//*[@id='info-table']/tbody/tr")

    h.go_to(root_url)


def test_continuous_summary(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)
    h.click("Create a new BMDS analysis")
    h.wait_until(lambda: h.Text("Model Class").exists())
    assert "/analysis/" in driver.current_url

    dataset_selector = driver.find_element_by_xpath("//select[@name='dataset-type']")
    dataset_selector.send_keys("Continuous")

    h.wait_until(h.Text("Data").exists)
    h.click(("Data"))
    assert "/data" in driver.current_url

    h.wait_until(h.Text("Create").exists)
    h.click(("Create"))

    h.wait_until(h.Text("Load an example dataset").exists)
    h.click(("Load an example dataset"))

    h.click("Logic")
    decision_table_row = driver.find_elements_by_xpath("//*[@id='decision-logic']/tbody/tr")
    assert len(decision_table_row) == 4

    decision_table_row = driver.find_elements_by_xpath("//*[@id='rule-table']/tbody/tr")
    assert len(decision_table_row) == 22

    h.click(("Settings"))

    h.wait_until(h.Text("Save Analysis").exists)
    h.click(("Save Analysis"))

    if can_execute:
        h.click("Run Analysis")
        h.wait_until(lambda: not h.Text("Executing, please wait...").exists())
        h.click("Output")
        assert "/output" in driver.current_url

    if can_execute:
        row = driver.find_elements_by_xpath("//*[@id='frequentist-model-result']/tbody/tr")
        assert len(row) == 10
        driver.find_element_by_id("Hill").click()
        row = driver.find_elements_by_xpath("//*[@id='info-table']/tbody/tr")
        assert len(row) == 3

    h.go_to(root_url)
