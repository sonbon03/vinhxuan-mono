import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ArticleType } from '../entities/article.entity';

@ValidatorConstraint({ async: false })
export class IsSourceUrlRequiredConstraint implements ValidatorConstraintInterface {
  validate(sourceUrl: any, args: ValidationArguments) {
    const object = args.object as any;
    const type = object.type;

    // If type is NEWS, sourceUrl is required
    if (type === ArticleType.NEWS) {
      return sourceUrl !== undefined && sourceUrl !== null && sourceUrl.trim() !== '';
    }

    // For other types, sourceUrl is optional
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'URL nguồn là bắt buộc khi loại bài viết là NEWS';
  }
}

export function IsSourceUrlRequired(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSourceUrlRequiredConstraint,
    });
  };
}
