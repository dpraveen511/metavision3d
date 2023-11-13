# app.py
from flask import Flask, jsonify, send_from_directory, request
import os
import mimetypes
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from utils import create_boundary, compute_maximum, compute_custome_maximum, invert, compute_projection
app = Flask(__name__)
CORS(app)

@app.route('/api/greeting')
def greeting():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/listfiles')
def list_files():
    try:
        files = [f for f in os.listdir('../Data/Original')] 
        mime_type, _ = mimetypes.guess_type('.Images/ColumnMajorOrder.gii')
        print("here")
        print(f"MIME type of column: {mime_type}")
        print(os.path.isfile(files[0])) #if os.path.isfile(os.path.join('.Images', f))]
        return jsonify({"files": files})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/file', methods=['GET'])
def get_file():
    file_name = request.args.get('filename')
    try:
        
        return send_from_directory(directory='./Images', path=file_name)
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500  

@app.route('/api/max', methods=['GET'])
def calc_custom_max():
    file_name = request.args.get('fileName')
    smooth = request.args.get('smooth')
    maxPercentile = request.args.get('max')
    print(file_name)
    try:
        result = compute_custome_maximum(file_name, maxPercentile, smooth)
        print("custom max projection got computed")
        return jsonify({"url": f'http://localhost:3001/Temp/{result}'})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500     


@app.route('/api/project', methods=['GET'])
def calc_projection():
    file_name = request.args.get('fileName')
    smooth = request.args.get('smooth')
    max = request.args.get('max')
    min = request.args.get('min')
    print(file_name)
    try:
        result = compute_projection(file_name, min, max, smooth)
        print("custom max projection got computed")
        return jsonify({"url": f'http://localhost:3001/Temp/{result}'})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500 
    

def check_files():
    print("checkfile scheduler is running")
    folderA = '../Data/Original'
    folderB = '../Data/Boundary'
    folderC = '../Data/Maximum'
    folderD = '../Data/Inverted'
    try:
        filesA = set(os.listdir(folderA))
        filesB = set(os.listdir(folderB))
        filesC = set(os.listdir(folderC))
        filesD = set(os.listdir(folderD))
        
        missing_filesAB = filesA - filesB
        missing_filesAC = filesA - filesC
        missing_filesAD = filesA - filesD
        
        if missing_filesAB:
            for missing_file in missing_filesAB:
                print("creating boundary for :",missing_file)
                create_boundary(missing_file)
        else:
            print("All files from FolderA are present in FolderB.")
        if missing_filesAC:
            for missing_file in missing_filesAC:
                print("computing maximum for:", missing_file)
                compute_maximum(missing_file)
        else:
            print("All files from FolderA are present in FolderC.")
        if missing_filesAD:
            for missing_file in missing_filesAD:
                print("computing maximum for:", missing_file)
                invert(missing_file)
        else:
            print("All files from FolderA are present in FolderC.")
        
    except Exception as e:
        print(f"Error checking files: {str(e)}")

# Initialize the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=check_files, trigger="interval", minutes=1)
scheduler.start()
if __name__ == '__main__':
    app.run(debug=False,port=5000)