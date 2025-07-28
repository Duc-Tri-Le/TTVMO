
const addDocument = async (req, res) => {
    const {ifDocument} = req.body;
    const files = req.files;
    const duongdan = files.map(url => url.filename);
    

}