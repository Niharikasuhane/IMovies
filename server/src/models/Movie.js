const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    movieName: {
      type: String,
      trim: true,
      minlength: [2, "Movie name must be at least 2 characters long"],
      maxlength: [200, "Movie name cannot exceed 200 characters"],
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: [5, "Description must be at least 5 characters long"],
    },
    genres: {
      type: [String],
      validate: {
        validator: function (genres) {
          return !genres || (Array.isArray(genres) && genres.length > 0);
        },
        message: "At least one genre is required",
      },
    },
    genre: [{ type: String, trim: true }],
    releaseDate: {
      type: Date,
      required: [true, "Release date is required"],
      validate: {
        validator: function (date) {
          return date instanceof Date && !isNaN(date);
        },
        message: "Invalid release date",
      },
    },
    // Dedicated movie image field as requested
    movieImage: {
      type: String,
      default: "",
    },
    poster: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    language: {
      type: String,
      default: "Telugu",
      trim: true,
    },
    duration: {
      type: Number,
      default: 120,
      min: 1,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    certificate: {
      type: String,
      enum: ["U", "UA", "A", "S"],
      default: "UA",
    },
    trailerUrl: {
      type: String,
      default: "",
    },
    cast: [{ type: String }],
    director: { type: String, default: "" },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Synchronize aliases on save
movieSchema.pre("validate", function () {
  if (!this.title && this.movieName) this.title = this.movieName;
  if (!this.movieName && this.title) this.movieName = this.title;

  if ((!this.genres || this.genres.length === 0) && this.genre && this.genre.length > 0) {
    this.genres = this.genre;
  }
  if ((!this.genre || this.genre.length === 0) && this.genres && this.genres.length > 0) {
    this.genre = this.genres;
  }

  const img = this.movieImage || this.poster || this.image || "";
  if (img) {
    this.movieImage = img;
    this.poster = img;
    this.image = img;
  }
});


// Indexes for fast searching and filtering
movieSchema.index(
  { title: "text", movieName: "text", description: "text" },
  { default_language: "none", language_override: "textSearchLanguage" }
);
movieSchema.index({ genre: 1, language: 1 });
movieSchema.index({ isActive: 1, releaseDate: -1 });

module.exports = mongoose.model("Movie", movieSchema);

