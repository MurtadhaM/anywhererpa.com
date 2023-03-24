/**
 * User model
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const db = require('../db/database');
const client = db.connection;
const secret = require('../config').secret;

/**
 * User Schema
 */
const UserSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId()
    },
    uid: {
        type: String,
        required: [true, 'UID is required'],
        unique: [true, 'UID already exists'],
        trim: [true, 'UID cannot be empty'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        trim: [true, 'Email cannot be empty'],
    },
    phone: {
        type: String,
        // Random phone number
        default: Math.floor(Math.random() * 10000000000),
        unique: [true, 'Phone number already exists'],

    },

    name: {
        type: String,
        default: 'Unknown'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: true
    },
    documents: {
        type: Array,
        default: []
    },
    additional: {
        type: Object,
        default: {}
    }



});

/**
 * Methods
 * */
UserSchema.method({
    transform() {
        const transformed = {};

        const fields = ['id', 'uid', 'email', 'phone', 'name', 'role', 'created', 'updated', 'lastLogin', 'status', 'documents'];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },

    token() {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({
            sub: this._id
        }, secret, {
            expiresIn: '7d'
        });
        return token;
    }

});

UserSchema.static.addDocument = async function(email, document) {
    let user = await this.findOne({ email: email });
    user.documents.push(document);
    return user.save();
}

UserSchema.static.removeDocument = async function(email, document) {
    let user = await this.findOne({ email: email });
    user.documents = user.documents.filter(doc => doc._id != document._id);
    return user.save();
}




/**
 * Statics
 * */
UserSchema.statics = {
    /**
     * Get user
     * */
    get(id) {
        return this.findById(id)
            .exec()
            .then((user) => {
                if (user) {
                    return user;
                }
                const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
                return Promise.reject(err);
            });

    },

    /**
     * List users in descending order of 'createdAt' timestamp.
     * */
    list({
        page = 1,
        perPage = 30,
        name,
        email,
        role,
        status
    }) {
        const options = omitBy({
            name,
            email,
            role,
            status
        }, isNil);

        return this.find(options)
            .sort({
                createdAt: -1
            })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    }
};




const User = client.model('User', UserSchema);
module.exports = User;