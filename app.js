const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
  const dataToUpdate = req.body;
  const tourId = +req.params.id;

  if (tourId >= tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid Id',
    });
  }

  const tour = updateTour(dataToUpdate, tourId);
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

function updateTour(dataToUpdate, tourID) {
  const index = tours.findIndex((tour) => tour.id === tourID);
  tours[index] = { ...tours[index], ...dataToUpdate };
  return tours[index];
}

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
