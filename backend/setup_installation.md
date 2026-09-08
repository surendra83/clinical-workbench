## Create Virtual Environment  Python 

```bash
python -m venv pylibbox

Windows:
c:\project_folder> pylibbox\Scripts\activate

(pylibox) c:\project_folder> 

```

## Install the Python Pakages

```bash

Windows:

(pylibox) c:\project_folder> pip install -r requirements.txt

```
## Once pip Installation Complited
Navigate to project filder  Run the python Fast API Loacal App Server


```bash
Windows:

Dev:
(pylibox) c:\project_folder> uvicorn app.main:app --reload

produciton:
(pylibox) c:\project_folder> uvicorn app.main:app --host 0.0.0.0 --port 8000 

```