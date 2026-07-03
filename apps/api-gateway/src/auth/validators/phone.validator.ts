import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { Transform } from 'class-transformer';
import { PHONE_NUMBER_COUNTRY_CODES } from '../constants/phone';

export function IsValidPhoneNumber(validationOptions?: ValidationOptions): PropertyDecorator {
  return function(target: object, propertyName: string | symbol): void {
    registerDecorator({
      name: 'IsValidPhoneNumber',
      target: target.constructor,
      propertyName: propertyName.toString(),
      constraints: [],
      options: {
        message: 'Invalid phone number format',
        ...validationOptions,
      },
      validator: {
        validate(value: string): boolean {
          if (!value) {
            return false;
          }

          const validCountryCode = PHONE_NUMBER_COUNTRY_CODES.find((code) =>
            value.startsWith(code),
          );

          if (!validCountryCode) {
            return false;
          }

          const phoneNumberWithoutCountryCode = value.replace(validCountryCode, '');

          const isValidPhoneNumber = /^\d{9}$/.test(phoneNumberWithoutCountryCode);

          return isValidPhoneNumber;
        },
        defaultMessage(args: ValidationArguments): string {
          return `"${args.value}" is not a valid phone number.`;
        },
      },
    });
  };
}

export function TransformPhoneNumber(): PropertyDecorator {
  return Transform(
    ({ value }: { value: string | null | undefined }): string | null => {
      if (!value) {
        return null;
      }

      const validCountryCode = PHONE_NUMBER_COUNTRY_CODES.find((code) =>
        value.startsWith(code),
      );

      if (validCountryCode) {
        const phoneNumberWithoutCountryCode = value.replace(
          validCountryCode,
          '',
        );

        if (/^\d{9}$/.test(phoneNumberWithoutCountryCode)) {
          return value;
        }
      }

      return null;
    },
  );
}
