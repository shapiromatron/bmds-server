import helium as h


def test_continuous_individual(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)

    # create a new analysis
    h.click("Create a new BMDS analysis")
    h.wait_until(h.Text("Model Class").exists)
    assert "/analysis/" in driver.current_url

    # set main settings pages
    h.select("Model Class", "Continuous")

    # load example dataset
    h.wait_until(h.Text("Data").exists)
    h.click("Data")
    assert "/data" in driver.current_url

    h.wait_until(h.Text("Create").exists)
    h.select("New dataset", "Individual")
    h.click("Create")

    h.wait_until(h.Text("Load an example dataset").exists)
    h.click("Load an example dataset")

    # save
    h.click("Settings")
    h.wait_until(h.Text("Save Analysis").exists)
    h.click("Save Analysis")

    # only proceed if we can execute
    if can_execute:
        # execution works
        h.click("Run Analysis")
        h.wait_until(lambda: not h.Text("Executing, please wait...").exists())

        # outputs are available
        h.click("Output")
        assert "/output" in driver.current_url
        assert len(h.find_all(h.S("#frequentist-model-result tbody tr"))) == 10

        # display frequentist modal
        h.click(h.S("#freq-result-2"))
        h.wait_until(h.S(".modal-body").exists)
        assert len(h.find_all(h.S("#info-table tbody tr"))) == 3
        h.click(h.S("#close-modal"))

    # check logic visibility
    h.click("Logic")
    assert len(h.find_all(h.S("#decision-logic tbody tr"))) == 4
    assert len(h.find_all(h.S("#rule-table tbody tr"))) == 22

    # done!
    h.go_to(root_url)


def test_continuous_summary(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)

    # create a new analysis
    h.click("Create a new BMDS analysis")
    h.wait_until(h.Text("Model Class").exists)
    assert "/analysis/" in driver.current_url

    # set main settings pages
    h.select("Model Class", "Continuous")

    # load example dataset
    h.wait_until(h.Text("Data").exists)
    h.click("Data")
    assert "/data" in driver.current_url

    h.wait_until(h.Text("Create").exists)
    h.select("New dataset", "Summarized")
    h.click("Create")

    h.wait_until(h.Text("Load an example dataset").exists)
    h.click("Load an example dataset")

    # save
    h.click("Settings")
    h.wait_until(h.Text("Save Analysis").exists)
    h.click("Save Analysis")

    # only proceed if we can execute
    if can_execute:
        # execution works
        h.click("Run Analysis")
        h.wait_until(lambda: not h.Text("Executing, please wait...").exists())

        # outputs are available
        h.click("Output")
        assert "/output" in driver.current_url
        assert len(h.find_all(h.S("#frequentist-model-result tbody tr"))) == 10

        # display frequentist modal
        h.click(h.S("#freq-result-2"))
        h.wait_until(h.S(".modal-body").exists)
        assert len(h.find_all(h.S("#info-table tbody tr"))) == 3
        h.click(h.S("#close-modal"))

    # check logic visibility
    h.click("Logic")
    assert len(h.find_all(h.S("#decision-logic tbody tr"))) == 4
    assert len(h.find_all(h.S("#rule-table tbody tr"))) == 22

    # done!
    h.go_to(root_url)
