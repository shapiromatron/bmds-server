from copy import deepcopy

from bmds.bmds3.constants import ContinuousModelIds, DichotomousModelIds

from bmds_server.analysis.models import Analysis


class TestBmds3SessionBuild:
    def test_default_dichotomous(self, bmds3_complete_dichotomous):
        # assure a default dataset can be created
        data = deepcopy(bmds3_complete_dichotomous)
        session = Analysis.build_session(data, 0, 0)
        assert len(session.models) == 1

    def test_default_continuous(self, bmds3_complete_continuous):
        # assure a default dataset can be created
        data = deepcopy(bmds3_complete_continuous)
        session = Analysis.build_session(data, 0, 0)
        assert len(session.models) == 1

    def test_exponential_unpacking(self, bmds3_complete_continuous):
        data = deepcopy(bmds3_complete_continuous)
        data["models"] = {"frequentist_restricted": ["Exponential"]}
        session = Analysis.build_session(data, 0, 0)
        assert len(session.models) == 2
        assert session.models[0].bmd_model_class.id == ContinuousModelIds.c_exp_m3
        assert session.models[1].bmd_model_class.id == ContinuousModelIds.c_exp_m5

    def test_multistage_permutations(self, bmds3_complete_dichotomous):
        def _expected_degree(session, n: int):
            assert len(session.models) == n
            model_classes = set([model.bmd_model_class.id for model in session.models])
            assert model_classes == {DichotomousModelIds.d_multistage}
            degrees = set([model.settings.degree for model in session.models])
            assert degrees == set(list(range(1, n + 1)))

        # degree = 1
        data = deepcopy(bmds3_complete_dichotomous)
        data["models"] = {"frequentist_restricted": ["Multistage"]}
        data["dataset_options"][0]["degree"] = 1
        session = Analysis.build_session(data, 0, 0)
        _expected_degree(session, 1)

        # degree = 2
        data = deepcopy(bmds3_complete_dichotomous)
        data["models"] = {"frequentist_restricted": ["Multistage"]}
        data["dataset_options"][0]["degree"] = 2
        session = Analysis.build_session(data, 0, 0)
        _expected_degree(session, 2)

        # 3 dose-groups; degree = N-1; expected 2
        for num_doses in range(3, 8):
            expected_degree = min(max(num_doses - 1, 2), 4)
            data = deepcopy(bmds3_complete_dichotomous)
            data["datasets"] = [
                {
                    "dtype": "D",
                    "metadata": {"id": 123},
                    "doses": list(range(num_doses)),
                    "ns": list(range(num_doses)),
                    "incidences": list(range(num_doses)),
                }
            ]
            assert len(data["datasets"][0]["doses"]) == num_doses
            data["models"] = {"frequentist_restricted": ["Multistage"]}
            data["dataset_options"][0]["degree"] = 0  # n-1
            session = Analysis.build_session(data, 0, 0)
            print(f"{num_doses=} {expected_degree=}")
            _expected_degree(session, expected_degree)

        # degree = N -1, bayesian_model_average, fixed at degree == 2
        data = deepcopy(bmds3_complete_dichotomous)
        data["models"] = {"bayesian_model_average": [{"model": "Multistage", "prior_weight": 1}]}
        data["dataset_options"][0]["degree"] = 0
        session = Analysis.build_session(data, 0, 0)
        assert len(session.models) == 1
        model = session.models[0]
        assert model.bmd_model_class.id == DichotomousModelIds.d_multistage
        assert model.settings.degree == 2
