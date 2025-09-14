const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // --- Fields for Tourists ---
  walletAddress: { 
    type: String, 
    unique: true, 
    sparse: true, // Allows multiple null values for this unique field
    lowercase: true 
  },
  encryptedCredentials: { 
    type: String,
    required: function() { return this.role === 'tourist'; } // Required only if the user is a tourist
  },
  credentialHash: { 
    type: String, 
    required: function() { return this.role === 'tourist'; }
  },
  nonce: { 
    type: String,
    required: function() { return this.role === 'tourist'; }
  },
  lastLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  
  // --- Fields for Admins ---
  email: { 
    type: String, 
    unique: true, 
    sparse: true, 
    lowercase: true 
  },
  password: { 
    type: String 
  },
  role: { 
    type: String, 
    enum: ['tourist', 'admin'], 
    default: 'tourist' 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

UserSchema.index({ lastLocation: '2dsphere' });
module.exports = mongoose.model("User", UserSchema);