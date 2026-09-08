export interface TreeNodeData {
  member_id: string;
  content: string;
  clinical_criteria: string;
  question: string;
  logical_relation: string;
  classification_type: string;
  children?: TreeNodeData[];
}
