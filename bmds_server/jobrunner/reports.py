import io
import json

import bmds
import numpy as np
from docx import Document

from .constants import (
    bmrType,
    deviances_headers,
    document_header,
    gof_headers,
    likelihood_headers,
    parameters,
    riskType,
    test_rows_headers,
    variables,
)


class Reports:
    def createReport(instance):
        f = io.BytesIO()
        document = Document()
        instance_dict = json.loads(instance.outputs)
        model_type = instance_dict["inputs"]["dataset_type"]
        outputs = instance_dict["outputs"]
        print(model_type)
        for i in range(len(outputs)):
            document.add_heading(document_header[model_type], 0)
            for j in range(len(outputs[i]["models"])):
                document.add_heading(outputs[i]["models"][j]["model_name"], 1)
                # model options table
                if model_type == bmds.constants.CONTINUOUS:
                    model_settings = {
                        "BMR Type": bmrType[outputs[i]["models"][j]["settings"]["bmrType"]],
                        "BMRF": outputs[i]["models"][j]["settings"]["bmr"],
                        "Tail Proability": outputs[i]["models"][j]["settings"]["tailProb"],
                        "Confidence Level": outputs[i]["models"][j]["settings"]["alpha"],
                        "Distribution Type": outputs[i]["models"][j]["settings"]["restriction"],
                        "Variance Type": outputs[i]["models"][j]["settings"]["varType"],
                    }
                elif model_type == bmds.constants.DICHOTOMOUS:
                    model_settings = {
                        "Risk Type": riskType[outputs[i]["models"][j]["settings"]["bmrType"]],
                        "BMRF": outputs[i]["models"][j]["settings"]["bmr"],
                        "Confidence Level": outputs[i]["models"][j]["settings"]["alpha"],
                        "Background": outputs[i]["models"][j]["settings"]["background"],
                    }

                document.add_heading("model options", level=1)
                table = document.add_table(rows=1, cols=2)
                table.style = "Table Grid"
                table.autofit
                for k, v in model_settings.items():
                    row_cells = table.add_row().cells
                    row_cells[0].text = k
                    row_cells[1].text = str(v)

                model_data = {
                    "Dependent Variable": "Dose",
                    "Independent Variable": variables[model_type],
                    "Number of Observation": len(outputs[i]["dataset"]["doses"]),
                }
                if model_type == bmds.constants.CONTINUOUS:
                    model_data["Adverse Direction"] = outputs[i]["dataset"]["adverse_direction"]
                document.add_heading("Model Data", level=1)
                table = document.add_table(rows=1, cols=2)
                table.style = "Table Grid"
                table.autofit
                for k, v in model_data.items():
                    row_cells = table.add_row().cells
                    row_cells[0].text = k
                    row_cells[1].text = str(v)

                benchmark_dose = {
                    "BMD": outputs[i]["models"][j]["results"]["bmd"],
                    "BMDL": outputs[i]["models"][j]["results"]["bmdl"],
                    "BMDU": outputs[i]["models"][j]["results"]["bmdu"],
                    "AIC": outputs[i]["models"][j]["results"]["aic"],
                }
                if model_type == bmds.constants.DICHOTOMOUS:
                    benchmark_dose["P-value"] = outputs[i]["models"][j]["results"]["gof"]["p_value"]
                    benchmark_dose["Chi Square"] = outputs[i]["models"][j]["results"]["gof"][
                        "chi_square"
                    ]
                    benchmark_dose["D.O.F"] = outputs[i]["models"][j]["results"]["gof"]["df"]
                document.add_heading("Benchmark Dose", level=1)
                table = document.add_table(rows=1, cols=2)
                table.style = "Table Grid"
                table.autofit
                for k, v in benchmark_dose.items():
                    row_cells = table.add_row().cells
                    row_cells[0].text = k
                    row_cells[1].text = str(v)

                parameter = parameters[outputs[i]["models"][j]["model_name"]]
                parameter_values = outputs[i]["models"][j]["results"]["parameters"]
                model_parameter = list(zip(parameter, parameter_values))
                document.add_heading("Model Parameter", level=1)
                table = document.add_table(rows=2, cols=2)
                table.style = "Table Grid"
                table.autofit
                heading_cells = table.rows[0].cells
                heading_cells[0].text = "# of Paramters"
                heading_cells[1].text = str(len(parameter))
                heading_cells = table.rows[1].cells
                heading_cells[0].text = "variable"
                heading_cells[1].text = "Paramters"
                for p in model_parameter:
                    row_cells = table.add_row().cells
                    row_cells[0].text = p[0]
                    row_cells[1].text = str(p[1])
                document.add_page_break()

                if model_type == bmds.constants.CONTINUOUS:
                    gof = outputs[i]["models"][j]["results"]["gof"]
                elif model_type == bmds.constants.DICHOTOMOUS:
                    gof = outputs[i]["models"][j]["results"]["gof"]["rows"]

                gof_headers_list = gof_headers[model_type]
                document.add_heading("Goodness of Fit", level=1)
                table = document.add_table(rows=1, cols=len(gof_headers_list))
                table.style = "Table Grid"
                table.autofit
                heading_cells = table.rows[0].cells

                for k in range(len(gof_headers_list)):
                    heading_cells[k].text = gof_headers_list[k]
                if model_type == bmds.constants.CONTINUOUS:
                    for p in gof:
                        row_cells = table.add_row().cells
                        row_cells[0].text = str(p["dose"])
                        row_cells[1].text = str(p["size"])
                        row_cells[2].text = str(round(p["est_mean"], 4))
                        row_cells[3].text = str(p["calc_median"])
                        row_cells[4].text = str(p["obs_mean"])
                        row_cells[5].text = str(round(p["est_stdev"], 4))
                        row_cells[6].text = str(p["calc_gsd"])
                        row_cells[7].text = str(p["obs_stdev"])
                        row_cells[8].text = str(round(p["scaled_residual"], 4))
                elif model_type == bmds.constants.DICHOTOMOUS:
                    for p in gof:
                        row_cells = table.add_row().cells
                        row_cells[0].text = str(p["dose"])
                        row_cells[1].text = str(round(p["est_prob"], 4))
                        row_cells[2].text = str(p["expected"])
                        row_cells[3].text = str(p["observed"])
                        row_cells[4].text = str(p["size"])
                        row_cells[5].text = str(round(p["scaled_residual"], 4))

                if model_type == bmds.constants.CONTINUOUS:
                    likelihood_of_interest = outputs[i]["models"][j]["results"]["loglikelihoods"]
                    document.add_heading("Likelihoods of Interest", level=1)
                    table = document.add_table(rows=1, cols=len(likelihood_headers))
                    table.style = "Table Grid"
                    table.autofit
                    heading_cells = table.rows[0].cells
                    for k in range(len(likelihood_headers)):
                        heading_cells[k].text = likelihood_headers[k]

                    for p in likelihood_of_interest:
                        row_cells = table.add_row().cells
                        row_cells[0].text = str(p["model"])
                        row_cells[1].text = str(round(p["loglikelihood"], 4))
                        row_cells[2].text = str(p["n_parms"])
                        row_cells[3].text = str(round(p["aic"], 4))

                    test_rows = outputs[i]["models"][j]["results"]["test_rows"]
                    document.add_heading("Test of Interest", level=1)
                    table = document.add_table(rows=1, cols=len(test_rows_headers))
                    table.style = "Table Grid"
                    table.autofit
                    heading_cells = table.rows[0].cells
                    for k in range(len(test_rows_headers)):
                        heading_cells[k].text = test_rows_headers[k]

                    for p in test_rows:
                        row_cells = table.add_row().cells
                        row_cells[0].text = str(p["test_number"])
                        row_cells[1].text = str(round(p["deviance"], 4))
                        row_cells[2].text = str(p["df"])
                        row_cells[3].text = str(round(p["p_value"], 4))

                if model_type == bmds.constants.DICHOTOMOUS:
                    deviances = outputs[i]["models"][j]["results"]["deviances"][0]
                    document.add_heading("Analysis of Deviance", level=1)
                    table = document.add_table(rows=1, cols=len(deviances_headers))
                    table.style = "Table Grid"
                    table.autofit
                    heading_cells = table.rows[0].cells
                    for k in range(len(deviances_headers)):
                        heading_cells[k].text = deviances_headers[k]

                    deviance_list = [
                        {
                            "model": "Full Model",
                            "ll_full": round(deviances["ll_full"], 4),
                            "n_parm_full": round(deviances["n_parm_full"], 4),
                            "dev_full": "",
                            "df_full": "",
                            "pv_full": "",
                        },
                        {
                            "model": "Fitted Model",
                            "ll_fitted": "",
                            "n_parm_fit": deviances["n_parm_fit"],
                            "dev_fit": round(deviances["dev_fit"], 4),
                            "df_fit": deviances["df_fit"],
                            "pv_fit": round(deviances["pv_fit"], 4),
                        },
                        {
                            "model": "Reduced Model",
                            "ll_reduced": round(deviances["ll_reduced"], 4),
                            "n_parm_reduced": deviances["n_parm_reduced"],
                            "dev_reduced": round(deviances["dev_reduced"], 4),
                            "df_reduced": deviances["df_reduced"],
                            "pv_reduced": round(deviances["pv_reduced"], 4),
                        },
                    ]

                    for k in range(len(deviance_list)):
                        row_cells = table.add_row().cells
                        for col in range(len(deviance_list[k].keys())):
                            row_cells[col].text = str(
                                deviance_list[k][list(deviance_list[k].keys())[col]]
                            )

                cdf_values = outputs[i]["models"][j]["results"]["cdf"]
                percentile_value = np.arange(0.01, 1, 0.01)
                cdf = list(zip(percentile_value, cdf_values))

                document.add_heading("CDF", level=1)
                table = document.add_table(rows=1, cols=2)
                table.style = "Table Grid"
                table.autofit
                heading_cells = table.rows[0].cells
                heading_cells[0].text = "Percentile"
                heading_cells[1].text = "BMD"
                for k in cdf:
                    row_cells = table.add_row().cells
                    row_cells[0].text = str(round(k[0], 2))
                    row_cells[1].text = str(k[1])
                document.add_page_break()

        document.save(f)
        return f
