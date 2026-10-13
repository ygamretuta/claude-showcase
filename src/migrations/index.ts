import * as migration_20261013_033741_initial from './20261013_033741_initial';
import * as migration_20261013_043427_repository_activity from './20261013_043427_repository_activity';

export const migrations = [
  {
    up: migration_20261013_033741_initial.up,
    down: migration_20261013_033741_initial.down,
    name: '20261013_033741_initial',
  },
  {
    up: migration_20261013_043427_repository_activity.up,
    down: migration_20261013_043427_repository_activity.down,
    name: '20261013_043427_repository_activity'
  },
];
