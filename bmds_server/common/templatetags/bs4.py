"""
Twitter Bootstrap 4 - helper methods
"""
from django import template

register = template.Library()


@register.tag(name="card")
def bs4_card(parser, token):
    args = token.contents.split()
    div_class = args[1] if len(args) > 1 else ""
    nodelist = parser.parse(("endcard",))
    parser.delete_first_token()
    return CardWrapperNode(nodelist, div_class)


class CardWrapperNode(template.Node):
    def __init__(self, nodelist, div_class):
        self.nodelist = nodelist
        self.div_class = div_class

    def render(self, context):
        output = self.nodelist.render(context)
        pre = f'<div class="{self.div_class}"><div class="card shadow mb-4"><div class="card-body">'
        post = "</div></div></div>"
        print(pre)
        return pre + output + post
