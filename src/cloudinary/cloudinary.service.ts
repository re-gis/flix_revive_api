/* eslint-disable */
import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { Multer } from 'multer';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<cloudinary.UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        })
        .end(file.buffer);
    });
  }

  async uploadVideo(
    file: Express.Multer.File,
  ): Promise<cloudinary.UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          { resource_type: 'video', max_duration: 10800 },
          (e, result) => {
            if (e) {
              return reject(e);
            } else {
              return resolve(result);
            }
          },
        )
        .end(file.buffer);
    });
  }
}
