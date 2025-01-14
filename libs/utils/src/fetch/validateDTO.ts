import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const validateDto = async <T extends object>(p: {
  dto: ClassConstructor<T>;
  data: T;
}): Promise<{ err: null | string[] }> => {
  const DTOInstance = plainToInstance(p.dto, p.data);
  const validationErrors = await validate(DTOInstance as T);
  console.log({validationErrors})

  if (validationErrors.length > 0) {
    let ErrorArray: string[] = [];

    validationErrors.map((error) => {
      ErrorArray = Object.values(error.constraints);
    });

    // return ErrorArray;
    return { err: ErrorArray };
  }

  return { err: null };
};
