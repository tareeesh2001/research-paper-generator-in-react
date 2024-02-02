# app/__init__.py
from flask import Flask, jsonify, render_template, request
from flask import redirect, url_for
import json
from app.model import generate_outline, generate_content_for_heading
from flask_cors import CORS

app = Flask(__name__, template_folder="../templates")
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
CORS(app)

@app.route('/')
def index():
    return render_template('index.html', name="tareesh")

@app.route('/generate', methods=['POST'])
def generate_route():
    if request.method == 'POST':
        prompt = request.json['prompt']
        # print("PROMPT", prompt)
        
        generated_outline = generate_outline(prompt)
        print(generated_outline)

        return jsonify({"response": generated_outline})
    
@app.route('/generate-content', methods=['GET'])
def generate_content_route():
    headings = request.args.get('headings')
    if headings:
        headings = json.loads(headings)
        # Use the headings to generate content separately
        content = []
        for heading in headings:
            heading_content = generate_content_for_heading(heading)
            # content[heading] = heading_content
            content.append({heading: heading_content})

        #return render_template('index.html', content=content)
        return jsonify(content)
    else:
        # Handle case where no headings are selected
        return redirect(url_for('index'))
