import helium as h


def test_dichotomous(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)

    # create a new analysis
    h.click("Create a new BMDS analysis")
    h.wait_until(h.Text("Model Type").exists)
    assert "/analysis/" in driver.current_url

    # set main settings pages
    h.select("Model Type", "Dichotomous")

    # select a bayesian
    h.click(h.S("#bayesian-Logistic"))
    assert driver.find_element_by_id("bayesian-Logistic").is_selected()

    # load example dataset
    h.wait_until(h.Text("Data").exists)
    h.click("Data")
    assert "/data" in driver.current_url

    h.wait_until(h.Text("Create").exists)
    h.select("New dataset", "Dichotomous")
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
        assert len(h.find_all(h.S("#frequentist-model-result tbody tr"))) == 13
        assert len(h.find_all(h.S("#bayesian-model-result tbody tr"))) == 2

        # display frequentist modal
        h.click(h.S("#freq-result-2"))
        h.wait_until(h.S(".modal-body").exists)
        assert len(h.find_all(h.S("#info-table tbody tr"))) == 3
        h.click(h.S("#close-modal"))

        # scroll-down for visibility
        h.scroll_down(1000)

        # display bayesian modal
        h.click(h.S("#bayesian-result-0"))
        h.wait_until(h.S(".modal-body").exists)
        assert len(h.find_all(h.S("#info-table tbody tr"))) == 3
        h.click(h.S("#close-modal"))

        # display bayesian modal average modal
        h.click(h.S("#bayesian-result-ma"))
        h.wait_until(h.S(".modal-body").exists)
        assert len(h.find_all(h.S("#ma-result-summary tbody tr"))) == 3
        h.click(h.S("#close-modal"))

        # now scroll back up
        h.scroll_up(1000)

    # check logic visibility
    h.click("Logic")
    assert len(h.find_all(h.S("#decision-logic tbody tr"))) == 4
    assert len(h.find_all(h.S("#rule-table tbody tr"))) == 22

    # done!
    h.go_to(root_url)
