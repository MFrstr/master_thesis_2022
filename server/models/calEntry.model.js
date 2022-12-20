const mongoose = require('mongoose');

const CalEntrySchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: true,
    },
    numOfRegistrations: {
      type: Number,
      default: 0,
    },
    requestsEnglish: {
      type: Number,
      default: 0,
    },
    requestsGerman: {
      type: Number,
      default: 0,
    },
  }
  // {versionKey: false}
);

module.exports = {
  CalEntry: mongoose.model('CalEntry', CalEntrySchema),
  CalEntrySchema: CalEntrySchema,
};
