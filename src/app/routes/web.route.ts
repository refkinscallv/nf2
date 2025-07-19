import Route from '@core/route.core';
import { HttpContext } from '@type/core';
import CoreCommon from '@core/common.core';

Route.get('/', ({ res }: HttpContext) => {
    res.send(`Welcome to ${CoreCommon.env('APP_NAME', 'Node Framework')}!`);
});
