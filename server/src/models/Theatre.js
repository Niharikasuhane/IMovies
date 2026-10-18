const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Screen 1" },
    rows: { type: Number, default: 10, min: 1, max: 26 },
    seatsPerRow: { type: Number, default: 15, min: 1, max: 40 },
    premiumRows: { type: Number, default: 2, min: 0 },
  },
  { _id: false }
);

const theatreSchema = new mongoose.Schema(
  {
    theatreName: {
      type: String,
      trim: true,
    },
    theatreId: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    balconySeatPrice: {
      type: Number,
      default: 250,
    },
    middleSeatPrice: {
      type: Number,
      default: 180,
    },
    lowerSeatPrice: {
      type: Number,
      default: 120,
    },
    balconySeats: {
      type: Object,
      default: () => ({ rows: 2, total: 30 }),
    },
    middleSeats: {
      type: Object,
      default: () => ({ rows: 4, total: 60 }),
    },
    lowerSeats: {
      type: Object,
      default: () => ({ rows: 4, total: 60 }),
    },
    // Aliases & extensions for controllers
    name: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      default: "",
    },
    screens: {
      type: [screenSchema],
      default: () => [{ name: "Screen 1", rows: 10, seatsPerRow: 15, premiumRows: 2 }],
    },
    amenities: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Synchronize aliases on save
theatreSchema.pre("validate", function () {
  if (!this.theatreName && this.name) this.theatreName = this.name;
  if (!this.name && this.theatreName) this.name = this.theatreName;

  if (!this.theatreId) {
    this.theatreId = "TH_" + (this.theatreName || "venue").toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 15) + "_" + Date.now();
  }

  if (!this.location && this.city) this.location = this.city;
  if (!this.city && this.location) this.city = this.location;
  if (!this.address) this.address = this.location || this.city || "";
});

theatreSchema.index({ city: 1, name: 1, theatreName: 1 });

// Export both standard casing and model alias as registered in screenshot 4
module.exports = mongoose.models.Theatre || mongoose.model("Theatre", theatreSchema);
try {
  mongoose.model("theatre", theatreSchema);
} catch (e) {
  // Already registered or aliased
}
