const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shortener');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn(`TIP: If you don't have MongoDB installed locally, create a free cluster at mongodb.com/atlas and add MONGODB_URI to your .env file!`);
    process.exit(1);
  }
};

const linkSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  original_url: { type: String, required: true },
  routing_rules: {
    android: { type: String, default: null },
    ios: { type: String, default: null },
    desktop: { type: String, default: null }
  },
  ab_test: {
    url_b: { type: String, default: null },
    traffic_split: { type: Number, default: 0 } // Percentage 0-100 that goes to B
  },
  is_malicious: { type: Boolean, default: false },
  short_code: { type: String, required: true, unique: true },
  custom_alias: { type: String, default: null },
  password: { type: String, default: null },
  expires_at: { type: Date, default: null },
  is_active: { type: Number, default: 1 },
  click_count: { type: Number, default: 0 },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

const clickSchema = new mongoose.Schema({
  link_id: { type: String, required: true, ref: 'Link' },
  ip: { type: String },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  referrer: { type: String, default: 'Direct' },
  hour: { type: Number },
}, { timestamps: { createdAt: 'clicked_at', updatedAt: false } });

// Mongoose sparse index for custom_alias to prevent duplicate non-null aliases
linkSchema.index({ custom_alias: 1 }, { unique: true, partialFilterExpression: { custom_alias: { $type: "string" } } });

const Link = mongoose.model('Link', linkSchema);
const Click = mongoose.model('Click', clickSchema);

module.exports = { connectDB, Link, Click };
