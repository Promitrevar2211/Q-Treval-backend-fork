import Router from 'express';
import { body } from 'express-validator';
import { addPlace, deletePlace, getPlaces, searchPlaces } from './places';
import { authenticateUser } from '../../middleware/authorization';
import { authenticateAdmin } from '../../middleware/adminAuth';

const placeRoute = Router();

placeRoute.post('/add-place', authenticateUser,authenticateAdmin,addPlace);
placeRoute.delete('/delete-place/:id', authenticateUser,authenticateAdmin, deletePlace);
placeRoute.get('/search-place', searchPlaces);
//placeRoute.get('/get-places',getPlaces);

export default placeRoute;