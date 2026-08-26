const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Job role name is required'],
      unique: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    skills: [
      {
        type: String,
        trim: true
      }
    ],
    experienceRanges: [
      {
        type: String,
        enum: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years']
      }
    ],
    icon: {
      type: String,
      default: 'Briefcase'
    },
    interviewCount: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

jobRoleSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  next();
});

const JobRole = mongoose.model('JobRole', jobRoleSchema);
module.exports = JobRole;
