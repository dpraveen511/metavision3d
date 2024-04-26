# app.py
from flask import Flask, jsonify, send_from_directory, request
import os
import mimetypes
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler
from utils import create_boundary, compute_maximum, compute_custome_maximum, invert, compute_projection
import argparse
app = Flask(__name__)
CORS(app)

@app.route('/api/greeting')
def greeting():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/listfiles')
def list_files():
    try:
        disease = request.args.get('disease')
        if disease == "Alzhemier":
            files = [f for f in os.listdir('../Data/Alzhemier/Normal/Original') if not f.startswith('.')]
        elif disease == "Pompe":
            files = [f for f in os.listdir('../Data/Pompe/Normal/Original') if not f.startswith('.')]
        else:
            files = [f for f in os.listdir('../Data/Original') if not f.startswith('.')] 
        # mime_type, _ = mimetypes.guess_type('.Images/ColumnMajorOrder.gii')
        print("here")
        # print(f"MIME type of column: {mime_type}")
        print(os.path.isfile(files[0])) #if os.path.isfile(os.path.join('.Images', f))]
        return jsonify({"files": files})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
     

@app.route('/max', methods=['GET'])
def calc_custom_max():
    file_name = request.args.get('fileName')
    smooth = request.args.get('smooth')
    maxPercentile = request.args.get('max')
    session_id = request.args.get('session_id')
    base_url = request.args.get('url')
    disease = request.args.get('disease')
    print(file_name)
    try:
        result = compute_custome_maximum(file_name, maxPercentile, smooth, session_id,disease)
        print("custom max projection got computed")
        return jsonify({"url": f'{base_url}/data/Temp/{session_id}/{result}',"urld": f'{base_url}/data/Temp/{session_id}/disease_{result}'})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500     


@app.route('/project', methods=['GET'])
def calc_projection():
    file_name = request.args.get('fileName')
    smooth = request.args.get('smooth')
    max = request.args.get('max')
    min = request.args.get('min')
    session_id = request.args.get('session_id')
    base_url = request.args.get('url')
    disease = request.args.get('disease')
    print(file_name)
    try:
        result = compute_projection(file_name, min, max, smooth, session_id,disease)
        print("custom max projection got computed")
        return jsonify({"url": f'{base_url}/data/Temp/{session_id}/{result}',"urld": f'{base_url}/data/Temp/{session_id}/disease_{result}'})
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 500 
    

def check_files():
    print("checkfile scheduler is running")
    folderA = '../Data/Original'
    folderB = '../Data/Boundary'
    folderC = '../Data/Inverted'
    alz_folderA = '../Data/Alzhemier/Normal/Original'
    alz_folderB = '../Data/Alzhemier/Normal/Boundary'
    alz_folderC = '../Data/Alzhemier/Normal/Inverted'
    pom_folderA = '../Data/Pompe/Normal/Original'
    pom_folderB = '../Data/Pompe/Normal/Boundary'
    pom_folderC = '../Data/Pompe/Normal/Inverted'
    try:
        filesA = set(os.listdir(folderA))
        filesB = set(os.listdir(folderB))
        filesC = set(os.listdir(folderC))

        
        missing_filesAB = filesA - filesB
        missing_filesAC = filesA - filesC
        
        if missing_filesAC:
            for missing_file in missing_filesAD:
                print("creating inverted file  for :",missing_file)
                invert(missing_file,None)
        else:
            print("All files from Original are present in Inverted.")
        if missing_filesAB:
            for missing_file in missing_filesAB:
                print("computing boundary for:", missing_file)
                create_boundary(missing_file,None)
        else:
            print("All files from Orignal are present in Boundary.")
        ##################################################################
        filesA = set(os.listdir(alz_folderA))
        filesB = set(os.listdir(alz_folderB))
        filesC = set(os.listdir(alz_folderC))

        
        missing_filesAB = filesA - filesB
        missing_filesAC = filesA - filesC
        
        if missing_filesAC:
            for missing_file in missing_filesAD:
                print("creating inverted file  for :",missing_file)
                invert(missing_file,"Alzhemier")
        else:
            print("All files from Original are present in Inverted.")
        if missing_filesAB:
            for missing_file in missing_filesAB:
                print("computing boundary for:", missing_file)
                create_boundary(missing_file,"Alzhemier")
        else:
            print("All files from Alzhmier are present in Boundary.")
        ##################################################################
        filesA = set(os.listdir(pom_folderA))
        filesB = set(os.listdir(pom_folderB))
        filesC = set(os.listdir(pom_folderC))

        
        missing_filesAB = filesA - filesB
        missing_filesAC = filesA - filesC
        
        if missing_filesAC:
            for missing_file in missing_filesAD:
                print("creating inverted file  for :",missing_file)
                invert(missing_file,"Pompe")
        else:
            print("All files from Original are present in Inverted.")
        if missing_filesAB:
            for missing_file in missing_filesAB:
                print("computing boundary for:", missing_file)
                create_boundary(missing_file,"Pompe")
        else:
            print("All files from Pompe are present in Boundary.")
      
        
    except Exception as e:
        print(f"Error checking files: {str(e)}")

# Initialize the scheduler
scheduler = BackgroundScheduler()
scheduler.add_job(func=check_files, trigger="interval", minutes=1)
scheduler.start()
if __name__ == '__main__':
    from waitress import serve
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=19290)
    args = parser.parse_args()
    serve(app, host="0.0.0.0", port=args.port)
    