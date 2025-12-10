import { Router } from 'express';
import { loginController, getTodayPriceController, getMaterialController, checkIndentDone, hanldeIndentController, submitOrder, indentOrder, getIndentOrders, breakAndSendToAPI } from '../controllers/Dealer.controller.js';
import { getDispatchTracking } from '../controllers/dispatch.controller.js';

const dealerRouter = Router();

dealerRouter.post('/login', loginController);
dealerRouter.get('/todayPrice', getTodayPriceController)
dealerRouter.get('/getMaterial', getMaterialController)
dealerRouter.post('/indentMaterial', hanldeIndentController)
// dealerRouter.get('/checkIndentDone/:SO',checkIndentDone)
dealerRouter.get("/checkIndentDone/:SO/:Material", checkIndentDone);
dealerRouter.post('/insert-order', submitOrder)
dealerRouter.post('/indent-order', indentOrder)
dealerRouter.get('/getIndentOrders', getIndentOrders)
dealerRouter.post('/break-orders', breakAndSendToAPI)
dealerRouter.get('/dispatch', getDispatchTracking)

export default dealerRouter;
