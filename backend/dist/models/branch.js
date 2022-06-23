/* require modules */
const { Schema, model } = require('mongoose')

/* branch schema design */
const schema = new Schema({
    name: {
        type: String,
        required: true
    },

    identification: {
        type: Number,
        required: true,
        unique: true
    },

    employee: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        autopopulate: { maxDepth: 1 }
    },

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

/* branch schema indexing */
schema.index({ name: -1 }, { background: true })
schema.index({ employee: -1 }, { background: true })
schema.index({ created_by: -1 }, { background: true })
schema.index({ updated_by: -1 }, { background: true })
schema.index({ timestamps: -1 }, { background: true })

/* branch schema plugin */
schema.plugin(require('mongoose-autopopulate'))

/* branch model */
const branch = model('branch', schema)

/* export branch model for global accessibility */
module.exports = branch