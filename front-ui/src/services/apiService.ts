import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { IMyTask, IFileInfo }  from '../models/myTask';
import type { IMedicalGuideLine } from '../models/MedicalGuideLine';
import type { IAIGenerateQuestion, IAIQuestionEvaluation} from '../models/QuestionGeneration';

export const endpoint_apiurl: string ="http://localhost:8000/api";

const limit_default: string ='?skip=0&limit=350';

export const getHeader = (): AxiosRequestConfig => {
  const token = localStorage.getItem('authToken') || 'hgtd543748dyete6e3948948787457487kjdd6563';
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
};

export const getFilesHeader = (): AxiosRequestConfig => {
  const token = localStorage.getItem('authToken') || 'hgtd543748dyete6e3948948787457487kjdd6563';
  return {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  };
};

// Post API
export const createNewTask = async (data: any): Promise<any> => {
    try {
         const response = await axios.post(`${endpoint_apiurl}/task-tracker`, data, getHeader()); 
         return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
        throw error;
      }
};


// Get Traker with limit add data
export const getTaskTracker = async (): Promise<IMyTask[]> => {
    try {
         const response = await axios.get(`${endpoint_apiurl}/task-tracker/${limit_default}`, getHeader()); 
         return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
        throw error;
      }
};

// Current Entry Task 
export const getCurrentEntryTask = async (): Promise<IMyTask[]> => {
    try {
         const response = await axios.get(`${endpoint_apiurl}/current-entry-task`, getHeader()); 
         return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
        throw error;
      }
};

//get One document Traker
export const getSelectedTaskTracker = async (document_id: String): Promise<IMyTask> => {
    try {
         const response = await axios.get(`${endpoint_apiurl}/task-tracker/${document_id}`, getHeader()); 
         return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
        throw error;
      }
};

// Update Task traker
export const updateTaskTraker = async (mytask: IMyTask): Promise<IMyTask> => {  
    try {
        const response = await axios.put(`${endpoint_apiurl}/task-tracker/${mytask.cpt_code}`, mytask, getHeader());
        return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
         throw error;
      }
};

export const getUploadFile =  async (mytask: IFileInfo): Promise<IFileInfo> => {  
 
    try {
        const response = await axios.get(`${endpoint_apiurl}/document/${mytask.document_id}`, getHeader());
        return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
         throw error;
      }
};

//Post method Medical GuideLine Extraction
export const ExtractMedicalGuideLine = async (doc_id: string): Promise<IMedicalGuideLine[]> => {  
    try {
        const paramData = {
          'document_id': doc_id
        };
        const response = await axios.post(`${endpoint_apiurl}/medical-guideline-extract`,paramData, getHeader());
        return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
        throw error;
      }
};

//Get Method
export const getMedicalGuideLine = async (doc_id: string): Promise<IMedicalGuideLine[]> => {  
    try {
        const response = await axios.get(`${endpoint_apiurl}/extracted-guideline/${doc_id}`, getHeader());
        return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
        throw error;
      }
};

//Post Method
export const fileUpload = async (formData: FormData): Promise<any> => {  
    try {
        const response = await axios.post(`${endpoint_apiurl}/document-upload`, formData, getFilesHeader());
        return response.data;
      } catch (error) {
        console.error('API ERROR:', error);
         throw error;
      }
};

//Post method For Question Generation Request from LLM
export const PostGenerateQuestion = async (doc_id: string): Promise<IAIGenerateQuestion[]> => {  
    try {
        const paramData = {
          'document_id': doc_id
        };
         const response = await axios.post(`${endpoint_apiurl}/questions-generation`,paramData, getHeader());
         return response.data;
      } catch (error) {
         console.error('API ERROR:', error);
         throw error;
      }
};

// Get Moethod getQuestion from db 
export const getAIGenerateQuestion = async (doc_id: string): Promise<IAIGenerateQuestion[]> => {  
    try {
        const response = await axios.get(`${endpoint_apiurl}/questions/${doc_id}`, getHeader());
        return response.data;
      } catch (error) {
        console.error('API ERROR', error);
        throw error;
      }
};

//Post Question Evalutions
export const getQuestionEvaluation = async (evaluation_question: any ): Promise<IAIQuestionEvaluation[]> => {  
        try {
            const response = await axios.post(`${endpoint_apiurl}/questions-evaluation`, evaluation_question, getHeader());
            return response.data;
          } catch (error) {
            console.error('API ERROR:', error);
            throw error;
         }
};

// Crete New Question 
export const createNewQuestion = async (data: any ): Promise<any> => {  
  
        try {
            const response = await axios.post(`${endpoint_apiurl}/questions`, data, getHeader());
            return response.data;
          } catch (error) {
            console.error('API ERROR:', error);
            throw error;
         }
};

// Generate Dession tree
export const generateDecisionTree = async (document_id: string ): Promise<any> => {  
          const data ={
            'document_id': document_id
          };

        try {
            const response = await axios.post(`${endpoint_apiurl}/generate-decision-tree`, data, getHeader());
            return response.data;
          } catch (error) {
            console.error('API ERROR:', error);
            throw error;
         }
};

// Post Decision Tree
export const postDecisionTree = async (document_id: string ): Promise<any> => {  
          const payload = {
            'document_id': document_id
          };
        try {
            const response = await axios.post(`${endpoint_apiurl}/decision-tree`,payload, getHeader());
            return response.data;
          } catch (error) {
            console.error('API ERROR:', error);
            throw error;
         }
};

// Get Finde Decition true
export const getDecisiontree = async (document_id: string ): Promise<any> => {  
        try {
            const response = await axios.get(`${endpoint_apiurl}/decision-tree?document_id=${document_id}`, getHeader());
            return response.data;
          } catch (error) {
            console.error('API ERROR:', error);
            throw error;
         }
};
