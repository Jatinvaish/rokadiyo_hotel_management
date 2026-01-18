import { SetMetadata } from '@nestjs/common';

export const Unencrypted = () => SetMetadata('unencrypted', true);