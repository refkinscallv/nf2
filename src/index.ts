import 'module-alias/register'
import 'reflect-metadata';
import 'dotenv/config';
import '@app/hooks/register.hook';
import '@core/scope.core';

// Bootstrap
import CoreBoot from '@core/boot.core';

// Start the application
CoreBoot.run();
