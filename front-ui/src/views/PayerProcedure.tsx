
import React, { useState,useEffect, useRef } from 'react';
import { AddPayerProcedure,DiscriptionCellRender } from '../componets/index';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

const PayerProcedure: React.FC = () => {

  return (<div>
           <AddPayerProcedure/>
        </div>);
};

export default PayerProcedure;