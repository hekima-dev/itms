/* require modules */
const { Schema, model } = require('mongoose')

/* user schema design */
const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    phone_number: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        default: null,
        autopopulate: { maxDepth: 1 }
    },

    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: { maxDepth: 1 },
        default: null
    },

    role: {
        type: Schema.Types.ObjectId,
        ref: 'role',
        autopopulate: { maxDepth: 1 },
        default: null
    }

}, {
    timestamps: true
})

/* user schema indexing */
schema.index({ role: -1 }, { background: true })
schema.index({ timestamps: -1 }, { background: true })
schema.index({ created_by: -1 }, { background: true })
schema.index({ updated_by: -1 }, { background: true })

/* user schema plugin */
schema.plugin(require('mongoose-autopopulate'))

/* user model */
const user = model('user', schema)

/* export user model for global accessibility */
module.exports = user