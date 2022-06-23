/* require modules */
const { Schema, model } = require('mongoose')

/* temperature schema design */
const schema = new Schema({
    value: {
        type: Number,
        required: true
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: 'branch',
        autopopulate: { maxDepth: true }
    }

}, {
    timestamps: true
})

/* temperature schema indexing */
schema.index({ value: -1 }, { background: true })
schema.index({ branch: -1 }, { background: true })
schema.index({ timestamps: -1 }, { background: true })

/* temperature schema plugin */
schema.plugin(require('mongoose-autopopulate'))

/* temperature model */
const temperature = model('temperature', schema)

/* export temperature model for global accessibility */
module.exports = temperature