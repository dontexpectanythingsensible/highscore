const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
    user: String,
    score: Number,
    life: Number,
    created: Date,
    visible: Boolean
});

module.exports = mongoose.model('Score', ScoreSchema);