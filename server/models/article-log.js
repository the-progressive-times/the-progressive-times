var mongoose = require('mongoose');
var User = mongoose.model('User');

var auditLogSchema = new mongoose.Schema({
    articleID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article'
    },
    authorID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    eventName: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ArticleLog', auditLogSchema);
