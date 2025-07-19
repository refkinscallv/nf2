import CoreHook from '@core/hooks.core';

CoreHook.register('system', 'before', async () => {
    console.log('[HOOK] Hook : before system');
});

CoreHook.register('system', 'after', async () => {
    console.log('[HOOK] Hook : after system');
});

CoreHook.register('system', 'shutdown', async () => {
    console.log('[HOOK] Hook : shutdown system');
});

export default {};
