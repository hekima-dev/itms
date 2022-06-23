/* require models */
const { Schema, model } = require('mongoose')

/* role schema design */
const schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    permissions: [
        {
            type: String,
            required: true
        }
    ],

    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        autopopulate: { maxDepth: 1 }
    },

    updated_by: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: { maxDepth: 1 },
        default: null
    }

}, {
    timestamps: true
})

/* role schema indexing */
schema.index({ permissions: -1 }, { background: true })
schema.index({ created_by: -1 }, { background: true })
schema.index({ updated_by: -1 }, { background: true })
schema.index({ timestamps: -1 }, { background: true })

/* role schema plugin */
schema.plugin(require('mongoose-autopopulate'))

/* role model */
const role = model('role', schema)

/* export role model for global accessibility */
module.exports = role