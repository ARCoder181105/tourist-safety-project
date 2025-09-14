const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  warning: { 
    type: String, 
    required: true 
  },
  // Using the GeoJSON Polygon format for MongoDB geospatial queries
  geometry: {
    type: {
      type: String,
      enum: ['Polygon'],
      required: true
    },
    coordinates: {
      type: [[[Number]]], // Array of [longitude, latitude] pairs
      required: true
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

// Create a geospatial index for fast location queries
ZoneSchema.index({ geometry: '2dsphere' });

module.exports = mongoose.model("Zone", ZoneSchema);