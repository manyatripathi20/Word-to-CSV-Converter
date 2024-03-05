from flask import Flask, request, jsonify, send_file
from docx import Document
import csv
from io import StringIO
from flask_cors import CORS  # Import the CORS module


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/', methods=['POST'])
def process_word_file():
    try:
        if 'file' not in request.files:
            return jsonify(error="Error: No file part")

        file = request.files['file']

        if file.filename == '':
            return jsonify(error="Error: No selected file")

        if file and file.filename.endswith('.docx'):
            word_data = read_word_file(file)
            csv_data = convert_to_csv(word_data)
            return jsonify(preview=csv_data)
        else:
            return jsonify(error="Error: Invalid file format. Please upload a .docx file.")

    except Exception as e:
        return jsonify(error=f"Error: {str(e)}")

@app.route('/download', methods=['POST'])
def download_csv():
    try:
        csv_data = request.form['csv_data']
        csv_file = StringIO(csv_data)
        return send_file(csv_file, as_attachment=True, download_name='output.csv', mimetype='text/csv')
    except Exception as e:
        return jsonify(error=f"Error: {str(e)}")

def read_word_file(file):
    document = Document(file)
    data = []

    for paragraph in document.paragraphs:
        data.append([paragraph.text])

    return data

def convert_to_csv(data):
    csv_data = StringIO()
    csv_writer = csv.writer(csv_data)

    for row in data:
        csv_writer.writerow(row)

    return csv_data.getvalue()

if __name__ == '__main__':
    app.run(debug=True)
