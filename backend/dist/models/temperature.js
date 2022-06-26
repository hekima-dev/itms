/* require modules */
const { Schema, model } = require('mongoose')
const { currentDate, currentTime, currentMonth, currentYear } = require('bapig/dist/helpers/time')

/* temperature schema design */
const schema = new Schema({
    value: {
        type: Number,
        required: true
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: 'branch',
        autopopulate: { maxDepth: 1 }
    },

    employee: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        autopopulate: { maxDepth: 1 }
    },

    date: {
        type: String,
        default: `${new Date().getDate()}/${new Date().getMonth() + 1} ${new Date().getFullYear()}`
    },

    time: {
        type: String,
        default: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
    }

}, {
    timestamps: true
})

/* temperature schema indexing */
schema.index({ value: -1 }, { background: true })
schema.index({ branch: -1 }, { background: true })
schema.index({ employee: -1 }, { background: true })
schema.index({ time: -1 }, { background: true })
schema.index({ date: -1 }, { background: true })
schema.index({ timestamps: -1 }, { background: true })

/* temperature schema plugin */
schema.plugin(require('mongoose-autopopulate'))

/* temperature model */
const temperature = model('temperature', schema)

/* export temperature model for global accessibility */
module.exports = temperature