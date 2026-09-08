// components/TreeNode.tsx
import React, { useEffect, useState } from 'react';
import type { TreeNodeData } from './types';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SubdirectoryArrowRightOutlinedIcon from '@mui/icons-material/SubdirectoryArrowRightOutlined';

interface TreeNodeProps {
  node: TreeNodeData;
 isExpanded: boolean; 
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, isExpanded }) => {

  const [collapsed, setCollapsed] = useState(true);

  const hasChildren = node.children && node.children.length > 0;

    useEffect(() => {
       setCollapsed(!isExpanded);
    },[isExpanded]);

  return (
    <div style={{ marginLeft: '0px' }}>
      <div onClick={() => setCollapsed(!collapsed)} className='optum-inside-node'>
         <div className='optum-node'>
            {hasChildren? (<div className='optum-row hline'> 
             {hasChildren && (collapsed ? (<KeyboardArrowRightIcon/>) : (<KeyboardArrowDownIcon/>))} 
             <span className='otum-criteria' title={node.content}>{node.clinical_criteria}</span> 
            
             <div className='optum-local-type'> Type: <strong>{node.classification_type}</strong> </div> 
             <div className='optum-local-criteria'> Logical Condition: <strong>[{node.logical_relation}]</strong> </div>
            
            </div> ) : (<div>
             <div style={{marginBottom:'8px'}}><ArrowRightIcon/> <span> {node.content}</span></div>
             <div className='optum-node-question'><SubdirectoryArrowRightOutlinedIcon style={{marginTop:'-8px', fontSize:'18px'}}/> <strong>Question :</strong> {node.question} </div>
            </div>) }
         </div>
      </div>
      {!collapsed && hasChildren && (
         <div className='optum-children-box'>
           {node.children!.map((child) => (
            <TreeNode key={child.member_id} node={child} />
          ))}
       </div>
      )}
    </div>
  );
};
export default TreeNode;