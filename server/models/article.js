var mongoose = require('mongoose');

var articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    articleText: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Article', articleSchema);
