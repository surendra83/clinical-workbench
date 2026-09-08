# Project Setup

## Create Virtual Environment  Python 

```bash
python -m venv pylibbox

Windows:
c:\project_workspace> pylibbox\Scripts\activate

(pylibox) c:\clinical_workbench_api> 

```

## Install for Python Pakages

```bash

Windows:

(pylibox) c:\clinical_workbench_api> pip install -r requirements.txt

```
## Application Running

Navigate to project folder  Run the python Fast API Loacal App Server

```bash
Windows:

Dev:
(pylibox) c:\clinical_workbench_api> uvicorn app.main:app --reload

produciton:
(pylibox) c:\clinical_workbench_api> uvicorn app.main:app --host 0.0.0.0 --port 8000 

```