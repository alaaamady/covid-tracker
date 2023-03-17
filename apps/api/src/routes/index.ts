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
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
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
    url: `${process.env.AUTH0_DOMAIN}/api/v2/users/${req.body.userId}`,
    headers: {
      Authorization: `Bearer ${process.env.AUTH0_MANAGEMENT_API_ACCESS_TOKEN}`,
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
