extensions = ["sphinx.ext.viewcode", "sphinx.ext.mathjax"]
templates_path = ["_templates"]
source_suffix = ".rst"

master_doc = "index"
project = "BMDS Server"
copyright = "2022, BMDS Server Team"

language = None
exclude_patterns = []
pygments_style = "sphinx"


# -- Options for HTML output ----------------------------------------------
html_theme = "alabaster"
html_theme_options = {
    "show_powered_by": False,
    "description": "A webserver for executing EPA's BMDS software",
    "github_user": "shapiromatron",
    "github_repo": "bmds-server",
    "github_count": False,
    "show_related": False,
    "sidebar_includehidden": False,
}
html_static_path = ["_static"]
html_sidebars = {"**": ["about.html", "navigation.html", "relations.html", "searchbox.html"]}
htmlhelp_basename = "BMDSdoc"
