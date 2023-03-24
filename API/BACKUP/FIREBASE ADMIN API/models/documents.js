/**
 * Document model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../db/database');
const client = db.connection;

/**
 * Document Schema
 * */
const DocumentSchema = new Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    size: {
        type: Number,
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,

        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    path: {
        type: String,
    },
    email: {
        type: String,
    },
    uid: {
        type: String,
    },
    approved: {
        type: Boolean,
        default: false
    }


});

/**
 * Methods
 * */
DocumentSchema.method({
    transform() {
        const transformed = {};
        const fields = ['id', 'name', 'type', 'size', 'created', 'updated', 'status', 'user', 'path'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    }
});


/**
 * Statics
 * */
DocumentSchema.static.addDocument = async function(document) {
    const doc = await this.create(document);
    return doc.transform();
};

DocumentSchema.static.getDocuments = async function() {
    const docs = await this.find();
    return docs;
};

DocumentSchema.static.getDocument = async function(id) {
    const doc = await this.findById(id);
    return doc;
};

DocumentSchema.static.updateDocument = async function(id, document) {
    const doc = await this.findByIdAndUpdate(id, document, { new: true });
    return doc;
};

DocumentSchema.static.deleteDocument = async function(id) {
    const doc = await this.findByIdAndDelete(id);
    return doc;
};

DocumentSchema.static.userDocuments = async function(id) {
    const docs = await this.find({ user: id });
    return docs;
};

DocumentSchema.static.approveDocument = async function(id) {
    const doc = await this.findByIdAndUpdate(id, { approved: true }, { new: true });
    return doc;
};

DocumentSchema.static.find = async function(query) {
    const docs = await this.find(query);
    return docs;
};

DocumentSchema.static.getDocument = async function() {
    const doc = await this.find();
    return doc;
}

module.exports = client.model('Document', DocumentSchema);
exports.Document = client.model('Document', DocumentSchema);