import express, { NextFunction, Request, Response } from 'express';
import asyncHandler from '../helpers/asyncHandler';
import { SuccessMsgResponse, SuccessResponse } from '../core/ApiResponse';
import { InternalError } from '../core/ApiError';
import mongoose from 'mongoose';
import validator, { ValidationSource } from '../helpers/validator';
import { editSchema } from './schemas/edit-schema';
import { auth } from 'express-oauth2-jwt-bearer';
import axios from 'axios';
import { logSchema } from './schemas/log-schema';
import jwt_decode from 'jwt-decode';
import { User } from '@auth0/auth0-react';
import LogRepo from '../database/repository/LogRepo';

const validateAccessToken = auth({
  issuerBaseURL: 'https://dev-cy0zxa6lnzeog5qu.us.auth0.com',
  audience: 'https://dev-cy0zxa6lnzeog5qu.us.auth0.com/api/v2/',
});

const router = express.Router();

/**************************************
 *
 *  HEALTH CHECK
 *
 **************************************/
router.get(
  '/healthcheck',
  asyncHandler(async (req: Request, res: Response) => {
    const mongoStatus = mongoose.connection.readyState;
    if (mongoStatus === 1) {
      new SuccessResponse('API HEALTHY - DATABASE CONNECTED', new Date()).send(
        res
      );
    } else {
      throw new InternalError();
    }
  })
);

/**************************************
 *
 *  EDIT NAME
 *
 **************************************/
const editName = asyncHandler(async (req, res) => {
  const data = JSON.stringify({
    name: req.body.name,
  });

  const config = {
    method: 'patch',
    maxBodyLength: Infinity,
    url: `https://dev-cy0zxa6lnzeog5qu.us.auth0.com/api/v2/users/${req.body.userId}`,
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im91QjJoejFMYXpJUlJUblBVbVJLdyJ9.eyJpc3MiOiJodHRwczovL2Rldi1jeTB6eGE2bG56ZW9nNXF1LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJpaWUxdEx3c3JsYlJEZ0x0M0JWWW9NNjdZckJ5RmlQdkBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9kZXYtY3kwenhhNmxuemVvZzVxdS51cy5hdXRoMC5jb20vYXBpL3YyLyIsImlhdCI6MTY3ODczMTU3OSwiZXhwIjoxNjgxMzIzNTc5LCJhenAiOiJpaWUxdEx3c3JsYlJEZ0x0M0JWWW9NNjdZckJ5RmlQdiIsInNjb3BlIjoicmVhZDpjbGllbnRfZ3JhbnRzIGNyZWF0ZTpjbGllbnRfZ3JhbnRzIGRlbGV0ZTpjbGllbnRfZ3JhbnRzIHVwZGF0ZTpjbGllbnRfZ3JhbnRzIHJlYWQ6dXNlcnMgdXBkYXRlOnVzZXJzIGRlbGV0ZTp1c2VycyBjcmVhdGU6dXNlcnMgcmVhZDp1c2Vyc19hcHBfbWV0YWRhdGEgdXBkYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSBkZWxldGU6dXNlcnNfYXBwX21ldGFkYXRhIGNyZWF0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgcmVhZDp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfY3VzdG9tX2Jsb2NrcyBkZWxldGU6dXNlcl9jdXN0b21fYmxvY2tzIGNyZWF0ZTp1c2VyX3RpY2tldHMgcmVhZDpjbGllbnRzIHVwZGF0ZTpjbGllbnRzIGRlbGV0ZTpjbGllbnRzIGNyZWF0ZTpjbGllbnRzIHJlYWQ6Y2xpZW50X2tleXMgdXBkYXRlOmNsaWVudF9rZXlzIGRlbGV0ZTpjbGllbnRfa2V5cyBjcmVhdGU6Y2xpZW50X2tleXMgcmVhZDpjb25uZWN0aW9ucyB1cGRhdGU6Y29ubmVjdGlvbnMgZGVsZXRlOmNvbm5lY3Rpb25zIGNyZWF0ZTpjb25uZWN0aW9ucyByZWFkOnJlc291cmNlX3NlcnZlcnMgdXBkYXRlOnJlc291cmNlX3NlcnZlcnMgZGVsZXRlOnJlc291cmNlX3NlcnZlcnMgY3JlYXRlOnJlc291cmNlX3NlcnZlcnMgcmVhZDpkZXZpY2VfY3JlZGVudGlhbHMgdXBkYXRlOmRldmljZV9jcmVkZW50aWFscyBkZWxldGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGNyZWF0ZTpkZXZpY2VfY3JlZGVudGlhbHMgcmVhZDpydWxlcyB1cGRhdGU6cnVsZXMgZGVsZXRlOnJ1bGVzIGNyZWF0ZTpydWxlcyByZWFkOnJ1bGVzX2NvbmZpZ3MgdXBkYXRlOnJ1bGVzX2NvbmZpZ3MgZGVsZXRlOnJ1bGVzX2NvbmZpZ3MgcmVhZDpob29rcyB1cGRhdGU6aG9va3MgZGVsZXRlOmhvb2tzIGNyZWF0ZTpob29rcyByZWFkOmFjdGlvbnMgdXBkYXRlOmFjdGlvbnMgZGVsZXRlOmFjdGlvbnMgY3JlYXRlOmFjdGlvbnMgcmVhZDplbWFpbF9wcm92aWRlciB1cGRhdGU6ZW1haWxfcHJvdmlkZXIgZGVsZXRlOmVtYWlsX3Byb3ZpZGVyIGNyZWF0ZTplbWFpbF9wcm92aWRlciBibGFja2xpc3Q6dG9rZW5zIHJlYWQ6c3RhdHMgcmVhZDppbnNpZ2h0cyByZWFkOnRlbmFudF9zZXR0aW5ncyB1cGRhdGU6dGVuYW50X3NldHRpbmdzIHJlYWQ6bG9ncyByZWFkOmxvZ3NfdXNlcnMgcmVhZDpzaGllbGRzIGNyZWF0ZTpzaGllbGRzIHVwZGF0ZTpzaGllbGRzIGRlbGV0ZTpzaGllbGRzIHJlYWQ6YW5vbWFseV9ibG9ja3MgZGVsZXRlOmFub21hbHlfYmxvY2tzIHVwZGF0ZTp0cmlnZ2VycyByZWFkOnRyaWdnZXJzIHJlYWQ6Z3JhbnRzIGRlbGV0ZTpncmFudHMgcmVhZDpndWFyZGlhbl9mYWN0b3JzIHVwZGF0ZTpndWFyZGlhbl9mYWN0b3JzIHJlYWQ6Z3VhcmRpYW5fZW5yb2xsbWVudHMgZGVsZXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRzIGNyZWF0ZTpndWFyZGlhbl9lbnJvbGxtZW50X3RpY2tldHMgcmVhZDp1c2VyX2lkcF90b2tlbnMgY3JlYXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgZGVsZXRlOnBhc3N3b3Jkc19jaGVja2luZ19qb2IgcmVhZDpjdXN0b21fZG9tYWlucyBkZWxldGU6Y3VzdG9tX2RvbWFpbnMgY3JlYXRlOmN1c3RvbV9kb21haW5zIHVwZGF0ZTpjdXN0b21fZG9tYWlucyByZWFkOmVtYWlsX3RlbXBsYXRlcyBjcmVhdGU6ZW1haWxfdGVtcGxhdGVzIHVwZGF0ZTplbWFpbF90ZW1wbGF0ZXMgcmVhZDptZmFfcG9saWNpZXMgdXBkYXRlOm1mYV9wb2xpY2llcyByZWFkOnJvbGVzIGNyZWF0ZTpyb2xlcyBkZWxldGU6cm9sZXMgdXBkYXRlOnJvbGVzIHJlYWQ6cHJvbXB0cyB1cGRhdGU6cHJvbXB0cyByZWFkOmJyYW5kaW5nIHVwZGF0ZTpicmFuZGluZyBkZWxldGU6YnJhbmRpbmcgcmVhZDpsb2dfc3RyZWFtcyBjcmVhdGU6bG9nX3N0cmVhbXMgZGVsZXRlOmxvZ19zdHJlYW1zIHVwZGF0ZTpsb2dfc3RyZWFtcyBjcmVhdGU6c2lnbmluZ19rZXlzIHJlYWQ6c2lnbmluZ19rZXlzIHVwZGF0ZTpzaWduaW5nX2tleXMgcmVhZDpsaW1pdHMgdXBkYXRlOmxpbWl0cyBjcmVhdGU6cm9sZV9tZW1iZXJzIHJlYWQ6cm9sZV9tZW1iZXJzIGRlbGV0ZTpyb2xlX21lbWJlcnMgcmVhZDplbnRpdGxlbWVudHMgcmVhZDphdHRhY2tfcHJvdGVjdGlvbiB1cGRhdGU6YXR0YWNrX3Byb3RlY3Rpb24gcmVhZDpvcmdhbml6YXRpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVycyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGRlbGV0ZTpvcmdhbml6YXRpb25fbWVtYmVycyBjcmVhdGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIHVwZGF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBjcmVhdGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyByZWFkOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJfcm9sZXMgY3JlYXRlOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyByZWFkOm9yZ2FuaXphdGlvbl9pbnZpdGF0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uc19zdW1tYXJ5IGNyZWF0ZTphY3Rpb25zX2xvZ19zZXNzaW9ucyBjcmVhdGU6YXV0aGVudGljYXRpb25fbWV0aG9kcyByZWFkOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgdXBkYXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMgZGVsZXRlOmF1dGhlbnRpY2F0aW9uX21ldGhvZHMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.ho8nifpidzEeAo8-gZOn8FXMMexxNFIssBvaJzm_3B4E2bxdkTxZP65PkB-bksyk2PYmUegTQLfL7gCiDkrwYwhn9nesTuNY3sVGXBTbRf6r6kqexomUmuHoLl6cd1JuWTERzsjgDS9erqJzDxO7MXJRXhkj3A48VaAi60YXcKZBp5BxC9VOWkqapg_33FEXbFy2moG-l3-plQaai4KY9rDKqtkEaOCZrtsfZ8gnboHWRpwMNJ03SpdmkU7FKEyLh4nD9Pus94K7VQnjc0E6iVBt5OrZoDYfcwiK2SYL4uVkz9YRKEuACaqcmfhO6viCnXe81yMxLiltJ1_I7Cxp6Q',
      'Content-Type': 'application/json',
    },
    data: data,
  };

  const metadataResponse = await axios(config);
  // const response = await metadataResponse.json();
  console.log(metadataResponse);
  new SuccessResponse(
    'USERNAME CHANGED SUCCESSFULLY',
    metadataResponse.data
  ).send(res);
});

router.patch(
  '/name',
  validateAccessToken,
  validator(editSchema.request, ValidationSource.BODY),
  editName
);

/**************************************
 *
 *  LOGS
 *
 **************************************/

const getUserIdFromToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decodedToken: User = jwt_decode(req.headers.authorization);
    const userId = decodedToken.sub;
    req.params.userId = userId;
    return next();
  } catch (error) {
    next(error);
  }
};

router.get(
  '/logs/personal',
  validateAccessToken,
  getUserIdFromToken,
  validator(logSchema.findByUserId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const logs = await LogRepo.findByUserId(req.params.userId);
    return new SuccessResponse(`RETRIEVED USER'S LOGS SUCCESSFULLY`, logs).send(
      res
    );
  })
);

router.get(
  '/logs',
  validateAccessToken,
  asyncHandler(async (req, res) => {
    const logs = await LogRepo.findAll();
    return new SuccessResponse('LOGS RETRIVED SUCESSFULLY', logs).send(res);
  })
);

router.post(
  '/logs',
  validateAccessToken,
  getUserIdFromToken,
  validator(logSchema.insert, ValidationSource.BODY),
  asyncHandler(async (req, res) => {
    req.body.userId = req.params.userId;
    req.body.createdAt = new Date();
    await LogRepo.insert(req.body);
    return new SuccessMsgResponse('LOG CREATED SUCCESSFULLY').send(res);
  })
);

export default router;
