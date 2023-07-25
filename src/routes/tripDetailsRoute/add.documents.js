export const addDocuments = (req,res) => {
    try{
        res.send(req.file.name);
    }
    catch(error){
        res.send(error.message);
    }
}