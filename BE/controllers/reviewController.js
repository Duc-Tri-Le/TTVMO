import { addReviewModel, deleteReviewModel, getReviewModel, updateReviewModel } from "../model/reviewModel.js";

const addReview = async (req, res) => {
    let {ifReview} = req.body;
    const files = req.files;
    if(typeof ifReview === "string"){
        ifReview = JSON.parse(ifReview);
    }
    let ifImage = [];
    files.map((file) => {      
        ifImage.push(`/${file.filename}`)
    })
    // console.log('====================================');
    // console.log({ifReview,ifImage});
    // console.log('====================================');

    const {message} = await addReviewModel(ifReview, ifImage);
    return res.json(message);
}

const updateReview = async (req, res) => {
    const {ifReview} = req.body;
    const {review_id} = req.query;
    const {message} = await updateReviewModel(review_id, ifReview);
    return res.json(message);
}

const deleteReview = async (req, res) => {
    const {review_id} = req.query;
    const {message} = await deleteReviewModel(review_id);
    return res.json(message);
}

const getReview = async (req,res) => {
    const {khoaHoc_id} = req.query;
    const {message, result} = await getReviewModel(khoaHoc_id);
    return res.json({message,result});
}

export {addReview, updateReview, deleteReview, getReview};