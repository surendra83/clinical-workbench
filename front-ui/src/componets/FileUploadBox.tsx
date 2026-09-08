import type { DragEvent, ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import '../assets/styles/FileUploadBox.css';
import { fileUpload, getUploadFile } from '../services/apiService';
import type { IMyTask, IFileInfo } from '../models/myTask';
import CloseIcon from '@mui/icons-material/Close';

interface FileUploadBoxProps {
  onFilesChange: (files: File[]) => void;
   task: IMyTask;
}

const FileUploadBox: React.FC<FileUploadBoxProps> = ({ onFilesChange, task }) => {

  const [highlight, setHighlight] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileInfo, setFileInfo] = useState<IFileInfo | null>(null);


 const updateFiles = (newFiles: File[]) => {
     setFiles(newFiles);
     onFilesChange(newFiles); // Notify parent of updated list

  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlight(true);
  };

  const handleDragLeave = () => {
    setHighlight(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHighlight(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const filtered = droppedFiles.filter(isValidFileType);
    const updated = [...files, ...filtered];
    updateFiles(updated);

  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if(fileInfo){
        alert("This File is already Process");
        return false;
     }else {
      
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        const filtered = selectedFiles.filter(isValidFileType);
        const updated = [...files, ...filtered];
    
        const formData = new FormData();
          formData.append('cpt_code', task.cpt_code);  
          formData.append('document_id', task.document_id);   
          formData.append('document_type', task.document_type);
          formData.append('document_title', task.document_title);
          formData.append('document_source', 'upload-file');

        if (e.target.files){
            formData.append('file', e.target.files[0]);
        }

        const fileUplodAction = async () => {
                    try {
                        const response = await fileUpload(formData);
                        console.log('Upload response:', response);
                    }
                    catch (error) {
                    console.error('File upload failed:', error);
                  }
            }  

          fileUplodAction();
          updateFiles(updated);  
    }

  };

  const removeFile = (index: number) => {   
     const updated = files.filter((_, i) => i !== index);
     updateFiles(updated); // Update state and notify parent
  };


  const isValidFileType = (file: File) => {
    const allowedTypes = [
      'text/html',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    return allowedTypes.includes(file.type);
  };

  useEffect( () => {
    
     const getuplod_file = async () => {
                         const pdata = localStorage.getItem('param_data');
                         if (pdata){
                             const parsed_pdata: IMyTask = JSON.parse(pdata);
                             const fileData = {
                              'cpt_code': parsed_pdata.cpt_code,
                              'document_id': parsed_pdata.document_id,
                              'document_path': 'null',
                              'document_title': parsed_pdata.document_title,
                              'document_type': parsed_pdata.document_type
                            }
                            const temp_response = await getUploadFile(fileData);
                            setFileInfo(temp_response);
                         }
               };
       getuplod_file();   

   },[]);


  return (
  <div className='upload-container'>    
    <div className={`drop-box ${highlight ? 'highlight' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <input
        type="file"
        id="fileElem"
        multiple
        hidden
        accept=".html"
        onChange={handleFileSelect}
      />
      <p>Drag or drop files here or <br/> Browse files from your computer</p>
      <button className='optum-button' onClick={() => document.getElementById('fileElem')?.click()}>
        Select Files
      </button>
    </div>
       {files.length > 0 && (
        <ul className="file-list">
          {files.map((file, index) => (
            <li key={index} className="file-item">
              {file.name}
              <div className="remove-button" onClick={() => removeFile(index)}><CloseIcon/></div>
            </li>
          ))}

        </ul>
      )}
 
       {fileInfo? (
         <ul className="file-list">
            <li key='' className="file-item">
              {fileInfo.document_path}
              <div className="remove-button"><CloseIcon/></div>
            </li>
          </ul>
          ):(<></>)}
      
   </div>);
};

export default FileUploadBox;