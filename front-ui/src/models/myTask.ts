export interface IMyTask {  
    cpt_code:string;
    document_id:string;
    document_title:string;
    document_type:string;
    due_date:string;
    payer:string;
    priority:string;
    state:string;
    status:string;
    p_step:string;

}

export interface IFileInfo {
  cpt_code: String;
  document_id: String;
  document_path:String;
  document_title:String;
  document_type: String;
}


export const Priority:  { value: string , label: string}[] = [
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];


export const DocumentSources:  { value: string , label: string}[] = [
  { value: "MCG", label: "MCG" },
  { value: "LCD", label: "LCD" },
  { value: "NCD", label: "NCD" },
  { value: "other", label: "other" },
];

export const PayerList :  { value: string , label: string}[] = [
  { value: "UHC", label: "UHC" },
  { value: "BCBS", label: "BCBS" },
  { value: "Humana", label: "Humana" },
  { value: "other", label: "other" },
];

