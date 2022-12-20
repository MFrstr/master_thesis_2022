const express = require('express');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

const { Machine } = require('../models/machine.model');

const router = express.Router();
module.exports = router;

router.get('/list', list); // retrieve entries
router.post('/add', create); // add new machine entry
router.post('/update', update); // update existing machine entry
router.post('/delete', deleteMachine); // delete whole machine entry
router.post('/filter', filterCategory); // filter list of machines for category

async function list(req, res) {
  if (req.query.id) {
    const machine = await Machine.findOne({ _id: req.query.id }).exec();
    res.json(machine);
  } else {
    const machines = await Machine.find({});
    res.json(machines);
  }
}

// filter machines according to user selection from dropdown
async function filterCategory(req, res) {
  console.log(req.body);
  let cat = req.body.category;
  const machines = await Machine.find({
    category: {
      $in: cat,
    },
  }).exec();
  res.json(machines);
  // retrieve array of machines for selected category
}

async function create(req, res) {
  const machine = new Machine(req.body.machine);
  console.log(machine);
  machine.save(function (err) {
    if (err) {
      console.log(err);
      res.json({ status: 'failed', message: 'Could not be created!' });
    } else {
      res.json({
        status: 'success',
        message: 'New machine added!',
        //calEntry: result
        //somehow reference error result is
        // undefined when active
      });
    }
  });
}

async function update(req, res) {
  const machine = new Machine(req.body.machine);
  // console.log(machine._id);

  Machine.findOneAndUpdate(
    { _id: machine._id },
    {
      name: machine.name,
      category: machine.category,
      description: machine.description,
      materialList: machine['materialList'],
    },
    { new: true },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json({
          status: 'success',
          message: 'Machine updated!',
          calEntry: result,
        });
      }
    }
  );
}

async function deleteMachine(req, res) {
  const machine = req.body.machine;

  Machine.deleteOne({ _id: machine._id }, function (err) {
    if (err) {
      res.json({ status: 'error', message: "Machine couln't be deleted!" });
      console.log(error);
    } else {
      res.json({ status: 'success', message: 'Machine deleted!' });
    }
  });
}
