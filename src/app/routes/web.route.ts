import Route from '@core/route.core';
import { HttpContext } from '@type/core';
import CoreCommon from '@core/common.core';
import path from 'path';

Route.get('/', ({ res }: HttpContext) => {
    res.sendFile(path.join(__dirname, '../../../public/views/index.html'))
});
