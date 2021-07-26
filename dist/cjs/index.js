"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsDAO = void 0;
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
require('dotenv').config();
class AwsDAO {
    constructor() {
        this.s3 = this.connectS3();
        this.bucket = process.env.bucket_name || "";
        this.access_key = process.env.access_key_id || "";
        this.secretAccessKey = process.env.secret_access_key || "";
    }
    connectS3() {
        return new s3_1.default({
            apiVersion: '2006-03-01',
            region: 'ap-south-1',
            credentials: {
                accessKeyId: this.access_key,
                secretAccessKey: this.secretAccessKey,
            },
            signatureVersion: 'v4'
        });
    }
    /**
     * Upload files to AWS S3 bucket
     *
     * @param  {fileUploadOptions} file
     */
    fileUpload(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = {
                Bucket: this.bucket,
                Key: file.filePath,
                Body: file.buffer,
            };
            return this.s3.upload(params).promise();
        });
    }
    getFileSignedUrl(Key) {
        return new Promise((resolve, reject) => {
            console.log('--- getFileSignedUrl : Key :', Key);
            const params = { Bucket: this.bucket, Key };
            this.s3.getSignedUrlPromise('getObject', params)
                .then((res) => {
                console.log(res);
                resolve(res);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }
    getFileAsBuffer(Key) {
        return new Promise((resolve, reject) => {
            try {
                console.log('--- getFileAsBuffer  : Key :', Key);
                const params = {
                    Bucket: this.bucket,
                    Key: Key
                };
                this.s3.getObject(params, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.Body);
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
exports.AwsDAO = AwsDAO;
