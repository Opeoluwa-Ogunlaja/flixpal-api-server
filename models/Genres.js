const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: [true, 'genre title is required'],
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

genreSchema.virtual('movies', {
    foreignField: 'genres',
    ref: 'Movie',
    localField: '_id'
})

genreSchema.virtual('moviesCount', {
    foreignField: 'genres',
    ref: 'Movie',
    localField: '_id',
    count: true
})

genreSchema.pre('findOneAndDelete', async function(next){
    const genre = this.getQuery()._id;
//     try { 
//         const iphonesFound = await Iphone.find({ categories: { $in: genre } })

//         for (let i = 0; i < iphonesFound.length; i++) {
//             const iphone = iphonesFound[i];
//             if (iphone.categories.length === 1) {
//                 iphone.published = false;
//                 iphone['published_at'] = undefined
//                 await iphone.save()
//             }
//         }

//         const iphones = await Iphone.updateMany({ categories: { $in: genre } }, {
//             $pull: { categories: genre },
//         })

//         next()
//     } catch (error) {
//         next(error)
//     }
})

const Genre = mongoose.model('genre', genreSchema);

module.exports = Genre