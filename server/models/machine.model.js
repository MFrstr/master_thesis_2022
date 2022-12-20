const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
  },
});

const MaterialListSchema = new mongoose.Schema({
  materials: {
    type: [MaterialSchema],
  },
});

const MachineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Fused Layer Modeling (FLM)',
        'Stereolithography (SL)',
        'Laser Sintering (SL)',
        'Laser Cutter',
        'Robot Arm',
        'Cutting Plotter',
        'CNC MILL',
        'Other',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    materialList: MaterialListSchema,
  }
  // {versionKey: false}
);

module.exports = {
  Machine: mongoose.model('Machine', MachineSchema),
  MachineSchema: MachineSchema,
};
