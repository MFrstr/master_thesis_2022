const express = require('express');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const { isDoStatement } = require('typescript');

const { CalEntry } = require('../models/calEntry.model');

const router = express.Router();
module.exports = router;

router.get('/list', list); // list all events
router.post('/list-registered', listRegistered); // find events a user registered for
router.post('/unregister', unregister); // a user unregisters
router.post('/add', create); // add new calEntry
router.post('/update', update); // update existing calEntry
router.post('/delete', deleteCalEntry); // delete existing calEntry
router.get('/filter', filterByDate); // filter events today "home"
router.post('/month', filterByMonth); // filter events for month

async function list(req, res) {
  if (req.query.id) {
    const calEntry = await CalEntry.findOne({ _id: req.query.id }).exec();
    res.json(calEntry);
  } else {
    // get all events sorted
    const calEntries = await CalEntry.find({}).sort({ startDate: 'asc' }).all();
    res.json(calEntries);
  }
}

async function listRegistered(req, res) {
  const registeredEvents = await CalEntry.find({
    _id: {
      $in: req.body.registrations,
    },
  }).exec();
  res.json(registeredEvents);
  // retrieve array of calEntry objects
}

async function unregister(req, res) {
  let id = req.body.calEntryId;
  let lang = req.body.lang;
  if (lang == 'eng') {
    // decrease english sum of registrations
    CalEntry.findByIdAndUpdate(
      { _id: id },
      {
        $inc: { numOfRegistrations: -1, requestsEnglish: -1 },
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
          res.json({
            status: 'error',
            message: 'Could not unregister from event.',
          });
        } else {
          res.json({
            status: 'success',
            message: 'User unregistered',
            calEntry: result,
          });
        }
      }
    );
    // decrease sum of german registrations
  } else if (lang == 'de') {
    CalEntry.findByIdAndUpdate(
      { _id: id },
      { $inc: { numOfRegistrations: -1, requestsGerman: -1 } },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json({
            status: 'success',
            message: 'User unregistered',
            calEntry: result,
          });
        }
      }
    );
  }
}

async function create(req, res) {
  const calEntry = new CalEntry(req.body.calEntry);

  calEntry.save(function (err) {
    //console.log(req.body.calEntry._id);
    if (err) {
      console.log(err);
      res.json({ status: 'failed', message: 'Could not be created!' });
    } else {
      res.json({
        status: 'success',
        message: 'New event added!',
      });
    }
  });
}

async function update(req, res) {
  console.log(req.body);
  // increase number for english registrations
  if (req.body.calEntryId && req.body.lang == 'eng') {
    let id = req.body.calEntryId;
    CalEntry.findOneAndUpdate(
      { _id: id },
      {
        $inc: { numOfRegistrations: 1, requestsEnglish: 1 },
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json({
            status: 'success',
            message: 'Registration done!',
            calEntry: result,
          });
        }
      }
    );
  } // increase number for german registrations
  else if (req.body.calEntryId && req.body.lang === 'de') {
    let id = req.body.calEntryId;
    // console.log(id);
    CalEntry.findOneAndUpdate(
      { _id: id },
      {
        $inc: { numOfRegistrations: 1, requestsGerman: 1 },
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json({
            status: 'success',
            message: 'Registration done!',
            calEntry: result,
          });
        }
      }
    );
    // update whole calEntry
  } else {
    const calEntry = new CalEntry(req.body.calEntry);
    // console.log(calEntry._id);
    CalEntry.findOneAndUpdate(
      { _id: calEntry._id },
      {
        startDate: calEntry.startDate,
        startTime: calEntry.startTime,
        endDate: calEntry.endDate,
        endTime: calEntry.endTime,
        title: calEntry.title,
        description: calEntry.description,
        location: calEntry.location,
        numOfRegistrations: calEntry.numOfRegistrations,
        requestsEnglish: calEntry.requestsEnglish,
        requestsGerman: calEntry.requestsGerman,
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json({
            status: 'success',
            message: 'Event updated!',
            calEntry: result,
          });
        }
      }
    );
  }
}

async function deleteCalEntry(req, res) {
  const calEntry = req.body.calEntry;

  // Delete the calendar entry object from db
  CalEntry.deleteOne({ _id: calEntry._id }, function (err) {
    if (err) {
      res.json({ status: 'error', message: "Event couln't be deleted!" });
      console.log(error);
    } else {
      res.json({ status: 'success', message: 'Event deleted!' });
    }
  });
}

async function filterByDate(req, res) {
  const today = new Date();
  today.setHours(1, 0, 0, 0);
  // console.log(today);
  // on localhost this loggs the current day -1
  // on localhost need (1, 0, 0, 0) to work
  // 2022-11-08T00:00:00.000Z

  const filteredEntries = await CalEntry.find({ startDate: today }).exec();
  res.json(filteredEntries);
}

// filter all calEntries for month of the event
// 1 - 12 for month values
// with 1 = january etc.
async function filterByMonth(req, res) {
  const month = req.body.month;
  CalEntry.find(
    {
      $expr: { $in: [{ $month: '$startDate' }, [month]] },
    },
    function (err, result) {
      if (err) {
        res.json({ status: 'error', message: 'Filter not wirking' });
        console.log(error);
      } else {
        // console.log(result);
        res.json({
          calEntries: result,
          status: 'success',
          message: 'Show events in ' + month,
        });
      }
    }
  );
}
