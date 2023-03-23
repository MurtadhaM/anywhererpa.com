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
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    size: {
        type: Number,
        required: true
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
        required: true
    },
    email: {
        type: String,
        required: true
    },
    uid: {
        type: String,
        required: true
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


/**
 * Pre-save hooks
 * */
DocumentSchema.pre('save', async function save(next) {
    try {
        if (!this.isModified('name')) return next();
    } catch (error) {
        return next(error);
    }
});

DocumentSchema.pre('update', async function update(next) {
    try {
        if (!this.isModified('name')) return next();
    } catch (error) {
        return next(error);
    }
});



/**
 * Document Model
 * */
const Document = client.model('Document', DocumentSchema);

exports.Document = Document;