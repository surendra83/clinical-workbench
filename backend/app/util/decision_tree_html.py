import json
# Function to convert JSON to HTML
def html_convert(data):
    def render_node(node):
        html = "<li>"
        #html += f"<div class='node'><span class='member'>{node.get('member_id', '')}</span></div>"
        if  node.get('children'):
             html += f"<div class='logical-section'><div class='item-type'> Type: <strong>{node['classification_type']}</strong></div><div class='item-logic'> Condition Relation: <strong class='logic-relation'>{node['logical_relation']}  </strong></div></div>"
             html += f"<div class='criteria'>{node.get('clinical_criteria', '')}</div>"
             html += f"<div class='content'> {node['content']}</div>"
             
        # Only include clinical_criteria if node has no children
        if not node.get('children'):   
                html += f"<div class='criteria'>{node['clinical_criteria']}</div>"
                html += f"<div class='content'> {node['content']}</div>"
                html += f"<div class='question'><strong>Question:</strong> {node['question']}</div>"

        if 'children' in node and node['children']:
            html += "<ul class='children-ul'>"
            for child in node['children']:
                html += render_node(child)
            html += "</ul>"
        html += "</li>"

        return html

    html_output = "<ul class='main-ul'>"
    for item in data:
        html_output += render_node(item)
    html_output += "</ul>"
    
    return html_output

# CSS for styling
css_styles = """
<style>
body {
    font-family: sans-serif;
    font-size: 12px;
}
.logical-section{
  display:flex;
  height:26px;
}
.item-type{
  flex: 0 0 200px; 
}
.item-logic{
  flex:0 0 75%
}

.logic-relation{
 font-size:12px;
 text-transform: uppercase;
}

h1 {
    color: #2c3e50;
    text-align:center;
    font-size:14px;
}
ul.main-ul {
    padding-left: 0px;
    list-style:none;
    border:1px solid #d1d1d1;
}
ul.main-ul li {
    margin-bottom: 2px;
    padding: 10px 10px;
    display:block;
}
ul.children-ul {
      border-left:1px solid #d1d1d1;
      border-top:1px solid #d1d1d1;
      list-style: none;
      display:block;
      margin-left:30px;
      margin-top:10px;
      padding:0px;
   }

ul.children-ul > li {   padding: 10px 10px; }

.children-ul::before {
  content: "";
  position: absolute;
  height: 1.5px;
  width:40px;
  margin-left:-40px;
  margin-top:20px;
  background-color: #ccc;
}

li:has(.logical-section) {
  border-top:1px solid #d1d1d1;
}

.node {
    font-weight: bold;
    color: #2c3e50;
}
.member {
    color: #2980b9;
}
.question {
    margin-left: 30px;
    color: #8e44ad;
}
.criteria {
    font-weight:bold;
    text-transform: capitalize; 
}
</style>
"""