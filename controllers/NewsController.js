const News = require('../models/NewsModel');
const mongoose = require('mongoose');

const postCreateNews = (req, res) => {
    const { categoryId, title, description, img } = req.body;
    const news = new News({
        categoryId: mongoose.Types.ObjectId(categoryId),
        title,
        description,
        img,
    });

    news.save()
        .then(() => res.json({
            status: 200,
            message: 'News created. ID: ' + news._id,
        }))
        .catch(err => res.json({
            status: 500,
            message: err.message,
        }));

};

const getAllNews = async (req, res) => {
    try {
        const news = await News.find({}).populate('categoryId');
        if (news) {
            res.json({
                status: 200,
                news
            });
        } else {
            res.json({
                status: 404,
                message: 'News not found',
            });
        }
    } catch (err) {
        res.json({
            status: 500,
            message: err.message,
        });
    }
};

const getHotNews = async (req, res) => {
    try {
        const news = await News.find({}).sort({ hits: -1 }).limit(10).populate('categoryId');
        if (news) {
            res.json({
                status: 200,
                news
            });
        } else {
            res.json({
                status: 404,
                message: 'News not found',
            });
        }
    } catch (err) {
        res.json({
            status: 500,
            message: err.message,
        });
    }
};

const getBreakingNews = async (req, res) => {
    try {
        const news = await News.find({}).sort({ date: -1 }).limit(10).populate('categoryId');
        if (news) {
            res.json({
                status: 200,
                news
            });
        } else {
            res.json({
                status: 404,
                message: 'News not found',
            });
        }
    } catch (err) {
        res.json({
            status: 500,
            message: err.message,
        });
    }
};

const getNewsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const news = await News.find({ categoryId: mongoose.Types.ObjectId(categoryId) }).sort({ date: -1 }).populate('categoryId');
        if (news.length > 0) {
            res.json({
                status: 200,
                news
            });
        } else {
            res.json({
                status: 404,
                message: 'News not found',
            });
        }
    } catch (err) {
        res.json({
            status: 500,
            message: err.message,
        });
    }
};

const getNewsById = async (req, res) => {
    const { id } = req.params;
    try {
        const news = await News.findById(id).populate('categoryId');
        if (news) {
            // Set hits
            news.hits += 1;
            news.save();
            res.json({
                status: 200,
                news
            });
        } else {
            res.json({
                status: 404,
                message: 'News not found',
            });
        }
    } catch (err) {
        res.json({
            status: 500,
            message: err.message,
        });
    }
};


module.exports = {
    postCreateNews,
    getAllNews,
    getHotNews,
    getBreakingNews,
    getNewsByCategory,
    getNewsById,
};