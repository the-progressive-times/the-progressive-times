var mongoose = require('mongoose');

var auditLogSchema = new mongoose.Schema({
    articleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    authorID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    eventName: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ArticleLog', auditLogSchema);
