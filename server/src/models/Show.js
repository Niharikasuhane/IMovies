const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    // show created by admin (matching screenshot 5)
    adminEmail: {
      type: String,
      trim: true,
    },
    showId: {
      type: String,
      trim: true,
    },
    movieId: {
      type: String,
      trim: true,
    },
    theatreName: {
      type: String,
      trim: true,
    },
    showdate: {
      type: String,
      trim: true,
    },
    showtime: {
      type: String,
      trim: true,
    },
    tickets: {
      type: Object,
      default: () => ({ available: 120, booked: [] }),
    },

    // Relational fields for existing booking controllers
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theatre",
    },
    screenName: {
      type: String,
      default: "Screen 1",
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    price: {
      regular: { type: Number, default: 180, min: 0 },
      premium: { type: Number, default: 250, min: 0 },
    },
    totalSeats: { type: Number, default: 120 },
    availableSeats: { type: Number, default: 120 },
    status: {
      type: String,
      enum: ["scheduled", "cancelled", "completed"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

showSchema.pre("validate", function () {
  if (!this.showId) {
    this.showId = "SH_" + Date.now();
  }

  // Parse showdate and showtime into startTime if not set
  if (!this.startTime && this.showdate) {
    try {
      const timeStr = this.showtime || "14:00";
      this.startTime = new Date(`${this.showdate}T${timeStr}:00`);
      if (isNaN(this.startTime)) {
        this.startTime = new Date();
      }
    } catch (e) {
      this.startTime = new Date();
    }
  }

  if (this.startTime && !this.endTime) {
    this.endTime = new Date(this.startTime.getTime() + 2.5 * 60 * 60 * 1000);
  }
});

showSchema.index({ movie: 1, startTime: 1 });
showSchema.index({ theatre: 1, screenName: 1, startTime: 1 });
showSchema.index({ status: 1, startTime: 1 });

module.exports = mongoose.models.Show || mongoose.model("Show", showSchema);
try {
  mongoose.model("show", showSchema);
} catch (e) {
  // Already registered or aliased
}
