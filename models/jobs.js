const mongoose  = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter Job title'],
        trim: true,
        maxlength: [100, 'Job title can not exceed 100 characters']
    },
    slug: String,
    email: {
        type: String,
        validate: [validator.isEmail, 'Please enter a valid email address.']
    },
    addres:{
        type: String,
        required: [true, 'Please enter an address']
    },
    company: {
        type: String,
        required: [true, 'Please enter company name']
    },
    industry:{
        type: [String],
        required: true,
        enum: {
            values: ['Business','Information Technology', 'Banking and Finance', 'Education and Training','Telecommunication','Others'],
            message : 'Please select the industry'
        }
    },
    jobType:{
        type: [String],
        required: true,
        enum:{
            values: ['Permanent', 'Contract','Internship'],
            message: 'Please sleect job type'
        }
    },
    minEducation:{
        type: [String],
        required: true,
        enum:{
            values: ['Bachelors', 'Masters','Phd'],
            message: 'Please sleect job type'
        }
    },
    positions: {
        type: Number,
        default: 1
    },
    experience:{
        type: String,
        required: true,
        enum: {
            values: ['No experience', '1 year to 2 years', '2 years to 5 years', '5+ years'],
            message: 'Please select your level of experience'
        }
    },
    salary:{
        type: Number,
        required: [true, 'Please enter expected salary for this job']
    },
    postingDate:{
        type: Date,
        default: Date.now
    },
    lastDate:{
        type:Date,
        default: new Date().setDate(new Date().getDate() + 7)
    },
    applicantsApplied:{
        type: Object,
        select: false
    }

});


//Creating job slug before saving
jobSchema.pre('save', function(next){
    this.slug = slugify(this.title, {lower: true});
    next()
});

module.exports = mongoose.model('Job', jobSchema);

