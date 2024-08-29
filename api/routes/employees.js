import { Router } from 'express';
const router = Router();
import * as Employee from '../models/employee.js';
import * as e from '../dbextmethods/getEmployees.js';

//#region  Employee Http Methods.
 router.get('/',(req,res,next)=>{
   e.getEmployees().then(result=>{
        res.status(200).json({
            message: 'Handling GET requests to /employees',
            employee: result    
           });
        }); 
   });
   
   router.post('/',(req,res,next)=>{    
      const employee = {
      FirstName:req.body.FirstName,
      LastName:req.body.LastName,
      Email:req.body.Email    
      };
      e.insertEmployees(employee).then(result=>{
        res.status(200).json({
            message: 'Handling POST requests to /employees',
            employeeData: employee
           });
        }); 
      
      });

      router.put('/',(req,res,next)=>{    
        const employee = {
        FirstName:req.body.FirstName,
        LastName:req.body.LastName,
        Email:req.body.Email,
        EmpId:req.body.EmpId     
        };
        e.updateEmployees(employee).then(result=>{
          res.status(200).json({
              message: 'Handling POST requests to /employees',
              employeeData: employee
             });
          }); 
        
        });


       
    

router.get('/:employeeId',(req,res,next)=>{

    const id = req.params.employeeId;
    console.log(id);
    if(id === "Sudheer")
    {
        res.status(200).json({
            message: 'You discovered special employee Id'
          
           });
    }
    else{
        e.getEmployeebyId(id).then(result=>{
            res.status(200).json({
                message: 'Handling GET requests to /employees',
                employee: result    
               });
            }); 
        
    }

    
   });
   
   router.delete('/:employeeId',(req,res,next)=>{    
    const id = req.params.employeeId;
    e.deleteEmployees(id).then(result=>{
      res.status(200).json({
          message: 'Employee Record Deleted Success!',
         
         });
      }); 
    
    });
   router.patch('/:employeeId',(req,res,next)=>{

    res.status(200).json({
        message: 'Update Employee Info'

    });
    
   });


   
 //#endregion 

  
   
      export default router;