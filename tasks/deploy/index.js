var utils = require('shipit-utils');

/**
 * Deploy task.
 * - deploy:fetch
 * - deploy:update
 * - deploy: build
 * - deploy:publish
 * - deploy:clean
 * - deploy:finish
 */

module.exports = function (gruntOrShipit) {
  require('./init')(gruntOrShipit);
  require('./fetch')(gruntOrShipit);
  require('./update')(gruntOrShipit);
  require('./build')(gruntOrShipit);
  require('./publish')(gruntOrShipit);
  require('./clean')(gruntOrShipit);
  require('./finish')(gruntOrShipit);

  utils.registerTask(gruntOrShipit, 'deploy', [
    'deploy:init',
    'deploy:fetch',
    'deploy:update',
    'deploy:build',
    'deploy:publish',
    'deploy:clean',
    'deploy:finish'
  ]);
};
