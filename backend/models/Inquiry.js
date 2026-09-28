const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    refId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    city: {
      type: String,
      default: "Bhubaneswar",
      trim: true
    },
    preferredDate: {
      type: String,
      default: "Earliest Available"
    },
    requirements: {
      type: String,
      default: "Turnkey Luxury Bathroom Renovation",
      trim: true
    },
    email: {
      type: String,
      default: "",
      trim: true
    },
    source: {
      type: String,
      default: "Website Form",
      trim: true
    },
    budget: {
      type: String,
      default: "",
      trim: true
    },
    bathroomType: {
      type: String,
      default: "",
      trim: true
    },
    collectionTier: {
      type: String,
      default: "",
      trim: true
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Assessment Scheduled", "Quotation Sent", "Converted", "Archived", "Deleted"],
      default: "New"
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
  },
  {
    timestamps: true
  }
);

// Virtual for formatted Indian Date/Time string
inquirySchema.virtual("formattedCreatedAt").get(function () {
  return this.createdAt
    ? new Date(this.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : "";
});

// Configure toJSON so virtuals and id are clean
inquirySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model("Inquiry", inquirySchema);
