const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, 'Category title is required'],
        unique: true
    },
    title: String,
    description: String,
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    _id: false
})

categorySchema.virtual('movies', {
    foreignField: 'categories',
    ref: 'Movie',
    localField: '_id'
})

categorySchema.virtual('moviesCount', {
    foreignField: 'categories',
    ref: 'Movie',
    localField: '_id',
    count: true
})

categorySchema.pre('findOneAndDelete', async function(next){
    const category = this.getQuery()._id;
    try { 
        const iphonesFound = await Iphone.find({ categories: { $in: category } })

        for (let i = 0; i < iphonesFound.length; i++) {
            const iphone = iphonesFound[i];
            if (iphone.categories.length === 1) {
                iphone.published = false;
                iphone['published_at'] = undefined
                await iphone.save()
            }
        }

        const iphones = await Iphone.updateMany({ categories: { $in: category } }, {
            $pull: { categories: category },
        })

        next()
    } catch (error) {
        next(error)
    }
})

const Category = mongoose.model('Category', categorySchema);

module.exports = Category