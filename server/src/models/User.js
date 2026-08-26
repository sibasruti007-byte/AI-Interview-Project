const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false
    },
    role: {
      type: String,
      enum: ['candidate', 'admin'],
      default: 'candidate'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    profile: {
      avatar: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      bio: { type: String, default: '' },
      college: { type: String, default: '' },
      degree: { type: String, default: '' },
      graduationYear: { type: Number },
      experienceLevel: {
        type: String,
        enum: ['Fresher', '0-1 years', '1-3 years', '3-5 years', '5+ years'],
        default: 'Fresher'
      },
      currentRole: { type: String, default: '' },
      targetRole: { type: String, default: 'Full Stack Developer' },
      skills: [{ type: String, trim: true }],
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' }
    },
    activeResume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume'
    },
    stats: {
      totalInterviews: { type: Number, default: 0 },
      completedInterviews: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      bestScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      lastInterviewDate: { type: Date }
    },
    passwordResetToken: String,
    passwordResetExpires: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ 'profile.targetRole': 1 });

// Password hashing pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  let score = 20; // Base for registration (name + email)
  const p = this.profile;
  if (p.bio) score += 10;
  if (p.phone) score += 5;
  if (p.location) score += 5;
  if (p.college || p.degree) score += 15;
  if (p.skills && p.skills.length > 0) score += 20;
  if (p.github || p.linkedin || p.portfolio) score += 10;
  if (this.activeResume) score += 15;
  return Math.min(100, score);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
