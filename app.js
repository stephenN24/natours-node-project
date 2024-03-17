const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const port = 3000;
const app = express();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

// Route handlers
const updateTourData = (dataToUpdate, tourID) => {
  const index = tours.findIndex((tour) => tour.id === tourID);
  tours[index] = { ...tours[index], ...dataToUpdate };
  return tours[index];
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id == id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  const newId = tours.at(-1).id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // Create new tour
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  const dataToUpdate = req.body;
  const tourId = +req.params.id;

  if (tourId >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid Id',
    });
  }

  const tour = updateTourData(dataToUpdate, tourId);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const deleteTour = (req, res) => {
  const tourId = +req.params.id;

  if (tourId >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid Id',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Routes
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//Start server
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
