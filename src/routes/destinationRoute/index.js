import Router from 'express';
import { body } from 'express-validator';
import { addPlace, deletePlace, getPlaces, searchPlaces } from './places';
import { authenticateUser } from '../../middleware/authorization';
import { authenticateAdmin } from '../../middleware/adminAuth';

const placeRoute = Router();

const placeValidationRules = [
  body('place').notEmpty().withMessage('Place is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('picode').notEmpty().withMessage('Picode is required'),
  body('otherDetails.bestTimeToVisit.*.start').isISO8601().withMessage('Start date must be a valid date'),
  body('otherDetails.bestTimeToVisit.*.end').isISO8601().withMessage('End date must be a valid date'),
];

placeRoute.post('/add-place', placeValidationRules, authenticateUser,authenticateAdmin,addPlace);
placeRoute.delete('/delete-place/:id', authenticateUser,authenticateAdmin, deletePlace);
placeRoute.get('/search-place', searchPlaces);
placeRoute.get('/get-places',getPlaces);

export default placeRoute;