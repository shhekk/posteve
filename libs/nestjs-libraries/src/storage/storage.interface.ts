export interface StorageInterface {
  //first make cloudinary service then make this interface accordingly
  // provider: string;
  // uploadFile:()=>Promise<any>
  uploadFile: (file: Express.Multer.File) => Promise<any>;
}