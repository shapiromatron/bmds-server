import helium as h


def test_continuous_individual(driver, root_url, can_execute: bool):
    h.set_driver(driver)
    h.go_to(root_url)
    h.click("Create a new BMDS analysis")

    # click main
    # update settings and select a model frequentist modal and a bayesian model (power)
    # create an option set

    # create new dataset; load default

    # click logic tab; confirm content exists

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

    # click main
    # update settings and select a model frequentist modal and a bayesian model (power)
    # create an option set

    # create new dataset; load default

    # click logic tab; confirm content exists

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
