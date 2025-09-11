import { Router } from 'express';
const router = Router();

//#region  HttpMethods
router.get('/',(req,res,next)=>{

    res.status(200).json({
     message: 'Handling GET requests to /clients'
   
    });
   });

   router.post('/',(req,res,next)=>{
    const client ={
        clientname: req.body.clientname,
        address: req.body.address

   };
       res.status(201).json({
        message: 'ClientId Created',
        clientId: req.params.clientId,
        createdClient: client
       });
      });

     

router.get('/:clientId',(req,res,next)=>{

    const id = req.params.clientId;
    if(id === "Sudheer")
    {
        res.status(200).json({
            message: 'You discovered special clientId '
          
           });
    }
    else{
        res.status(200).json({
            message: 'You passed and ID'

        });
    }

    
   });
   

   router.patch('/:clientId',(req,res,next)=>{

    res.status(200).json({
        message: 'Update clients Info'

    });
    
   });
   router.delete('/:clientId',(req,res,next)=>{

    res.status(200).json({
        message: 'Deleted clients Info'

    });
    
   });
   //#endregion

      export default router;

