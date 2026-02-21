// apps/api/src/cloudinary/cloudinary.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                { folder: 'avatars' },
                (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
                    if (error) {
                        return reject(error);
                    }

                    if (!result) {
                        return reject(new Error('Cloudinary upload resulted in an empty response'));
                    }

                    resolve(result);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(upload);
        });
    }
}