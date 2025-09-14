const mongoose = require("mongoose");
const SosSchema = new mongoose.Schema({
  tourist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  incidentType: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
  onChainProof: {
    sosId: { type: String, required: true },
    txHash: { type: String, required: true },
    reportHash: { type: String, required: true },
  },
  encryptedPacket: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
SosSchema.index({ location: '2dsphere' }); // For geospatial queries
module.exports = mongoose.model("Sos", SosSchema);