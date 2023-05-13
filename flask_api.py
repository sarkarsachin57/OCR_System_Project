from pdf2docx import parse
from pypdf import PdfReader
from typing import Tuple
import json

def convert_pdf2docs(input_file :str, output_file : str, pages: Tuple = None):

    if pages:
        pages = [int(i) for i in list(pages) if i.isnumeric()]
    result = parse(pdf_file=input_file,
                   docx_file= output_file, pages=pages)

    summary = {
        "File" : input_file, "Pages": str(pages), "Output File": output_file
    }

    print("## Summary #########################################################")
    print("\n".join("{}:{}".format(i, j) for i , j in summary.items()))
    print("#####################################################################")
    
    reader = PdfReader(input_file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    return text




from flask import Flask, render_template, Response, request, redirect, url_for
from flask_jsglue import JSGlue
from flask_cors import CORS, cross_origin	



app = Flask(__name__,  static_folder='', template_folder='')
app.config["Access-Control-Allow-Origin"] = "*"
app.config["Access-Control-Allow-Credentials"] = True
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
jsglue = JSGlue(app)

@app.route("/")
def index():

    print("Get Reqest for /")
    return render_template('index.html')

@app.route("/upload_pdf", methods=['POST'])
def upload_pdf():

    print("Get Reqest for /upload_pdf")

    try: 

        file = request.files['file'] 

        file.save("input.pdf")

        result = convert_pdf2docs(input_file = "input.pdf", output_file = "output.docx", pages = None)

        print("result :", result)
        
        res = {
                "status": "success",
                "data": result,
            }

        return json.dumps(res, separators=(',', ':'))
    
    except:

        res = {
                "status": "fail",
                "data": None,
            }

        return json.dumps(res, separators=(',', ':'))



if __name__ == '__main__':

    app.run(debug=True)