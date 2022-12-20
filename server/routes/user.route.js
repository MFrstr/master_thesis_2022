const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const userCtrl = require('../controllers/user.controller');

const router = express.Router();
const User = require('../models/user.model.js');

module.exports = router;

router.use(passport.authenticate('jwt', { session: false }));

router.route('/').post(asyncHandler(insert));

router.post('/list', list);
router.post('/update', update);
router.post('/register', register);
router.post('/unregister', unregister);

async function insert(req, res) {
  let user = await userCtrl.insert(req.body);
  res.json(user);
}

async function list(req, res) {
  if (req.query.id) {
    const user = await User.findOne({ _id: req.query.id }).exec();
    res.json(user);
  } else {
    const users = await User.find({});
    res.json(users);
  }
}

async function unregister(req, res) {
  if (req.body.calEntryId) {
    const user = User.findByIdAndUpdate(
      req.body.userId,
      {
        $pull: {
          registrations: {
            eventId: req.body.calEntryId,
          },
        },
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
          res.json({
            status: 'error',
            message: 'Could not unregister',
          });
        } else {
          res.json({
            status: 'success',
            message: 'User unregistered from event',
            user: result,
          });
        }
      }
    );
  }
}

async function register(req, res) {
  // register english
  if (req.body.lang == 'eng') {
    User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: {
          registrations: { eventId: req.body.calEntryId, language: 'eng' },
        },
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json({
            status: 'success',
            message: 'Registered for event (eng).',
            user: result,
          });
        }
      }
    );
  } else if (req.body.lang == 'de') {
    User.findByIdAndUpdate(
      req.body.userId,
      {
        $push: {
          registrations: { eventId: req.body.calEntryId, language: 'de' },
        },
      },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          res.json({
            status: 'success',
            message: 'Registered for event (de)',
            user: result,
          });
        }
      }
    );
  }
}

async function update(req, res) {
  // update from profile component
  const user = User.findByIdAndUpdate(
    req.body.id,
    {
      fullname: req.body.user.fullname,
      email: req.body.user.email,
    },
    { new: true },
    function (err, result) {
      if (err) {
        res.send(err);
        res.jsom({
          status: 'error',
        });
      } else {
        res.json({
          status: 'success',
          message: 'User updated',
          user: result,
        });
      }
    }
  );
}
