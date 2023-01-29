"""
Twitter Bootstrap 4 - helper methods
"""
from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.tag(name="card")
def bs4_card(parser, token):
    args = token.contents.split()
    div_class = args[1] if len(args) > 1 else ""
    nodelist = parser.parse(("endcard",))
    parser.delete_first_token()
    return CardWrapperNode(nodelist, div_class)


class CardWrapperNode(template.Node):
    def __init__(self, nodelist, div_class: str):
        self.nodelist = nodelist
        self.div_class = div_class

    def render(self, context):
        output = self.nodelist.render(context)
        output = f'<div class="card shadow mb-4"><div class="card-body">{output}</div></div>'
        if self.div_class:
            output = f'<div class="{self.div_class}">{output}</div>'
        return output


@register.simple_tag
def icon(name: str, classes: str = "pr-1"):
    return mark_safe(f'<span class="bi bi-{name} {classes}" aria-hidden="true"></span>')
